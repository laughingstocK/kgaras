const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const port = 3000
const multer = require('multer')
const cors = require("cors")
const { v4: uuidv4 } = require('uuid')
const { Client } = require('ssh2')
const fs = require('fs')
const { executeCommand } = require('./handlers/command')
const { fileStorageEngine } = require('./handlers/fileStore')

const app = express()

app.use(bodyParser.json())
app.use(cors())

const upload = multer({ storage: fileStorageEngine });

app.post('/upload', upload.single('file'), (req, res) => {

  if (!req.file || req.file.length === 0) {
    console.log(req.files)
    return res.status(400).send('No files were uploaded.');
  }

  return res.json({
    message: "Files uploaded successfully",
    fileName: req.file.filename,
  })
})


function executeSSHCommand(host, username, privateKeyPath, command) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => {
      conn.exec(command, (err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        let output = '';

        stream
          .on('close', (code, signal) => {
            conn.end();
            resolve(output);
          })
          .on('data', (data) => {
            output += data;
          })
          .stderr.on('data', (data) => {
            // Handle stderr data if needed
          });
      });
    }).connect({
      host,
      port: 22,
      username,
      privateKey: fs.readFileSync(privateKeyPath),
    });

    conn.on('error', (err) => {
      console.log('>>', err)
      reject(err);
    });
  });
}


async function runSSHCommand(command) {
  try {
    const privateKeyPath = '/Users/krerkkiathemadhulin/.ssh/id_rsa';

    const output = await executeSSHCommand('localhost', 'rob', privateKeyPath, command);
    console.log('SSH command output:', output);
  } catch (err) {
    console.error('Error executing SSH command:', err);
  }
}

app.post('/repair', async (req, res) => {

  const { ontologyId1, ontologyId2 } = req.body

  if (!ontologyId1 || !ontologyId2) {
    return res.status(400).send('OntologyId1 or ontologyId2 is missing');
  }

  const requestId = uuidv4()

  res.status(201).send({
    requestId,
  })

  await runSSHCommand(`mkdir /usr/src/app/data/${requestId} && \
                       mkdir /usr/src/app/out/${requestId}`)

  const sshUser = 'rob'
  const logmapUrl = 'localhost'
  await executeCommand(
    `scp ./files/${ontologyId1} ${sshUser}@${logmapUrl}:/usr/src/app/data/${requestId} && \
     scp ./files/${ontologyId2} ${sshUser}@${logmapUrl}:/usr/src/app/data/${requestId} 
    `,
  );

  const java = '/opt/ibm/java/bin/java'
  const onto1Path = `file:/usr/src/app/data/${requestId}/${ontologyId1}`
  const onto2Path = `file:/usr/src/app/data/${requestId}/${ontologyId2}`
  const outputPath = `/usr/src/app/out/${requestId}`

  await runSSHCommand(`${java} -jar target/logmap-matcher-4.0.jar DEBUGGER ${onto1Path} ${onto2Path} TXT /usr/src/app/logmap-matcher/mymappings.txt ${outputPath} false true`)

  await runSSHCommand(`cd ../out && zip -r ${requestId}.zip ${requestId}`);

  await executeCommand(
    `scp ${sshUser}@${logmapUrl}:/usr/src/app/out/${requestId}.zip ./outputs`,
  );

  await runSSHCommand(`
  rm -rf /usr/src/app/out/${requestId} && \
  rm /usr/src/app/out/${requestId}.zip
  `);
})

app.get('/download', async (req, res) => {
  try {

    const { requestId } = req.body
    if (!requestId) {
      return res.status(400).send('RequestId is missing');
    }

    const filePath = path.join(__dirname, 'outputs', requestId + '.zip'); // Assuming xxx contains the filename
    console.log('File Path:', filePath);
    // const abc = '/Users/krerkkiathemadhulin/Documents/city/Project/KnowledgeGraphAlignmentRepairAsAService/files/Koon.txt'
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        return res.status(500).send('Error downloading file');
      }
    });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('An error occurred');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

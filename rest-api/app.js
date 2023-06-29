const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
const multer = require('multer');
const cors = require("cors");
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const { Client } = require('ssh2');
const util = require('util');
const fs = require('fs');

const execPromise = util.promisify(exec);

const app = express();

app.use(bodyParser.json());
app.use(cors());

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./files");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

// Define a route to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  // Access the uploaded files using req.files
  if (!req.file || req.file.length === 0) {
    console.log(req.files)
    return res.status(400).send('No files were uploaded.');
  }

  // File upload success
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

async function executeCommand(command) {
  try {
    const { stdout, stderr } = await execPromise(command);
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout:\n${stdout}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
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

  console.log(`>> zipping output`);
  await runSSHCommand(`cd ../out && zip -r ${requestId}.zip ${requestId}`);

  await executeCommand(
    `scp ${sshUser}@${logmapUrl}:/usr/src/app/out/${requestId}.zip ./outputs`,
  );

  await runSSHCommand(`
  rm -rf /usr/src/app/out/${requestId} && \
  rm /usr/src/app/out/${requestId}.zip
  `);
})

function executeJarCommand() {
  return new Promise((resolve, reject) => {
    const filename = 'Koon1.txt';
    const jarCommand = `java -jar FileCreator.jar ${filename} xxxx`;
    exec(jarCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing JAR file: ${error.message}`);
        reject(error); // Reject the promise if an error occurred
        return;
      }

      console.log('JAR file executed successfully!');
      console.log('Standard Output:', stdout);
      // console.error('Standard Error:', stderr);

      resolve(stdout); // Resolve the promise with the stdout value
    });
  });
}

app.get('/download', async (req, res) => {
  try {
    const xxx = await executeJarCommand();
    console.log('Returned Standard Output:', xxx);

    const filePath = path.join(__dirname, 'files', xxx); // Assuming xxx contains the filename
    console.log('File Path:', filePath);
    const abc = '/Users/krerkkiathemadhulin/Documents/city/Project/KnowledgeGraphAlignmentRepairAsAService/files/Koon.txt'
    res.download(abc, (err) => {
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

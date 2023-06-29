const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const multer = require('multer')
const cors = require("cors")
const { v4: uuidv4 } = require('uuid')
const { executeCommand } = require('./handlers/command')
const { fileStorageEngine } = require('./handlers/fileStore')
const { runSSHCommand } = require('./handlers/ssh')
const config = require('./config')

const { port, sshUser, logmapUrl } = config

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

app.post('/repair', async (req, res) => {
  const { ontologyId1, ontologyId2, alignId, refId, service } = req.body

  if (!ontologyId1 || !ontologyId2) {
    return res.status(400).send('OntologyId1 or ontologyId2 is missing');
  }

  if (!service) {
    return res.status(400).send('Service is required');
  }

  const requestId = uuidv4()

  res.status(201).send({
    requestId,
  })

  await runSSHCommand(`mkdir /usr/src/app/data/${requestId} && \
                       mkdir /usr/src/app/out/${requestId}`, service)

  if (service == 'logmap') {
    await executeCommand(
      `scp -P 22 ./files/${ontologyId1} ${sshUser}@${logmapUrl}:/usr/src/app/data/${requestId} && \
       scp -P 22 ./files/${ontologyId2} ${sshUser}@${logmapUrl}:/usr/src/app/data/${requestId} && \
       scp -P 22 ./files/${alignId} ${sshUser}@${logmapUrl}:/usr/src/app/data/${requestId}
      `,
    );

    const java = '/opt/ibm/java/bin/java'
    const onto1Path = `file:/usr/src/app/data/${requestId}/${ontologyId1}`
    const onto2Path = `file:/usr/src/app/data/${requestId}/${ontologyId2}`
    const alignPath = `/usr/src/app/data/${requestId}/${alignId}`
    const outputPath = `/usr/src/app/out/${requestId}`

    await runSSHCommand(`${java} -jar target/logmap-matcher-4.0.jar DEBUGGER ${onto1Path} ${onto2Path} RDF ${alignPath} ${outputPath} false true`, service)

    await runSSHCommand(`cd ../out && zip -r ${requestId}.zip ${requestId}`, service);

    await executeCommand(
      `scp -P 22 ${sshUser}@${logmapUrl}:/usr/src/app/out/${requestId}.zip ./outputs`,
    )

  } else if (service == 'alcomo') {
    await executeCommand(
      `scp -P 23 ./files/${ontologyId1} ${sshUser}@${logmapUrl}:/usr/src/app/data/${requestId} && \
       scp -P 23 ./files/${ontologyId2} ${sshUser}@${logmapUrl}:/usr/src/app/data/${requestId} && \
       scp -P 23 ./files/${alignId} ${sshUser}@${logmapUrl}:/usr/src/app/data/${requestId} && \
       scp -P 23 ./files/${refId} ${sshUser}@${logmapUrl}:/usr/src/app/data/${requestId}
      `,
    );

    const java = '/usr/bin/java'
    const onto1Path = `/usr/src/app/data/${requestId}/${ontologyId1}`
    const onto2Path = `/usr/src/app/data/${requestId}/${ontologyId2}`
    const alignPath = `/usr/src/app/data/${requestId}/${alignId}`
    const refPath = `/usr/src/app/data/${requestId}/${refId}`

    await runSSHCommand(`${java} -cp dist/alcomo.jar ExampleXYZ "${requestId}" "${onto1Path}" "${onto2Path}" "${alignPath}" "${refPath}"`, service)

    await runSSHCommand(`cd ../out && zip -r ${requestId}.zip ${requestId}`, service);

    await executeCommand(
      `scp -P 23 ${sshUser}@${logmapUrl}:/usr/src/app/out/${requestId}.zip ./outputs`,
    )

  }

  await runSSHCommand(`
  rm -rf /usr/src/app/out/${requestId} && \
  rm /usr/src/app/out/${requestId}.zip
  `, service)
})

app.get('/download', async (req, res) => {
  try {

    const { requestId } = req.body
    if (!requestId) {
      return res.status(400).send('RequestId is missing');
    }

    const filePath = path.join(__dirname, 'outputs', requestId + '.zip')

    res.download(filePath, (err) => {
      if (err) {
        console.error('Error downloading file:', err)
        return res.status(500).send('Error downloading file')
      }
    })
  } catch (error) {
    console.error('An error occurred:', error)
    res.status(500).send('An error occurred')
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})

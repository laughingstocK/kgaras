const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const multer = require('multer');
const cors = require("cors");
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');


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

// // Define a route to handle file uploads
// app.post('/repair', upload.array('files', 2), (req, res) => {
//   if (!req.files || req.files.length < 2) {
//     return res.status(400).send('No files were uploaded or two files are required');
//   }

//   console.log(2)
//   return res.send('Files uploaded successfully!')
// })

app.post('/repair', upload.array('files', 2), (req, res) => {
  if (!req.files || req.files.length < 2) {
    return res.status(400).send('No files were uploaded or two files are required');
  }

  console.log(2)
  return res.send('Files uploaded successfully!')
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

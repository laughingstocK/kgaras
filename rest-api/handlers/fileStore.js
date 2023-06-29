const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./files");
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + "-" + file.originalname);
    },
  });

  module.exports = {
    fileStorageEngine
  }
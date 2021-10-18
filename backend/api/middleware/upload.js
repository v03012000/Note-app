
const util = require("util");
const multer = require("multer");
const path=require('path');


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, './temp/'));
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  let uploadFile = multer({
    storage: storage,
    
  }).single("samplefile");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
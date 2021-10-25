
const util = require("util");
const multer = require("multer");
const path=require('path');


var storage = multer.diskStorage({   
  destination: function(req, file, cb) { 
     cb(null, 'uploads/');    
  }, 
  filename: function (req, file, cb) { 
     cb(null , file.originalname);   
  }
});

const  uploadFile =   multer({storage: storage}).single("samplefile");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;

var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
const util = require("util");

var auth = jwt({
  secret: "MY_SECRET",
  userProperty: 'payload',
  algorithms: ['HS256']
});

var ctrlHome = require('../controllers/home');
var ctrlAuth = require('../controllers/authentication');
let controller = require("../controllers/file.controller");
// profile
router.get('/home', auth, ctrlHome.homeRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
/*router.post('/upload', (req, res) => {
  console.log(`Successfully uploaded ${req.files.file.name}`);
  res.sendStatus(200);
});*/
router.post('/upload', controller.upload);
/*router.post('/upload', async (req, res) => {
  try {
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
          let file= req.files;
          console.log(file.file);
          //Use the mv() method to place the file in upload directory (i.e. "uploads")
          //file.file.mv('../uploads/');
          file.file.mv('../uploads/', function(err) {
            if (err) {
              return res.status(500).send(err);
            }
            
            res.send('File uploaded to 1');
          });
          //send response
          res.send({
              status: true,
              message: 'File is uploaded',
              data: {
                  name: file.file.name,
                  mimetype: file.file.mimetype,
                  size: file.file.size
              }
          });
      }
  } catch (err) {
      res.status(500).send(err);
  }
});*/
 

module.exports = router;
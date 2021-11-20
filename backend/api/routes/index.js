var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
const util = require("util");
const multer = require("multer");
const path=require('path');
var auth = jwt({
  secret: "MY_SECRET",
  userProperty: 'payload',
  algorithms: ['HS256']
});

var ctrlHome = require('../controllers/home');
var ctrlAuth = require('../controllers/authentication');
let ctrlFile = require("../controllers/file.controller");
let ctrlAdmin= require("../controllers/admin");
let ctrlNotes= require("../controllers/notes");

// home
router.get('/home', auth, ctrlHome.homeRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// upload
router.post('/upload', ctrlFile.upload);

var storage = multer.diskStorage({   
  destination: function(req, file, cb) { 
     cb(null, 'uploads/');    
  }, 
  filename: function (req, file, cb) { 
     cb(null , file.originalname);   
  }
});



router.get('/getUploads', ctrlAdmin.adminRead); 
router.get('/getNotes/:subject',ctrlNotes.NotesRead);
router.post('/:id/addreview',ctrlNotes.CreateReview);
router.get('/:id/getreviews',ctrlNotes.GetReviews);
router.post('/:id/verify',ctrlNotes.VerifyNotes);
router.post('/:id/delete',ctrlNotes.DeleteNotes);
router.get('/search/:id',ctrlNotes.Search);
module.exports = router;
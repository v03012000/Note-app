var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: "MY_SECRET",
  userProperty: 'payload',
  algorithms: ['HS256']
});

var ctrlHome = require('../controllers/home');
var ctrlAuth = require('../controllers/authentication');

// profile
router.get('/home', auth, ctrlHome.homeRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
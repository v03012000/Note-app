var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {

    console.log(username,password);
    User.findOne({ email: username }, function (err, docs) {
      console.log(docs);
      if (err){
        return done(err);
      }
      else if(docs.email===null || docs.email===undefined){
          console.log("Result : ",docs);
          return done(null,false,{message:'User not found'});
      }
      else if(!docs.verifyPassword(password)){
        return done(null, false, {message: 'Password is wrong'});
      }
      else{
        return done(null, docs);
      }
    });
  }
));
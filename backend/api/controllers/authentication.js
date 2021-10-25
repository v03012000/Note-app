var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

  module.exports.register = (req, res, next) => {
    var user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    user.role=req.body.role|| "user";
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }
    });
}

  module.exports.login = function(req, res,next) {
    passport.authenticate('local', function(err, user, info){
      var token;
      // If Passport throws/catches an error 
      if (err) {
        return next(err);
      }
      // If a user is found
      if(user){
        token = user.generateJwt();
        res.status(200);
        res.json({
          "role"  : user.role ,
          "token" : token
        });
      } else {
        // If user is not found
        res.status(401).json(info);
      }
    })(req, res,next);
  
  };

  
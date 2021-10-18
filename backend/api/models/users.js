
const bcrypt = require ('bcrypt');
let jwt = require('jsonwebtoken');
let mongoose = require('mongoose');
const saltRounds = 10;
var userSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: 'Email can\'t be empty'
    },
    username: {
      type: String,
      required: 'username can\'t be empty'
    },
    password: {
      type: String,
      required: 'Password can\'t be empty',
      minlength : [8,'Password must be atleast 8 character long']
  },
  saltSecret: String

  });

  userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

userSchema.pre('save', function (next) {
  bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
          this.password = hash;
          this.saltSecret = salt;
          next();
      });
  });
});

userSchema.methods.verifyPassword = function (password) {
 
  return bcrypt.compareSync(password, this.password);
};


  userSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
  
    return jwt.sign({
      _id: this._id,
      email: this.email,
      username: this.username,
      exp: parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET"); 
  };

  mongoose.model('User', userSchema);
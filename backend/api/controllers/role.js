var mongoose = require('mongoose');
var User = mongoose.model('User');
module.exports.adminRead =function isAdmin(req, res, next) {
    // Check if the requesting user is marked as admin in database
    if (!req.payload._id) {
        res.status(401).json({
          "message" : "UnauthorizedError: Not acessible"
        });
      } else {
        // Otherwise continue
        console.log(User.findById(req.payload._id)); 
      }
}

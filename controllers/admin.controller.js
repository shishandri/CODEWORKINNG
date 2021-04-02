const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = mongoose.model('User');

module.exports.adminHome = (req, res, next) =>{
    console.log('admin');
    // get all user in the db
    User.find({}, function(err, users) {
        var userMap = {};
        users.forEach(function(user) {
          userMap[user._id] = user;
        });
        res.send(userMap);
        console.log(userMap); 
      });
}
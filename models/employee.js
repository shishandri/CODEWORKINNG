const mongoose = require('mongoose');
var userSchema = new mongoose.Schema({

    ClientName:{type:String},
    ClientEmail:{type:String},
    ClientSkype:{type:String},
    ServerDetail:{type:String},

});
mongoose.model('Employee', userSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const passport= require('passport');
const _ = require('lodash');
var nodemailer = require('nodemailer');
const User = mongoose.model('User');
var crypto = require('crypto');
var async = require('async');
// const passwordResetToken = require('passwordResetToken');
const UserProfile = mongoose.model('upsertUserProfile');
let userid;
module.exports.register = (req, res, next) => {
   

    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.is_admin = false;
    user.is_staff = true;
    user.is_active = true;
  
   

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



module.exports.forgot=(req, res, next)=> 
{
//   console.log("hi");
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) 
        {
            User.findOne({ email: req.body.email }, function(err, user) {
                if(!user) {
                    req.flash('error', 'No acccount with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
               
                // res.send("User verification code sended to client "+token+" ");
                user.save(function(err,doc) {
                    if (!err)
                    
                    res.send(doc);
                    done(err, token, user);
                    // console.log(user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                    auth: {
                user: "shishandrikaul9@gmail.com",  
                pass:'$hree@123'
      }
    });
            var mailOptions = {
                to: user.email,
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://162.241.70.148:4200/new-password/' +token+ '\n\n' +
                'If you did not request this, please ignore                this email and your password will remain unchanged.\n'
                }
            smtpTransport.sendMail(mailOptions, function(err) 
            {
                req.flash('info', 'An e-mail has been sent to ' + user.email + ' with instructions as to how to change your password')
                done(err, 'done');
            });
        }
        ], function(err,doc) {
            if(err) return next(err);
            
            res.redirect('/forgot');
        });
       
 };

 module.exports.NewPassword=(req, res, next)=> 
 {
  
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    console.log(newPassword,sentToken);
    User.findOne({ resetPasswordToken  : sentToken },
        (err, user) => {
            if (!user)
              
                return res.status(422).json({status: false, message: 'try again session expired' });
            else
                bcrypt.hash(newPassword,12).then(hashedpassword =>
                {
                    user.password=newPassword;
                    user.resetPasswordToken=undefined;
                    user.expireToken=undefined;
                    user.save(function(err) {
                        return res.status(200).json({ status: true, message : 'Password reset sucessfully.'});
                    });
        });
 })
};

module.exports.authenticate = (req, res, next) => 
{
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}


module.exports.userProfile = (req, res, next) =>
{
    User.findOne({ _id: req._id }, 
        (err, user) => {
            if (!user)
                return res.status(404).json({status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['_id','fullName','email','is_active','is_staff','is_admin']) });
        }
    );
}
module.exports.getprofile = (req, res, next) =>
{
   console.log(userid);
   UserProfile.findOne({ userid:userid }, 
    (err, userPro) => 
    {
        if (!userPro)
            return res.status(404).json({status: false, message: 'User record not found.' });
        else
            return res.status(200).json({ status: true, userPro : _.pick(userPro,['address','gender','uploadedImage']) });
    }
);
}

module.exports.upsertUserProfile= (req, res, next) =>
{  
    console.log(req.file);
     console.log(req.body);
     itemIds = [];
    var userPro = new UserProfile();
    userid = req.body._id;
    // userPro.userid = req.body.userid;
    userPro.PersonalEmail =req.body.PersonalEmail;
    userPro.currentaddress=req.body.currentaddress;
    userPro.permanentaddress=req.body.permanentaddress;
    userPro.gender=req.body.gender;
    userPro.personalno=req.body.personalno;
    userPro.alternativeNo=req.body.alternativeNo;
    userPro.UserType=req.body.UserType;
    userPro.Tlassociated = req.body.Tlassociated;
    userPro.Nominename = req.body.Nominename;
    userPro.NominePhNumber = req.body.NominePhNumber;
    userPro.uploadedImage = 'http://localhost:3000/uploads/'+ req.file.filename;
    // userPro.DocumentUpload=req.body.DocumentUpload;
    // userPro.uploadedImage = 'http://localhost:3000/uploads/'+ req.files;
   
    // for (let i = 0; i < req.files.length; i++) 
    // {
    //     userPro.uploadedImage = 'http://localhost:3000/uploads/'+ req.files[i].filename;
    // }
    //  console.log(userPro.uploadedImage);
      if(userid)
    {
     UserProfile.findOneAndUpdate({userid: userid},{$set:{ 
       
        PersonalEmail: userPro.PersonalEmail,
        currentaddress: userPro.currentaddress,
        permanentaddress: userPro.permanentaddress,
        gender: userPro.gender,
        personalno: userPro.personalno,
        alternativeNo: userPro.alternativeNo,
        UserType: userPro.UserType,
        Tlassociated: userPro.Tlassociated,
        Nominename: userPro.Nominename,
        NominePhNumber: userPro.NominePhNumber,
        // DocumentUpload: userPro.DocumentUpload,
         uploadedImage: userPro.uploadedImage
    }}, {upsert: true}, (err, doc) => {
        if (!err) 
        {
            res.send(doc);
        }
       
    });
      }
     
        
}
module.exports.upsertUserProfilepic= (req, res, next) =>
{   
   
   console.log(req.body);
    console.log('hello');
    var userPro = new UserProfile();
    userid = req.body[1]._id;
    userPro.userid = req.body[1]._id;
    console.log(req.body[0].address);
    userPro.address = req.body[0].address;
    userPro.gender = req.body[0].gender;
    userPro.mobile = req.body[0].mobile;
    userPro.alternativeNo = req.body[0].alternativeNo;
  console.log(userPro)
      if(userid)
      {
     UserProfile.findOneAndUpdate({userid: userid},{$set:{address:userPro.address,mobile:userPro.mobile,gender:userPro.gender,alternativeNo:userPro.alternativeNo}}, {upsert: true}, (err, doc) => {
        if (!err) 
        {
            res.send(doc);
        }
       
    });
      }
     
        
}

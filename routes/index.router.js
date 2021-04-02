const express = require('express');
const router = express.Router();
const ctrlEmployee = require('../controllers/employeeController')
const ctrlUser = require('../controllers/user.controller');
const ctrlAdmin = require('../controllers/admin.controller');
const jwtHelper = require('../config/jwtHelper');

//image upload
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => 
    {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      console.log(file);
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      if(file.mimetype === 'image/doc') {
        filetype = 'doc';
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({storage: storage, limits : {fileSize : 1000000}});



router.get('/employees',ctrlEmployee.employee);
router.get('/get/:id',ctrlEmployee.getclientrecord);
router.put('/update/:id',ctrlEmployee.updateemployee);
router.delete('/delete/:id',ctrlEmployee.deleteemployee)
router.post('/employeepost', ctrlEmployee.employeepost);
router.post('/register',ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.post('/new-password/:token', ctrlUser.NewPassword);
router.post('/req-reset-password', ctrlUser.forgot);
router.get('/getprofile', ctrlUser.getprofile);
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.post('/updateUserProfile', upload.single('uploadedImage'),ctrlUser.upsertUserProfile);
// router.post('/updateUserProfile',  upload.fields([
//   {name: "uploadedImage", maxCount: 1},
//   {name: "DocumentUpload"}
// ]),ctrlUser.upsertUserProfile);
router.post('/updateUserProfilepic',ctrlUser.upsertUserProfilepic);

// Admin
router.get('/home', ctrlAdmin.adminHome);
// router.get('/delete',);
module.exports = router;




const mongoose = require('mongoose');
var userProfileSchema = new mongoose.Schema({
    userid:{
        type:String,
    },
    PersonalEmail:
    {
        type:String,
    },
    currentaddress:{
        type: String,
    },
    permanentaddress:{
        type: String,
    },
    gender:
    {
        type:Boolean,
    },
    personalno:{
        type: String,
    },
    alternativeNo:{
        type: String,
    },
    UserType:
    {
        type: String,
    },
    Tlassociated:
{
    type: String,
},
Nominename:
{
    type: String,
},
NominePhNumber:
{
    type: String,
},
// DocumentUpload:
// {
//     type: String,
// },
uploadedImage:{
        type: String,
        // required : true
    },
    },{ timestamps: true});

mongoose.model('upsertUserProfile', userProfileSchema);
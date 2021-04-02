const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
var ObjectId = require('mongoose').Types.ObjectId;

///get Employee///
module.exports.employee = (req, res, next) =>
{
Employee.find((err,docs)=>{
if(!err)
{res.send(docs);}
else{
    console.log('Error in retriving Employees:'+ JSON.stringify(err,undefined,2));
}
 });
}

module.exports.getclientrecord = (req, res, next) =>
{
if(!ObjectId.isValid(req.params.id))
      return res.status(400).send(`no record with given id: ${req.params.id}`);
Employee.findById(req.params.id,(err,docs)=>
{
    
    if(!err){res.send(docs);}
else{console.log('Error in retriving Employees:'+ JSON.stringify(err,undefined,2));}
 });
}


module.exports.employeepost = (req, res, next) => {
    var emp = new Employee();
    emp.ClientName = req.body.ClientName;
   // emp.position = req.body.position;
    emp.ClientEmail = req.body.ClientEmail;
    emp.ClientSkype = req.body.ClientSkype;
    emp.ServerDetail = req.body.ServerDetail;
    //emp.salary = req.body.salary
    emp.save((err, doc) => {
        if (!err)
            res.send(doc);
            else{
                console.log('Error in  Employees save:'+ JSON.stringify(err,undefined,2));}
             
    });
}
module.exports.updateemployee = (req, res, next) => 
{
if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);
    var emp = {
        ClientName: req.body.ClientName,
        ClientEmail: req.body.ClientEmail,
        ServerDetail: req.body.ServerDetail,
        ClientSkype: req.body.ClientSkype
    };
    Employee.findByIdAndUpdate(req.params.id, { $set: emp }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Record Update :' + JSON.stringify(err, undefined, 2)); }
    });
}
module.exports.deleteemployee = (req, res, next) => {
    // var id = req.params.id;
    if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.send(doc);
        }
        else { console.log('Error in employee delete :' +  JSON.stringify(err, undefined, 2)); }
    });

}

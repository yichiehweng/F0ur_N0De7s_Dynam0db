// Load the SDK for JavaScript
var AWS = require('aws-sdk');
var dynamo = require('dynamodb');
const Joi = require('joi');

dynamo.AWS.config.update({accessKeyId: "", secretAccessKey: "", region: "ap-southeast-1"});

var Account = dynamo.define('Account', {
    hashKey : 'email',
   
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps : true,
   
    schema : {
      email   : Joi.string().email(),
      name    : Joi.string(),
      age     : Joi.number(),
      roles   : dynamo.types.stringSet(),
      settings : {
        nickname      : Joi.string(),
        acceptedTerms : Joi.boolean().default(false)
      }
    }
  });

  function addMember(req, res) {
    res.render('addMember.hbs', {
        page : req.url});
}

function insertMember(req, res) {
  Account.create({email: req.body.email, createdAt: Date.now(), age: req.body.age, name: req.body.name}, function (err, acc) {
    console.log('created account in DynamoDB');
    res.redirect('/members');
  });
}

// app.post("/display", function(req, res) {
//   console.log("Display!!!");
//   insertMember(req, res);
// });

function retrieveMemberList(req, res) {
  Account.scan().loadAll().exec(function(err,rslt){
    if (err) console.log(err);
      membersResults = rslt.Items;
      console.log(membersResults);
      res.render('index.hbs', { members : membersResults });
  });
}

module.exports = {
    list : retrieveMemberList,
    add: addMember,
    save : insertMember,
}

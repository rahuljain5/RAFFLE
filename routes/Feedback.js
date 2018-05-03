var express = require('express');
var router = express.Router();
var DB = require('../utils/Database_Operations.js');
DB.CreateDBCollection('Faculty_Feedback', 'ClassRooms');

router.all('/', function(req, res) {

});

router.get('/:id', function(req, res) {
       DB.Query('Faculty_Feedback', 'ClassRooms', {classroom: req.params.id})
        .then(function(result){
            res.send(JSON.stringify(result));    
        })
    .catch(err=>{
        console.error("An Error Occoured getting the Class" + req.params.id);
        console.error(err);
    })
});

router.get('/ClassRooms', function(req, res) {
    DB.Find('Faculty_Feedback', 'ClassRooms')
    .then(function(classrooms){
        res.send(JSON.stringify(classrooms));
    })
    .catch(err=>{
        console.error("Error Occoured getting the Class Room :" + err);
        
    })
});

router.post('/NewClassRoom', function(req, res) {
    if(req.headers["content-type"]=='application/json') {
        DB.InsertOne('Faculty_Feedback', 'ClassRooms', req.body)
        .then(function(result){
            console.log(`New ClassRoom : ${req.body.classroom} Created at ${new Date().toLocaleString()}`);
            res.send(JSON.stringify({status: "success"}));
        })
        .catch(err=>{
            console.error("Error Occured Creating New ClassRoom");
        })
    }
    else 
    {
        res.send(JSON.stringify({status: "Failed", message: "Improper Content Type; JSON Expected."}));
    }
    console.log(req.headers["content-type"]);
});

module.exports = router;
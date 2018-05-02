var express = require('express');
var router = express.Router();
var DB = require('../utils/Database_Operations.js');

router.all('/', function(req, res) {

})

router.get('/ClassRooms', function(req, res) {
    var classrooms = DB.Find('Faculty_Feedback', 'ClassRooms');
    res.send(classrooms);
});

router.post('/NewClassRoom', function(req, res) {
    console.log(req.body);
    res.send("sent whatt i should have")
    

    
    // DB.InsertOne('Faculty_Feedback', 'ClassRooms', Class_Json);
})
module.exports = router;
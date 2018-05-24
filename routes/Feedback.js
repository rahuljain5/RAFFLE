var express = require('express');
var router = express.Router();
var DB = require('../utils/Database_Operations.js');
var FeedbackAnalyze = require('../utils/FeedbackAnalyze');
var config = require('../config/config.js');
const redis = require("../services/redis.js");

router.all('/', function (req, res) {
    res.send("<h1>Welcome to Faculty Feedback</h1>")
});

router.get('/:id', function (req, res) {
    DB.Query('Faculty_Feedback', 'ClassRooms', {
            _id: req.params.id
        })
        .then(function (result) {
            res.send(result);
        })
        .catch(err => {
            console.error("An Error Occoured getting the Class" + req.params.id);
            let failresponse = {
                error: true,
                errorMessage: err,
                userMessage: "An Error Occoured getting the Class" + req.params.id
            }
            console.error(err);
            res.send(failresponse);
        })
});

router.post('/ClassRooms', function (req, res) {
    DB.Find('Faculty_Feedback', 'ClassRooms')
        .then(function (classrooms) {
            console.log(`ClassRooms Query: JSON.stringify(${classrooms}) `)
            res.send(classrooms);
        })
        .catch(err => {
            console.error("Error Occoured getting the Class Room :" + err);
            let failresponse = {
                error: true,
                errorMessage: err,
                userMessage: "Error Occoured getting the Class Room :" + err
            }
            console.error(err);
            res.send(failresponse);
        })
});

router.post('/NewClassRoom', function (req, res) {
        var Classroom = req.body;
        if(req.body){
        DB.InsertOne('Faculty_Feedback', 'ClassRooms', Classroom)
            .then(function (result) {
                console.log(`New ClassRoom : ${Classroom.classroom} Created at ${new Date().toLocaleString()}`);
                res.send({
                    status: "success"
                });
            })
            .catch(err => {
                console.error("Error Occured Creating New ClassRoom");
                let failresponse = {
                    error: true,
                    errorMessage: err,
                    userMessage: "Error Occured Creating New ClassRoom"
                }
                console.error(err);
                res.send(failresponse);
            })
        }
    else 
    {
    res.send({
    status: "Failed",
    message: "Invalid Content Type"});
    }
});

router.post('/ClassDetail', function (req, res) {
    redis.get(req.query.classroom + req.query.batch, (err, cachedData) => {
        if (!err) {
            if (cachedData == null || cachedData == undefined) {
                DB.Query('Faculty_Feedback', 'ClassRooms', {
                        classroom: req.query.classroom,
                        batch: req.query.batch
                    })
                    .then(function (result) {
                        console.log("Got Result From DataBase");
                        redis.setex(req.query.classroom + req.query.batch, JSON.stringify(result), config.result_ttl);
                        res.send(result);
                    })
                    .catch(err => {
                        console.error("An Error Occoured getting the Class" + req.params.classroom + ", Batch" + req.params.batch);
                        let failresponse = {
                            error: true,
                            errorMessage: err,
                            userMessage: "An Error Occoured getting the Class" + req.params.classroom + ", Batch" + req.params.batch
                        }
                        console.error(err);
                        console.log(JSON.stringify(failresponse));
                    })
            } else {
                console.log("Got Result From Redis");
                res.send(cachedData);
            }
        } else console.error(err);
    })

})

router.post('/AddFeedback', function (req, res) {
    var  Feedback = req.body; // This is not needed As it is Parsed by body parser
    for (x in Feedback["feedback"]) {
        for (y in Feedback["feedback"][x])
            Feedback["feedback"][x][y]=parseInt(Feedback["feedback"][x][y])
    }
    console.log("feedBack: "+ JSON.stringify(Feedback));
    if (Feedback) {
        DB.InsertOne('Faculty_Feedback', 'Feedback', Feedback)
            .then(function (result) {
                console.log(`New FeedBack Recorded at: ${new Date().toLocaleString()}`);
                res.send({
                    status: "success"
                });
            })
            .catch(err => {
                let failresponse = {
                    error: true,
                    errorMessage: err,
                    userMessage: "An Error Occoured recording the Feedback"
                }
                console.error(err);
                console.log(failresponse)
            })
    } else {
        res.send({
            status: "Failed",
            message: "Improper Content Type; JSON Expected."
        });
    }
});

router.post('/Analyze', function (req, res) {
    redis.get("Analyze" + req.query.classroom + req.query.batch, (err, cachedData) => {
        if (!err) {
            if (cachedData == null || cachedData == undefined) {
                Promise.all(FeedbackAnalyze.Feedback(req.query.classroom, req.query.batch))
                    .then(function (values) {
                        FeedbackAnalyze.getTotalFeedbacksCount(req.query.classroom, req.query.batch, function (count) {
                            var fbjson = FeedbackAnalyze.toFeedbackJson(values, count);
                            console.log("Setting Value in Redis");
                            redis.setex("Analyze" + req.query.classroom + req.query.batch, JSON.stringify(values), config.result_ttl);
                            res.send(fbjson);
                        })
                    })
                    .catch(err => {
                    console.error(err);    
                    res.send({
                            error: true,
                            message: err,
                            userMessage: "Couldn't get any Stats at the moment."
                        });
                        
                    })
            } else {
                console.log("Getting Value from Redis");
                res.send(JSON.parse(cachedData));
            }
        } else {
            console.error(err);
        }
    })
})
module.exports = router;

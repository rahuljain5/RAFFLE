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
            classroom: req.params.id
        })
        .then(function (result) {
            res.send(JSON.stringify(result));
        })
        .catch(err => {
            console.error("An Error Occoured getting the Class" + req.params.id);
            console.error(err);
        })
});

router.post('/ClassRooms', function (req, res) {
    DB.Find('Faculty_Feedback', 'ClassRooms')
        .then(function (classrooms) {
            console.log(`ClassRooms Query: ${classrooms} `)
            res.send(JSON.stringify(classrooms));
        })
        .catch(err => {
            console.error("Error Occoured getting the Class Room :" + err);

        })
});

router.post('/NewClassRoom', function (req, res) {
    if (req.headers["content-type"] == 'application/json') {
        DB.InsertOne('Faculty_Feedback', 'ClassRooms', req.body)
            .then(function (result) {
                console.log(`New ClassRoom : ${req.body.classroom} Created at ${new Date().toLocaleString()}`);
                res.send(JSON.stringify({
                    status: "success"
                }));
            })
            .catch(err => {
                console.error("Error Occured Creating New ClassRoom");
            })
    } else {
        res.send(JSON.stringify({
            status: "Failed",
            message: "Improper Content Type; JSON Expected."
        }));
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
                        res.send(JSON.stringify(result));
                    })
                    .catch(err => {
                        console.error("An Error Occoured getting the Class" + req.params.classroom + ", Batch" + req.params.batch);
                        res.send("An Error Occoured getting the Class" + req.params.classroom + ", Batch" + req.params.batch);
                        console.error(err);
                    })
            } else {
                console.log("Got Result From Redis");
                res.send(cachedData);
            }
        } else console.error(err);
    })

})

router.post('/AddFeedback', function (req, res) {
    if (req.headers["content-type"] == 'application/json') {
        DB.InsertOne('Faculty_Feedback', 'Feedback', req.body)
            .then(function (result) {
                console.log(`New FeedBack Recorded at: ${new Date().toLocaleString()}`);
                res.send(JSON.stringify({
                    status: "success"
                }));
            })
            .catch(err => {
                console.error("Error Occured Creating New ClassRoom");
            })
    } else {
        res.send(JSON.stringify({
            status: "Failed",
            message: "Improper Content Type; JSON Expected."
        }));
    }
});

router.post('/Analyze', function (req, res) {
    redis.get("Analyze" + req.query.classroom + req.query.batch, (err, cachedData) => {
        if (!err) {
            if (cachedData == null || cachedData == undefined) {
                Promise.all(FeedbackAnalyze.Feedback(req.query.classroom, req.query.batch))
                    .then(function (values) {
                        analyze.getTotalFeedbacksCount(req.query.classroom, req.query.batch, function (count) {
                            values.push(count);
                            console.log("Setting Value in Redis");
                            redis.setex("Analyze" + req.query.classroom + req.query.batch, JSON.stringify(values), config.result_ttl);
                            res.send(JSON.stringify(values));
                        })
                    })
                    .catch(err => {
                        console.error(err);
                    })
            } else {
                console.log("Getting Value from Redis");
                res.send(cachedData);
            }
        } else {
            console.error(err);
        }
    })
})
module.exports = router;
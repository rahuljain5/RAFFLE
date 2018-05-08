var express = require('express');
var vtu = require('../utils/helper.js')
var ResultFetch = require('../services/Result_Fetch.js');
var config = require('../config/config.js');
var ResultAnalyzer = require('../utils/ResultAnalyze');
var router = express.Router();

router.get('/Analyze', function(req, res){
    
    Promise.all(ResultAnalyzer.Results())
    .then(function (values) {
        ResultAnalyzer.getTotalResultsCount( function (count) {
            console.log(count);
            values.sort("_id.Subcode");
            // var fbjson = FeedbackAnalyze.toFeedbackJson(values, count);
            // console.log("Setting Value in Redis");
            // redis.setex("Analyze" + req.query.classroom + req.query.batch, JSON.stringify(values), config.result_ttl);
            res.send(JSON.stringify(values));
        })
    })
    .catch(err => {
        res.send(JSON.stringify({
            error: true,
            message: err,
            userMessage: "Improper Content Type; JSON Expected."
        }));
        console.error(err);
    })

 })

router.get('/:id', function (req, res) {
    ResultFetch.scrape([req.params.id])[0].then(function (Result_Json) {
            res.setHeader('Content-Type', 'application/json');
            console.log('Result Fetched and Converted');
            res.write(JSON.stringify(Result_Json));
            res.send();
        })
        .catch(err => {
            console.error(err);
        });
 });

 
module.exports = router;

var express = require('express');
var vtu = require('../utils/helper.js')
var ResultFetch = require('../services/Result_Fetch.js');
var config = require('../config/config.js');
const redis = require("../services/redis.js");
var ResultAnalyzer = require('../utils/ResultAnalyze');
var router = express.Router();

router.post('/Analyze', function (req, res) {
    console.log(req.headers)
    console.log(`Received Request for Sem: ${req.query.semester} and Year: ${req.query.year}`);
    redis.get("Analyzed" + req.query.semester + "." + req.query.year, (err, cachedData) => {
        if (!err) {
            if (cachedData == null || cachedData == undefined) {
                Promise.all(ResultAnalyzer.Results(req.query.year, req.query.semester))
                    .then(function (values) {
                        ResultAnalyzer.getTotalResultsCount(req.query.year, req.query.semester, function (count, totalPassed) {
                            var AnalysisReport = ResultAnalyzer.toAnalyzedJson(values, count[0]);
                            AnalysisReport["TotalPassed"]=totalPassed
                            res.send(JSON.stringify(AnalysisReport));
                            console.log("Setting Value in Redis");
                            redis.setex("Analyzed" + req.query.semester + "." + req.query.year, JSON.stringify(AnalysisReport), config.result_ttl);
                        })
                    })
                    .catch(err => {
                        res.send(JSON.stringify(err));
                        console.error(err);
                    })
            } else {
                console.log("Getting Value from Redis");
                res.send(cachedData);
            }
        } else
            console.error(err);
    })
})

router.get('/:id', function (req, res) {
      redis.get(req.params.id, (err, cachedData) => {
        if (!err) {
            if (cachedData == null || cachedData == undefined) {
    ResultFetch.scrape([req.params.id])[0].then(function (Result_Json) {
            res.setHeader('Content-Type', 'application/json');
            console.log('Result Fetched and Converted');
        redis.setex(req.params.id, JSON.stringify(Result_Json), config.result_ttl);
            res.send(JSON.stringify(Result_Json));
        })
        .catch(err => {
            console.error(err);
        });
                } else {
                console.log("Getting Value from Redis");
                res.send(cachedData);
            }
        } else
            console.error(err);
    })
});


module.exports = router;

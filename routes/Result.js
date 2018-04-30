var express = require('express');
var vtu = require('../utils/helper.js')
var ResultFetch = require('../utils/Result_Fetch.js');
var config = require('../config/config.js')
var router = express.Router();

router.get('/:id', function (req, res) {
    ResultFetch.scrape([req.params.id])[0]
        .then(function (Result_Json) {
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

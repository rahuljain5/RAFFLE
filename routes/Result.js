var express = require('express');
var vtu = require('../utils/helper.js')
var ResultFetch = require('../utils/Result_Fetch.js');
var config = require('../config/config.js')
var router = express.Router();

router.get('/:id', function (req, res) {
    var result = ResultFetch.extract(req.params.id);
        console.log(result);
        res.send(result);
//         .then(function (Result_Json) {
//             res.setHeader('Content-Type', 'application/json');
//             console.log('Result Fetched and Converted');
//             res.write(JSON.stringify(Result_Json));
//             res.send();
//         })
//         .catch(err => {
//             console.error(err);
//         });
});
module.exports = router;

var express = require('express');
var vtu = require('../utils/helper.js')
var ResultFetch = require('../utils/Result_Fetch.js');
var config = require('../config/config.js')
var router = express.Router();

router.get('/:id', function(req, res) {
    var usn = [req.params.id];
    ResultFetch.scrape(usn);
});

module.exports = router;
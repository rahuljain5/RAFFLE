var express = require('express');
var vtu = require('../utils/helper.js')
var ResultFetch = require('../utils/Result_Fetch.js');
var config = require('../config/config.js')
var router = express.Router();

router.all('/', function (req, res) {
  try {
    // Generate USNs for class results
    var usn = vtu.UsnGenerator(config.test.usn);
    //Scrape and get Results
    ResultFetch.scrape(usn)
      .then(function (ResultJson) {
        console.log('Class Result Fetched and Converted');
        res.send('Class Result Fetched and Converted');
      })
      .catch(err => {
        console.error(err);
      });
  } catch (error) {
    throw (error);
    exit();
  }
});

module.exports = router;
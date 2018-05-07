var express = require('express');
var vtu = require('../utils/helper.js')
var ResultFetch = require('../services/Result_Fetch.js');
var config = require('../config/config.js')
var router = express.Router();

router.all('/', function (req, res) {
  try {
    // Generate USNs for class results
    var USNs = vtu.UsnGenerator(config.test.usn);
    //Scrape and get Results
    Promise.all(ResultFetch.scrape(USNs)).then(function(values) {
      // console.log(values);
      console.log("Class Results Retrieved");
      res.send(values);
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
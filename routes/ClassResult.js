var express = require('express');
var vtu = require('../utils/helper.js')
var ResultFetch = require('../services/Result_Fetch.js');
var config = require('../config/config.js')
var router = express.Router();

router.get('/', function (req, res) {
  try {
    // Generate USNs for class results
    var USNs = vtu.UsnGenerator(req.params.baseusn);
    //Scrape and get Results
    Promise.all(ResultFetch.scrape(USNs)).then(function(values) {
      // console.log(values);
      console.log("Class Results Retrieved");
      res.send(values);
    })
      .catch(err => {
        let failresponse = {
          error: true,
          errorMessage: err,
          userMessage: "Something Went wrong"
        }
        console.error(err);
        res.send(failresponse);
      });
  } catch (error) {
    throw (error);
    exit();
  }
});

module.exports = router;

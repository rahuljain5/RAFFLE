var express = require('express');
var Promise = require("bluebird");
var Helper = require('../utils/helper.js')
var ResultFetch = require('../utils/Result_Fetch.js');
var config = require('../config/config.js')
var router = express.Router();

router.all('/', function (req, res) {
  try {
    Helper.RangeUsnGenerator(req.query.baseusn, req.query.startusn, req.query.endusn, function (USNs) {
//       res.setHeader('Content-Type', 'application/json');
      console.log(USNs);
      //Scrape and get Results
      Promise.all(ResultFetch.scrape(USNs)).then(function(values) {
        console.log(values);
        res.send(values);
        console.log('Range Result Fetched and Converted');
        // console.log(Result_Json);  
        // res.write(JSON.stringify(Result_Json));  
      })
      .catch(err =>{
        res.send(err);
        console.error(err);
      }); 
    });
    
  } catch (error) {
    throw (error);
    exit();
  }
});

module.exports = router;

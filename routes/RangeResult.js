var express = require('express');
var Helper = require('../utils/helper.js')
var ResultFetch = require('../utils/Result_Fetch.js');
var config = require('../config/config.js')
var router = express.Router();

router.all('/', function (req, res) {
  try {
    Helper.RangeUsnGenerator(req.query.baseusn, req.query.startusn, req.query.endusn, function (usn) {
      res.setHeader('Content-Type', 'application/json');
      console.log(usn);
      //Scrape and get Results
      ResultFetch.scrape(usn)
      .then(function(Result_Json){
        console.log('Range Result Fetched and Converted');
        console.log(JSON.stringify(Result_Json));  
      })
      .catch(err =>{
        console.error(err);
      }); 
    });
    
  } catch (error) {
    throw (error);
    exit();
  }
});

module.exports = router;
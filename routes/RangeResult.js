var express = require('express');
var Helper = require('../utils/helper.js')
var ResultFetch = require('../utils/Result_Fetch.js');
var config = require('../config/config.js')
var router = express.Router();

router.all('/', function(req, res) {
try 
{
    console.log(req);
    Helper.RangeUsnGenerator(req.query.baseusn, req.query.startusn, req.query.endusn, function(usn){
       console.log(usn);
//Scrape and get Results
  ResultFetch.scrape(usn);  
  console.log('Range Result Fetched and Converted');
  res.send('Range Result Fetched and Converted');
  });    
}
catch (error) { throw(error);
exit();
}
});

module.exports = router;
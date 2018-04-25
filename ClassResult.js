var express = require('express');
var path = require('path');
var http = require('http');
var axi = require("axios");
var qs = require('qs');
var S = require('string');
var padder = require('zpad');
var vtu = require('./utils/helper.js')
var fetchObj = require('./utils/Result_Fetch.js');
var conf = require('./config/config.js')
try {
  // Generate USNs for class results
  var usn = vtu.UsnGenerator(conf.test.usn);
  //Scrape and get Results
  fetchObj.scrape(usn);  
  console.log('Class Result Fetched and Converted');
}
catch (error) { throw(error);
exit();
}


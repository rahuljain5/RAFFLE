var http = require('http');
var axi = require("axios");
var qs = require('qs');
var S = require('string');
var padder = require('zpad');
var fetchObj = require('./utils/Result_Fetch.js')
try {
  // Call the Async process that will fetch all class results
  fetchObj.scrape("1ox15cs");  
}
catch (error) { throw(error);
exit();
}
console.log('Task Finished');

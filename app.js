var http = require('http');
var axi = require("axios");
var qs = require('qs');
var S = require('string');
var padder = require('zpad');
var fetchObj = require('./models/Result_Fetch.js')
var vtu = require('./utils/helper.js')
try {
  // Call the Async process that will fetch all class results 
  fetchObj.scrape(7 digit USN here);  
}
catch (error) { throw(error);
exit();
}
console.log('Task Finished');

var http = require('http');
var axi = require("axios");
var qs = require('qs');
var S = require('string');
var padder = require('zpad');
var vtu = require('./utils/helper.js')
var fetchObj = require('./utils/Result_Fetch.js');
var conf = require('./config/config.js')
try {
  // Call the Async process that will fetch all class results
  var usn = vtu.UsnGenerator(conf.test.usn);
  fetchObj.scrape(usn);  
}
catch (error) { throw(error);
exit();
}
console.log('Task Finished');

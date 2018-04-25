var express = require('express');
var vtu = require('../utils/helper.js')
var fetchObj = require('../utils/Result_Fetch.js');
var conf = require('../config/config.js')
var router = express.Router();

router.get('/', function(req, res) {
try {
  // Generate USNs for class results
  var usn = vtu.UsnGenerator(conf.test.usn);
  //Scrape and get Results
  fetchObj.scrape(usn);  
  console.log('Class Result Fetched and Converted');
  res.send('Class Result Fetched and Converted');
}
catch (error) { throw(error);
exit();
}
});

module.exports = router;
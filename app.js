var http = require('http');
var axi = require("axios");
var qs = require('qs');
var S = require('string');
var vtu = require('./utils/helper.js')
axi.post('http://results.vtu.ac.in/results17/result_page.php', qs.stringify({ usn: 'usn_here' }))
  .then(function (response) {
    var str = S(response.data);
    if(str.contains("alert(\"University Seat Number is not available or Invalid..!\");")==false && str.contains("alert(\"Invalid USN Format..\");")==false)
  	{
  		vtu.parse_html(str);
		}
 	  else
     {
      console.log("Wrong USN macha!");
      }
  })
  .catch(function (error) {
    console.log(error);
  });

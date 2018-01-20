var http = require('http');
var axi = require("axios");
var qs = require('qs');
var S = require('string');
var vtu = require('./utils/utility.js')

//http.createServer(function (req, res) {
axi.post('http://results.vtu.ac.in/results17/result_page.php', qs.stringify({ usn: '1ox14cs068' }))
  .then(function (response) {
    //res.writeHead(200, {'Content-Type': 'text/html'});
    var str = S(response.data);
    if(str.contains("alert(\"University Seat Number is not available or Invalid..!\");")==false && str.contains("alert(\"Invalid USN Format..\");")==false)
  		{
  		vtu.processstring(str);
		}
 	else {console.log("Wrong USN macha!");}

  })
  .catch(function (error) {
    console.log(error);
  });
  /*
  function processstring(str)
  {
  	var sub="<div class=\"panel-heading text-center\">";
  	var strt=str.indexOf("<span class=\"glyphicon glyphicon-globe\"></span>");
  	var end=str.indexOf("<div class=\"panel-heading text-center\" style=\"background-color: rgba(163, 102, 47, 0.5);color: black;font-size: 15pt;\"><span class=\"glyphicon glyphicon-th-list\">");
    end-=strt;
    sub=str.substr(strt,end);
  	sub+="</div></div></div>";
  	var num= S(sub).count("<table");
  	var nameusn = S(sub).stripTags();
  	nameusn = nameusn.lines();
  	var result = S();
  	var arr= ['University Seat Number', 'Student Name', 'Subject Code', 'Subject Name', 'Internal Marks', 'External Marks', 'Total', 'Result']
  	for(var i=1,j=0;i<nameusn.length;i++)
  	{
  		nameusn[i] = S(nameusn[i]).collapseWhitespace().stripPunctuation();
  		if(!nameusn[i].isEmpty() && ! arr.includes(nameusn[i].s)) {result[j++]=nameusn[i].s;}
  	}
  	var student = convert(result);
}
function convert(result)
{
	var json = {usn : result[0], Name: result[1], Semester: result[2]};
  var i=3;j=1;
  var subdetails={};
  while(!(S(result[i]).contains('Total Marks')))
  {
    subject = {SubCode: result[i], SubName: result[i+1], Internal: result[i+2], External: result[i+3],SubTotal: result[i+4], SubRes: result[i+5]};
    subdetails['Sub' + j] = subject;
    i=i+6;
    j++;
  }
  json['Subject_results'] = subdetails;
  json[result[i]] = result[++i];
  json['result'] = result[++i];
  console.log(json);
  return json;
}
//}).listen(8080);
*/

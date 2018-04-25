var axios = require("axios");
var qs = require('qs');
var S = require('string');
var jsdom = require('jsdom');
var asyncProcess = require('async-process');
var padder = require('zpad');
var vtu = require('./helper.js')
var config = require('../config/config.js');
const {JSDOM} = jsdom;
//Function that scrapes results from VTU 
const scrape = (usn) => {
    //Function that will be called Asynchronously
    var scraper = function (rusn, cb) {
        //Send Request to VTU with string USN as POST 
        axios.post(config.result_url, qs.stringify({ lns: rusn }))
            .then(function (response) {

                var str = S(response.data);
                //Check if Result Exists or Not
                if (str.contains("alert(\"University Seat Number is not available or Invalid..!\");") != false) 
                {
                    console.log(rusn + "Failed/Doesn't Exist");
                }
                else
                {
                    var str, sems=[];
                    var Json = {};    
                // fs.readFile('sample result.html', 'utf8',function(err, str) {
                    //Convert Response HTML into DOM Object
                    var parser = new JSDOM(str);
                    //Access Result Tables using their Class
                    var tables = parser.window.document.getElementsByClassName("divTable");
                    //Get the Semesters for which Results are being displayed
                    sems = vtu.getSemesters(tables, str);
                    //Get Name and USN of Student
                    Json = vtu.getNameUsn(parser, Json);
                    //Get the Final JSON
                    Json.Results = vtu.ResultJsonParser(tables, sems);
                    console.log(Json);
                    // console.log(JSON.stringify(Json));
                }
            })
            .catch(err => {
                console.error("Failed with Status Code" + err.response.status);
              });
    }

    //Asynchronously send Requests
    new asyncProcess(usn, scraper, function () {
        //At this point all the USN requests are sent
        console.log("All usn have been processed");
        this.tasksFails.forEach(function (id) {
            console.warn("Requesting usn : " + id + " failed.");
        })
    });
}

exports.scrape = scrape;

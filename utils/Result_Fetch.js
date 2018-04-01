var http = require('http');
var axi = require("axios");
var qs = require('qs');
var S = require('string');
var jsdom = require('jsdom');
var asyncProcess = require('async-process');
var padder = require('zpad');
var vtu = require('./helper.js')
const {JSDOM} = jsdom;
const scrape = (base_usn) => {
    var usn = [];
    for (var i = 1; i < 120; i++) {
        i = padder(i, 3);
        usn[i - 1] = base_usn + i;
    }
    var scraper = function (rusn, cb) {
        axi.post('http://results.vtu.ac.in/vitaviresultcbcs/resultpage.php', qs.stringify({ lns: rusn }))
            .then(function (response) {

                var str = S(response.data);
                if (str.contains("alert(\"University Seat Number is not available or Invalid..!\");") != false) 
                {
                    console.log(rusn + "Failed/Doesn't Exist");
                }
                else
                {
                    var str, sems=[];
                    var Json = {};    
                // fs.readFile('sample result.html', 'utf8',function(err, str) {
                    var parser = new JSDOM(str);
                    var tables = parser.window.document.getElementsByClassName("divTable");
                    sems= vtu.getSemesters(tables, str);
                    Json = vtu.getNameUsn(parser, Json);
                    Json.Results = vtu.ResultJsonParser(tables, sems);
                    console.log(Json);
                    // console.log(JSON.stringify(Json));
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    new asyncProcess(usn, scraper, function () {
        //At this point all the files are loaded
        console.log("All usn have been processed");
        this.tasksFails.forEach(function (id) {
            console.warn("usn : " + id + " failed.");
        })
    });
}
exports.scrape = scrape;

var axios = require("axios");
var qs = require('qs');
var S = require('string');
var jsdom = require('jsdom');
var asyncProcess = require('async-process');
var padder = require('zpad');
var Helper = require('./helper.js');
var config = require('../config/config.js');
// var DB = require('./Database_Operations.js');
const {
    JSDOM
} = jsdom;
//Function that scrapes results from VTU 
const scrape =  (usns) => {
    return new Promise((resolve, reject) => {
        //Function that will be called Asynchronously
        usns.forEach(rusn => {
        //Send Request to VTU with string USN as POST 
            axios.post(config.result_url, qs.stringify({
                    lns: rusn
                }))
                .then(function (response) {

                    var str = S(response.data);
                    //Check for Status 200
                    if (response.status == 200) {
                        if (str.contains("alert(\"University Seat Number is not available or Invalid..!\");") != false) {
                            console.log(rusn + "Failed/Doesn't Exist");
                        } else {
                            var str, sems = [];
                            var Json = {};
                            //Convert Response HTML into DOM Object
                            var parser = new JSDOM(str);
                            //Access Result Tables using their Class
                            var tables = parser.window.document.getElementsByClassName("divTable");
                            //Get the Semesters for which Results are being displayed
                            sems = Helper.getSemesters(tables, str);
                            //Get Name and USN of Student
                            Json = Helper.getNameUsn(parser, Json);
                            //Get the Final JSON
                            Json.Results = Helper.ResultJsonParser(tables, sems);
                            // console.log(Json);
                            // console.log(JSON.stringify(Json));
                            resolve(Json);
                            console.log(`${rusn}: Result Fetch Completed`);
                        }
                    } else {
                        var error = `Request Returned ${response.status}: ${response.statusText}`;
                        reject(error);
                        console.error(error);
                    }
                })
                .catch(err => {
                    console.error("Connection could not be established.");
                    reject(err);
                });
        });
    
    });
}

exports.scrape = scrape;

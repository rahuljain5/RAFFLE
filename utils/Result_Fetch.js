var axios = require("axios");
var qs = require('qs');
var S = require('string');
var jsdom = require('jsdom');
var padder = require('zpad');
var Helper = require('./helper.js');
var config = require('../config/config.js');
// var DB = require('./Database_Operations.js');
const {
    JSDOM
} = jsdom;
//Function that scrapes results from VTU 

const extract = (usn) =>{
  return new Promise((resolve, reject) => {
            axios.post(config.result_url, qs.stringify({
                    lns: usn
                }))
                .then(function (response) {
                    var str = S(response.data);
                    if (response.status == 200) {
                        if (str.contains("alert(\"University Seat Number is not available or Invalid..!\");") != false) {
                            console.log(usn + " Failed/Doesn't Exist");
                            reject(usn + " Failed/Doesn't Exist");
                        } else {
                            var str, sems = [];
                            var responeData = {};
                            var parser = new JSDOM(str);
                            var tables = parser.window.document.getElementsByClassName("divTable");
                            sems = Helper.getSemesters(tables, str);
                            responeData = Helper.getNameUsn(parser, responeData);
                            responeData.Results = Helper.ResultJsonParser(tables, sems);
                          	console.log("Inside Axios Respone => "+ responeData)
                            resolve(responeData);
                           // console.log(`${usn}: Result Fetch Completed`);
                        }
                    } else {
                        var error = `Request Returned ${response.status}: ${response.statusText}`;
                        reject(error);
                        //console.error(error);
                    }
                })
                .catch(err => {
                    console.error("Connection could not be established.");
                    reject(err);
                });
  });
  
}

const scrape = (USNs) => {
    return USNs.map(extract);
}

exports.scrape = scrape;
exports.extract = extract;

var axios = require("axios");
var qs = require('qs');
var S = require('string');
var jsdom = require('jsdom');
var padder = require('zpad');
var Helper = require('./helper.js');
var config = require('../config/config.js');
const redis = require("../services/redis");
// var DB = require('./Database_Operations.js');
const {
  JSDOM
} = jsdom;
//Function that scrapes results from VTU

const extract = (usn) => {
  return new Promise((resolve, reject) => {
    redis.get(usn, (err, cachedData) => {
      console.log("USN: " + usn + " Cached Data: " + cachedData);
      if (cachedData != undefined && cachedData != null) {
        console.log("Resolve data from redis");
        resolve(JSON.parse(cachedData));
      } else {
        console.log("Check Result for " + usn + " at URL:" + config.result_url);
        axios.post(config.result_url, qs.stringify({
            lns: usn
          }))
          .then(function(response) {
            var str = S(response.data);
            if (response.status == 200) {
              if (str.contains("alert(\"University Seat Number is not available or Invalid..!\");") != false) {
                //                             console.log(usn + " Failed/Doesn't Exist");
                let failresponse = {
                  error: true,
                  errorMessage: "USN not found " + usn,
                  userMessage: usn + " Failed/Doesn't Exist"
                }
                //redis.setex(usn, JSON.stringify(failresponse), config.result_ttl);
                resolve(failresponse);
              } else {
                var str, sems = [];
                var responseData = {};
                var date = new Date();
                var parser = new JSDOM(str);
                var tables = parser.window.document.getElementsByClassName("divTable");
                sems = Helper.getSemesters(tables, str);
                responseData = Helper.getNameUsn(parser, responseData);
                responseData.timestamp = `${date.getMonth()}-${date.getFullYear()}`;
                responseData.Results = Helper.ResultJsonParser(tables, sems);
                //                           	console.log("Inside Axios Respone => "+ responseData)
                responseData["error"] = false;
                console.log("Set data in Redis");
                redis.setex(usn, JSON.stringify(responseData), config.result_ttl); //TTL 14Days
                //                             redis.set(usn,JSON.stringify(responseData));
                console.log("Resolve Response");
                resolve(responseData);
                console.log(`${usn}: Result Fetch Completed`);
              }
            } else {
              var error = `Request Returned ${response.status}: ${response.statusText}`;
              resolve({
                error: true,
                errorMessage: error,
                userMessage: "Unable to Process the Request"
              });
            }
          })
          .catch(err => {
            console.error("Connection could not be established.");
            resolve({
              error: true,
              errorMessage: err,
              userMessage: "Unable to Process the Request"
            });
          });
      }
    })
  });

}

const scrape = (USNs) => {
  return USNs.map(extract);
}

exports.scrape = scrape;
exports.extract = extract;

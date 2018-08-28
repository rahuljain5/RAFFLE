var axios = require("axios");
var qs = require('qs');
var S = require('string');
var jsdom = require('jsdom');
var padder = require('zpad');
var Helper = require('../utils/helper.js');
var config = require('../config/config.js');
var DB = require('../utils/Database_Operations.js');
const redis = require("../services/redis");
// var DB = require('./Database_Operations.js');
const {
  JSDOM
} = jsdom;

const extract = (usn) => {
  var tokenId;
  return new Promise((resolve, reject) => {
    redis.get(usn, (err, cachedData) => {
      // console.log("USN: " + usn + " Cached Data: " + cachedData);
      if (cachedData != undefined && cachedData != null) {
        console.log("Resolve data from redis");
        resolve(JSON.parse(cachedData));
      } else {
        Helper.gettokenId()
        .then(function(token){ tokenId = token})
        .catch (err => {
            console.error("Token Could not be Found.");
        });
        console.log("Check Result for " + usn + " at URL:" + config.result_url);
        axios.post(config.result_url, qs.stringify({
            lns: usn,
            token: tokenId
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
                responseData.Yearstamp = `${date.getFullYear()}`;
                responseData.Results = Helper.ResultJsonParser(tables, sems);
                //                           	console.log("Inside Axios Respone => "+ responseData)
                responseData["error"] = false;
                console.log("Set data in Redis");
                DB.InsertOne('Result_analyzer', 'Results', responseData)
                .then(function (result) {
                    console.log(`${usn} Result pushed into DB at: ${new Date().toLocaleString()}`);
                })
                .catch(err => {
                    let failresponse = {
                        error: true,
                        errorMessage: err,
                        userMessage: "An Error Occoured pushing into DB"
                    }
                    console.error(failresponse);
                  })
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

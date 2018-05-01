var axios = require("axios");
var qs = require('qs');
var S = require('string');
var jsdom = require('jsdom');
var padder = require('zpad');
var Helper = require('./helper.js');
var config = require('../config/config.js');
const redis = require("../services/redis")
// var DB = require('./Database_Operations.js');
const {
    JSDOM
} = jsdom;
//Function that scrapes results from VTU 

const extract = (usn) =>{
  return new Promise((resolve, reject) => {
            const cachedData = redis.get(usn);
            if(cachedData != null)
                resolve(JSON.parse(cachedData));
            else{
                console.log("Check Result for "+usn+" at URL:" +config.result_url);
            axios.post(config.result_url, qs.stringify({
                    lns: usn
                }))
                .then(function (response) {
                    var str = S(response.data);
                    if (response.status == 200) {
                        if (str.contains("alert(\"University Seat Number is not available or Invalid..!\");") != false) {
//                             console.log(usn + " Failed/Doesn't Exist");
                            resolve({error:true, errorMessage:"USN not found "+usn,userMessage:usn + " Failed/Doesn't Exist"});
                        } else {
                            var str, sems = [];
                            var responeData = {};
                            var parser = new JSDOM(str);
                            var tables = parser.window.document.getElementsByClassName("divTable");
                            sems = Helper.getSemesters(tables, str);
                            responeData = Helper.getNameUsn(parser, responeData);
                            responeData.Results = Helper.ResultJsonParser(tables, sems);
//                           	console.log("Inside Axios Respone => "+ responeData)
                            responeData["error"] = false;
                            console.log("Set data in Redis");
                            redis.setex(usn,JSON.stringify(responeData),600);//TTL 10min
//                             redis.set(usn,JSON.stringify(responeData));
                            console.log("Resolve Response");
                            resolve(responeData);
                           console.log(`${usn}: Result Fetch Completed`);
                        }
                    } else {
                        var error = `Request Returned ${response.status}: ${response.statusText}`;
                        resolve({error:true,errorMessage:error,userMessage:"Unable to Process the Request"});
                        //console.error(error);
                    }
                })
                .catch(err => {
                    console.error("Connection could not be established.");
                   resolve({error:true,errorMessage:err,userMessage:"Unable to Process the Request"});
                });
  }
   });
  
}

const scrape = (USNs) => {
    return USNs.map(extract);
}

exports.scrape = scrape;
exports.extract = extract;

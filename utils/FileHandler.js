var fs = require('fs');
var csvReader = require('csvreader');
var ResultFetch = require('../services/Result_Fetch.js');

const UsnFromCSV = (csv_filename, callback) => {
  function recordHandler(data) {
    arr.push(data[0]);
  }
  var arr = [];
  csvReader
    .read(csv_filename, recordHandler)
    .then(() => {
      console.log('USN Generated from the CSV file at ' + csv_filename);
      callback(arr);
    })
    .catch(err => {
      console.error(err);
    });
}

const CSVResultFetch = (path, res) => {
  UsnFromCSV(path, function (USNs) {
    console.log("Usn Array Formed");
    Promise.all(ResultFetch.scrape(USNs)).then(function(values) {
      console.log(values);
      res.send(values);
      console.log("Result Fetched");
      fs.unlink(path, function (err) {
        if (err) return console.log("File Deletion:" + err);
        console.log('file deleted successfully');
      });    
    })
    .catch(err => {
      console.error(err);
    });
  });
}

exports.UsnFromCSV = UsnFromCSV;
exports.CSVResultFetch = CSVResultFetch;
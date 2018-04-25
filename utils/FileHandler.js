var fs = require('fs');
var csvReader = require('csvreader');
var Result_Fetch = require('./Result_Fetch.js');

const UsnFromCSV = (csv_filename, callback) =>
{
  function recordHandler(data)
  {
    arr.push(data[0]);
  }
  var arr =[];
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

const CSVResultFetch = (path) =>
{
  UsnFromCSV(path,function(usn){
    console.log("Usn Array Formed");
    Result_Fetch.scrape(usn);
  });
  fs.unlink(path,function(err){
    if(err) return console.log(err);
    console.log('file deleted successfully');
});  
}

exports.UsnFromCSV = UsnFromCSV;
exports.CSVResultFetch = CSVResultFetch;
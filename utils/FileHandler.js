var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var csvReader = require('csvreader');

const UsnFromCSV = (csv_filename, callback) =>
{
  function recordHandler(data){
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

exports.UsnFromCSV = UsnFromCSV;


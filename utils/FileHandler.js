var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var csvReader = require('csvreader');

const FileUploader = () =>
{
    var newpath;
    if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      newpath = './tmp/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
 });
 }
 return newpath;
}  
const UsnFromCSV = (csv_filename, callback) =>
{
  function recordHandler(data){
    arr.push(data[0]);
}
var arr =[];
csvReader
  .read("File1.csv", recordHandler)
  .then(() => {
    console.log('USN Generated from the CSV file at ' + csv_filename);
    callback(arr);
  })
  .catch(err => {
    console.error(err);
  });
}

exports.FileUploader = FileUploader;
exports.UsnFromCsv = UsnFromCsv;


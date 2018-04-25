var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var file_handler = require('./FileHandler.js');
var fetchObj = require('../utils/Result_Fetch.js');
var express = require('express');
var multer  = require('multer');
var upload = multer({ dest: 'tmp/' });
var app = express();

http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
        app.post('/filetoupload', upload.single('filetoupload'), function (req, res, next) {
            var oldpath = req.file.path;
            console.log(oldpath);
            var newpath = "./tmp/" + req.file.name;
            console.log(newpath);
            // fs.rename(oldpath, newpath, function (err) {
            //   if (err) throw err;
              res.write('File uploaded');
              console.log("File Uploaded and Moved to: " + newpath);
              file_handler.UsnFromCSV(newpath,function(usn){
                console.log("Usn Array Formed");
                fetchObj.scrape(usn);
        //   })
         });
          res.end();
        });
   }
 else 
 {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="http://localhost:3000/CSVResult" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(8080); 
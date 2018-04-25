var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var file_handler = require('./FileHandler.js');
var fetchObj = require('../utils/Result_Fetch.js');

http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
  var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.path;
        console.log(oldpath);
        var newpath = "./tmp/" + files.filetoupload.name;
        console.log(newpath);
        fs.rename(oldpath, newpath, function (err) {
          if (err) throw err;
          res.write('File uploaded');
          console.log("File Uploaded and Moved to: " + newpath);
          file_handler.UsnFromCSV(newpath,function(usn){
            console.log("Usn Array Formed");
            fetchObj.scrape(usn);
         });
          res.end();
        });
   });
}
 else 
 {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(8080); 
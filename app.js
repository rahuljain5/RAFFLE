var express = require('express');
var cluster = require('cluster');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
const models = require("./models");
var index = require('./routes/index.js');
var users = require('./routes/users.js');
var ClassResult = require('./routes/ClassResult.js');
var file_handler = require('./utils/FileHandler.js');
var RangeResult = require('./routes/RangeResult.js');
var Result = require('./routes/Result.js');
const sessionAuth = require("./middleware/sessionAuth.js")
var DB = require('./utils/Database_Operations');
var Feedback = require('./routes/Feedback.js');
var upload = multer({ dest: 'tmp/' });
var env = process.env.NODE_ENV || "development";
var config = require("./config/config.js")[env];
  

const  initmiddleware  = (app) =>{
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "access-control-allow-origin");
  res.header("Access-Control-Allow-Headers", "X-SESSION-KEY");
  next();
 });

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users/otp', sessionAuth);
}

const initroutes = (app) => {

  app.use('/', index);

  app.use('/users', users);

  app.use('/ClassResult', ClassResult);

  app.use('/RangeResult', RangeResult);

  app.use("/Result", Result);

  app.use("/Feedback", Feedback);

  app.post('/CSVResult', upload.single('filetoupload'), function (req, res) {
    console.log("File Saved At:" + req.file.path);
    file_handler.CSVResultFetch(req.file.path, res);
  });

  app.post("/DBinit", function(req, res){
    DB.DBinit();
  })
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
}
const startserver = (app) => {
  var port = process.env.PORT || 3000;
  app.listen(port);
  console.log(`Server Started on Port: ${port} at ${new Date().toLocaleString()}`);
}

if(cluster.isMaster) {
    var numWorkers = require('os').cpus().length;
  models.sequelize.sync({
    force: config.resetdb
  }).then(()=>{
    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for(var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }})
    .catch((err) =>{
      console.error("Erorr: "+err)
    })

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
  var app = express();
  app.all('/pid', function(req, res) {res.send('process ' + process.pid + ' says hello!').end();})//can be removed
    initmiddleware(app);
    initroutes(app);
    startserver(app);
  module.exports = app;
}


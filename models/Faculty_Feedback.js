var MongoClient = require('mongodb').MongoClient;
var DB = require('../utils/Database_Operations.js');
var Config = require('../config/config.js')
var url = Config.test.connection_url + "Faculty_Feedback";

const DBSync = () => {
    // DB.CreateDBCollection('Faculty_Feedback', 'ClassRooms');
    // DB.CreateDBCollection('Faculty_Feedback', 'FeedBack');
    // DB.CreateDBCollection('Result_analyzer', 'Results');
    MongoClient.connect(url, function (err, db) {
        if (err) return(err);
        var dbo = db.db("Faculty_Feedback");
        db.collection("ClassRooms").createIndex({"classroom":1, "batch": 1}, {"unique" : true}, function (err, res) {
            if (err) return(err);
            console.log("Index Created!");
        });
        db.close();
    });
}

exports.DBSync = DBSync

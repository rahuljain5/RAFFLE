var Helper = require('./helper.js');
var config = require('../config/config.js');
var DB = require('../utils/Database_Operations.js');

const Querymaker = (classroom, batch) =>{
    var Query = [];
    for(i=1; i<10;i++){
        var DBQuery = [{
            $match: {
                classroom: classroom,
                batch: batch
            }
        },
        {
            $group: {
                _id: null,
                totala: {
                    $sum: "$feedback."+i+".a"
                },
                totalb: {
                    $sum: "$feedback."+i+".b"
                },
            }
        }];
        Query.push(DBQuery);
    }
    // console.log(Query);
    
    return Query;
}
const ScoreAggregator = (Query) => {
    return new Promise((resolve, reject) => {
        // var FeedbackStats = {
        //     "_id": req.query.batch + req.query.classroom
        // };
        // console.log(Query);
        var AnalyzedFeedbackJson = {};
            DB.Aggregate('Faculty_Feedback', 'Feedback', Query)
            .then(function (result) {
                // console.log("Got Result From DataBase");
                // redis.setex(req.query.classroom + req.query.batch, JSON.stringify(result), config.result_ttl);
                // console.log(JSON.stringify(result));
                AnalyzedFeedbackJson= {a : result.totala, b: result.totalb, total: result.totala+result.totalb};
                resolve(AnalyzedFeedbackJson);
                // console.log(JSON.stringify(AnalyzedFeedbackJson));
                // console.log(result);
                
            })
            .catch(err => {
                console.error(err);
                reject(err);
            })
    } )
    // });
}

const getTotalFeedbacksCount = (classroom, batch, cb) =>{
    var Query = [{
        $match: {
            classroom: classroom,
            batch: batch
        }
    },
    {
        $group: {
            _id: null,
            total : { $sum : 1 }
        }
    }]; 
    DB.Aggregate('Faculty_Feedback', 'Feedback', Query)
    .then(function (result) {
        cb(result);
})
.catch(err =>{
    console.error(err);
})
}
const Feedback = (classroom, batch) =>{
    var Querys = Querymaker(classroom, batch);
    return Querys.map(ScoreAggregator);
}

exports.Feedback = Feedback;
exports.Querymaker = Querymaker;
exports.ScoreAggregator = ScoreAggregator;
exports.getTotalFeedbacksCount = getTotalFeedbacksCount
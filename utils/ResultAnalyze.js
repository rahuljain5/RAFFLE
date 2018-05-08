var Helper = require('./helper.js');
var config = require('../config/config.js');
var DB = require('../utils/Database_Operations.js');

const Querymaker = () => {
    var Query = [];
    for (i = 1; i < 10; i++) {
        var DBQuery = [{
            $match: {
                "Yearstamp": "2018",
                "Results.Current.Semester" : "5"
            }
        },
        {
            $group: {
                _id: {
        subCode:"$Results.Current.Result."+i+".Subject Code",
        subName:"$Results.Current.Result."+i+".Subject Name",
        Result: "$Results.Current.Result."+i+".Result",
    },
                total: {
                    $sum: 1
                },
            }
        }
    ]
        Query.push(DBQuery);
    }
    // console.log(Query);
    return Query;
}

const getResultStats = (Query) => {
    return new Promise((resolve, reject) => {
        // console.log(Query);
        var AnalyzedFeedbackJson = {};
        DB.Aggregate('Result_analyzer', 'Results', Query)
            .then(function (result) {
                // console.log(result);
                resolve(result);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            })
    })
}

const getTotalResultsCount = (cb) => {
    var Query = [{
            $match: {
                "Yearstamp": "2018",
                "Results.Current.Semester" : "5"
            }
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: 1
                }
            }
        }
    ];
    DB.Aggregate('Result_analyzer', 'Results', Query)
        .then(function (result) {
            // result["_id"] = classroom + batch;
            cb(result);
        })
        .catch(err => {
            console.error(err);
        })
}

const Results = () => {
    DB.UpdatetoInt();
    var Querys = Querymaker();
    return Querys.map(getResultStats);
}

const toAnalyzedJson = (FeedbackArray, classroomAndTotalFb) => {
    var FeedbackJson = {};
    FeedbackJson["_id"] = classroomAndTotalFb._id;
    FeedbackJson["FbCount"] = classroomAndTotalFb.total;
    for (i = 0; i < FeedbackArray.length - 1; i++) {
        FeedbackJson[i + 1] = FeedbackArray[i];
    }
    return FeedbackJson;
}


exports.Results = Results;
exports.Querymaker = Querymaker;
exports.getResultStats = getResultStats;
exports.getTotalResultsCount = getTotalResultsCount
exports.toAnalyzedJson = toAnalyzedJson
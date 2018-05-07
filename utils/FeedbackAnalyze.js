var Helper = require('./helper.js');
var config = require('../config/config.js');
var DB = require('../utils/Database_Operations.js');

const Querymaker = (classroom, batch) => {
    var Query = [];
    for (i = 1; i < 10; i++) {
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
                        $sum: "$feedback." + i + ".a"
                    },
                    totalb: {
                        $sum: "$feedback." + i + ".b"
                    },
                }
            }
        ];
        Query.push(DBQuery);
    }
    return Query;
}

const ScoreAggregator = (Query) => {
    return new Promise((resolve, reject) => {
        var AnalyzedFeedbackJson = {};
        DB.Aggregate('Faculty_Feedback', 'Feedback', Query)
            .then(function (result) {
                AnalyzedFeedbackJson = {
                    a: result.totala,
                    b: result.totalb,
                    total: result.totala + result.totalb
                };
                resolve(AnalyzedFeedbackJson);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            })
    })
}

const getTotalFeedbacksCount = (classroom, batch, cb) => {
    var Query = [{
            $match: {
                classroom: classroom,
                batch: batch
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
    DB.Aggregate('Faculty_Feedback', 'Feedback', Query)
        .then(function (result) {
            result["_id"] = classroom + batch;
            cb(result);
        })
        .catch(err => {
            console.error(err);
        })
}

const Feedback = (classroom, batch) => {
    var Querys = Querymaker(classroom, batch);
    return Querys.map(ScoreAggregator);
}

const toFeedbackJson = (FeedbackArray, classroomAndTotalFb) => {
    var FeedbackJson = {};
    FeedbackJson["_id"] = classroomAndTotalFb._id;
    FeedbackJson["FbCount"] = classroomAndTotalFb.total;
    for (i = 0; i < FeedbackArray.length - 1; i++) {
        FeedbackJson[i + 1] = FeedbackArray[i];
    }
    return FeedbackJson;
}


exports.Feedback = Feedback;
exports.Querymaker = Querymaker;
exports.ScoreAggregator = ScoreAggregator;
exports.getTotalFeedbacksCount = getTotalFeedbacksCount
exports.toFeedbackJson = toFeedbackJson
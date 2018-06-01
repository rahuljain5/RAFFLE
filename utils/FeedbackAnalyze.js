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
                    Punctual: {
                        $sum: "$feedback." + i + ".Punctual"
                    },
                    CourseCompletion: {
                        $sum: "$feedback." + i + ".CourseCompletion"
                    },
                    DoubtClearance:{
                        $sum: "$feedback." + i + ".DoubtClearance"
                    },
                    Interaction:{
                        $sum: "$feedback." + i + ".Interaction"
                    },
                    Communication:{
                        $sum: "$feedback." + i + ".Communication"
                    },
                    Overall:{
                        $sum: "$feedback." + i + ".Overall"
                    }
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
                    Punctual: result[0].Punctual,
                    CourseCompletion: result[0].CourseCompletion,
                    DoubtClearance: result[0].DoubtClearance,
                    Interaction: result[0].Interaction,
                    Communication: result[0].Communication,
                    Overall: result[0].Overall,
                    total: result[0].Punctual + result[0].CourseCompletion + result[0].DoubtClearance + result[0].Interaction + result[0].Communication + result[0].Overall
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
            result[0]["_id"] = classroom + batch;
            cb(result[0]);
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

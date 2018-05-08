var Helper = require('./helper.js');
var config = require('../config/config.js');
var DB = require('../utils/Database_Operations.js');

const Querymaker = (year, semester) => {
    var Query = [];
    for (i = 1; i < 9; i++) {
        var DBQuery = [{
                $match: {
                    "Yearstamp": year,
                    "Results.Current.Semester": semester
                }
            },
            {
                $group: {
                    _id: {
                        subCode: "$Results.Current.Result." + i + ".Subject Code",
                        subName: "$Results.Current.Result." + i + ".Subject Name",
                        Result: "$Results.Current.Result." + i + ".Result",
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
                "Results.Current.Semester": "5"
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

const Results = (year, semester) => {
    var Querys = Querymaker(year, semester);
    return Querys.map(getResultStats);
}

const toAnalyzedJson = (ResultStatsArray, Count) => {
    var SubjectJson = {};
    ResultStatsArray.forEach(SubArray => {
        SubArray.forEach(Res => {
            // console.log(Res)
            SubjectJson[Res._id.subCode] = {
                "SubName": Res._id.subName,
                "Status": {
                    "P": [],
                    "F": [],
                    "A": []
                }
            };
            // SubjectJson[Res._id.subCode.Status] = {"P":[], "F":[], "A":[]}
        })
    });
    // var x;
    ResultStatsArray.forEach(SubArray => {
        SubArray.forEach(Res => {
            var a = Res._id.subCode
            var x = Res._id.Result;
            SubjectJson[a]["Status"][x].push(Res.total)
        })
    });
    for (x in SubjectJson) {
        for (y in SubjectJson[x]["Status"]) {
            SubjectJson[x]["Status"][y] = eval(SubjectJson[x]["Status"][y].join('+'));

        }
    }
    console.log(Count);
    SubjectJson["TotalStudents"] = Count;
    // console.log(JSON.stringify(SubjectJson));
    return SubjectJson;
}


exports.Results = Results;
exports.Querymaker = Querymaker;
exports.getResultStats = getResultStats;
exports.getTotalResultsCount = getTotalResultsCount
exports.toAnalyzedJson = toAnalyzedJson
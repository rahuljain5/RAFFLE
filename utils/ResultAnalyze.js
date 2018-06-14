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
    return Query;
}

const getResultStats = (Query) => {
    return new Promise((resolve, reject) => {
        var AnalyzedFeedbackJson = {};
        DB.Aggregate('Result_analyzer', 'Results', Query)
            .then(function (result) {
                resolve(result);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            })
    })
}

const OverallResults = (year, semester, cb) => {
    var Querys = []
    var DBQuery = [{
            $match: {
                "Yearstamp": year,
                "Results.Current.Semester": semester,
                "Results.Current.Result.1.Result": "P",
                "Results.Current.Result.2.Result": "P",
                "Results.Current.Result.3.Result": "P",
                "Results.Current.Result.4.Result": "P",
                "Results.Current.Result.5.Result": "P",
                "Results.Current.Result.6.Result": "P",
                "Results.Current.Result.7.Result": "P",
                "Results.Current.Result.8.Result": "P"
            }
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: 1
                },
            }
        }
    ]
    DB.Aggregate('Result_analyzer', 'Results', DBQuery)
        .then(function (result) {
            console.log(result);
            cb(result[0]["total"])
        })
        .catch(err => {
            console.error(err);
        })
}

const getTotalResultsCount = (year, semester, cb) => {
    var Query = [{
            $match: {
                "Yearstamp": year,
                "Results.Current.Semester": semester
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
            OverallResults(year, semester, function (totalpassed) {
                cb(result, totalpassed);
                
            });
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
    console.log(ResultStatsArray)
    ResultStatsArray.forEach(SubArray => {
        SubArray.forEach(Res => {
            SubjectJson[Res._id.subCode] = {
                "SubName": Res._id.subName,
                "Status": {
                    "P": [],
                    "F": [],
                    "A": []
                }
            };
        })
    });
    ResultStatsArray.forEach(SubArray => {
        SubArray.forEach(Res => {
            var a = Res._id.subCode
            var x = Res._id.Result;
            console.log(a+x+SubjectJson[a]["Status"][x])
            SubjectJson[a]["Status"][x].push(Res.total)
        })
    });
    for (x in SubjectJson) {
        for (y in SubjectJson[x]["Status"]) {
            SubjectJson[x]["Status"][y] = eval(SubjectJson[x]["Status"][y].join('+'));

        }
    }
    SubjectJson["TotalStudents"] = Count["total"];
    console.log(JSON.stringify(SubjectJson));
    return SubjectJson;
}


exports.Results = Results;
exports.Querymaker = Querymaker;
exports.getResultStats = getResultStats;
exports.getTotalResultsCount = getTotalResultsCount
exports.toAnalyzedJson = toAnalyzedJson
exports.OverallResults = OverallResults

var S = require('string');
var fs = require('fs');
var padder = require('zpad');

const ResultJsonParser = (tables, sems) => {
  var Results = {};
  for (var i = 0; i < tables.length - 1; i++) {
    var tablerows = tables[i].getElementsByClassName("divTableRow");
    var tableheaders = tablerows[0];
    var semResult = {};
    for (var j = 1; j < tablerows.length; j++) {
      var subResult = {};
      var headers = tableheaders.getElementsByClassName("divTableCell");
      var rowcells = tablerows[j].getElementsByClassName("divTableCell");
      for (var k = 0; k < rowcells.length; k++)
        subResult[headers[k].innerHTML] = rowcells[k].innerHTML;
      semResult[j] = subResult;
    }
    Results["Sem" + sems[i]] = semResult;
  }
  return Results;
}

const getNameUsn = (parser, Json) => {
  var nameusntable = parser.window.document.getElementsByTagName('td');
  Json[S(nameusntable[0].innerHTML).stripTags().stripPunctuation()] = S(nameusntable[1].innerHTML).stripTags().stripPunctuation().s;
  Json[S(nameusntable[2].innerHTML).stripTags().stripPunctuation()] = S(nameusntable[3].innerHTML).stripTags().stripPunctuation().s;
  return Json;
}

const getSemesters = (tables, str) => {
  var sems = [];
  for (var numofsems = 0; numofsems < tables.length - 1; numofsems++) {
    sems[numofsems] = S(str).between("<div style=\"text-align:center;padding:5px;\"><b>Semester : ", "</b></div>").s;
    str = str.replace(/<b>Semester : /i, "#");
  }
  return sems;
}

const UsnGenerator = (base_usn) => {
  var usn = [];
  for (var i = 1; i < 120; i++) {
    i = padder(i, 3);
    usn[i - 1] = base_usn + i;
  }
  return usn;
}

const RangeUsnGenerator = (base_usn, start_usn, last_usn, callback) => {
  var usn = [];
  for (var i = start_usn; i < last_usn; i++) {
    i = padder(i, 3);
    usn[i - 1] = base_usn + i;
  }
  callback(usn);
}

exports.ResultJsonParser = ResultJsonParser;
exports.getNameUsn = getNameUsn;
exports.getSemesters = getSemesters;
exports.UsnGenerator = UsnGenerator;
exports.RangeUsnGenerator = RangeUsnGenerator;
var axi = require("axios");
var S = require('string');
const tojson = (result, num_of_tables) => {
    var backlog = {}
    var array = ['Current_results', 'Backlog_results'];
    var json = { 'student_details': { usn: result[0], Name: result[1], Semester: result[2] } };
    num_of_tables--;
    var key = 0, back_sem;
    var i = 3;
    while (num_of_tables > 0) {
        j = 1;
        var subdetails = {};
        if (key == 1) {
            back_sem = result[i++];
        }
        while (!(S(result[i]).contains('Total Marks'))) {
            subject = { SubCode: result[i], SubName: result[i + 1], Internal: result[i + 2], External: result[i + 3], SubTotal: result[i + 4], SubRes: result[i + 5] };
            subdetails["Subject" + j] = subject;
            i = i + 6;
            j++;
        }
        num_of_tables -= 2;
        if (key == 0) {
            json[array[key]] = subdetails;
            json[result[i]] = result[++i];
            json['Result'] = result[++i];
        }
        else {
            subdetails[result[i]] = result[++i];
            subdetails['Result'] = result[++i];
            backlog[back_sem] = subdetails;

        }
        if (num_of_tables > 0) {
            key = 1;
        }
        i++;
    }
    if (key == 1) json['Backlog_results'] = backlog;
    return json;
}

const parse_html = (str) => {
    var sub = "<div class=\"panel-heading text-center\">";
    var strt = str.indexOf("<span class=\"glyphicon glyphicon-globe\"></span>");
    var end = str.indexOf("<div class=\"panel-heading text-center\" style=\"background-color: rgba(163, 102, 47, 0.5);color: black;font-size: 15pt;\"><span class=\"glyphicon glyphicon-th-list\">");
    end -= strt;
    sub = str.substr(strt, end);
    sub += "</div></div></div>";
    var num_of_tables = S(sub).count("<table");
    var nameusn = S(sub).stripTags();
    nameusn = nameusn.lines();
    var result = S()
    var arr = ['University Seat Number', 'Student Name', 'Subject Code', 'Subject Name', 'Internal Marks', 'External Marks', 'Total', 'Result']
    for (var i = 1, j = 0; i < nameusn.length; i++) {
        nameusn[i] = S(nameusn[i]).collapseWhitespace().stripPunctuation();
        if (!nameusn[i].isEmpty() && !arr.includes(nameusn[i].s)) { result[j++] = nameusn[i].s; }
    }
    if (num_of_tables != 0)
        var student = tojson(result, num_of_tables);
    console.log(JSON.stringify(student));
}
exports.parse_html = parse_html;
exports.tojson = tojson;

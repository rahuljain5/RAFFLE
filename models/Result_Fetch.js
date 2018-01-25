var http = require('http');
var axi = require("axios");
var qs = require('qs');
var S = require('string');
var asyncProcess = require('async-process');
var padder = require('zpad');
var vtu = require('../utils/helper.js')
const scrape = (base_usn) => {
    var usn = [];
    for (var i = 1; i < 120; i++) {
        i = padder(i, 3);
        usn[i - 1] = base_usn + i;
    }
    var scraper = function (rusn, cb) {
        axi.post('http://results.vtu.ac.in/results17/result_page.php', qs.stringify({ usn: rusn }))
            .then(function (response) {

                var str = S(response.data);
                if (str.contains("alert(\"University Seat Number is not available or Invalid..!\");") == false) {
                    vtu.parse_html(str);
                    console.log(rusn + "Done Successfully!")
                }
                else { console.log("Wrong USN macha! -" + rusn); }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    new asyncProcess(usn, scraper, function () {
        //At this point all the files are loaded 
        console.log("All usn have been processed");
        this.tasksFails.forEach(function (id) {
            console.warn("usn : " + id + " failed.");
        })
    });
}
exports.scrape = scrape;
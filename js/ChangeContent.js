function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
  }
function changeContent(content) {
                
                if (content["error"] == true) {
                    console.log(content.errorMessage);
                    return(`<h4 align='center'><b>${content.userMessage}</b></h4>`)
                } else {
                    var str =
                        `<h4><b>University Seat Number</b>: ${content['University Seat Number ']}</h4><h4><b>Student Name</b>: ${titleCase(content['Student Name '])}</h4>`
                    str += `<h4><b>Semester</b>: ${content["Results"]["Current"]["Semester"]}</h4>`
                    var table =
                        "<table class='table'><tr><th>Subject Code</th><th>Subject Name</th><th>Internal Marks</th><th>External Marks</th><th>Total Marks</th><th>Result</th></tr>"
                    var current = content["Results"]["Current"]["Result"]
                    for (subject in current) {
                        console.log(content["Results"]["Current"]["Result"]["Semester"]);

                        table +=
                            `<tr><td>${current[subject]['Subject Code']}</td><td>${current[subject]['Subject Name']}</td><td>${current[subject]['Internal Marks']}</td><td>${current[subject]['External Marks']}</td><td>${current[subject]['Total']}</td><td>${current[subject]['Result']}</td></tr>`
                    }
                    table += "</table>";
                    str += table;
                    var Backlogs = content["Results"]["Backlogs"]
                    for (backsem in Backlogs) {
                        console.log(Backlogs[backsem]);
                        str += `<h4><b>Semester</b>: ${Backlogs[backsem]["Semester"]}</h4><hr/>`
                        table =
                            "<table class='table'><tr><th>Subject Code</th><th>Subject Name</th><th>Total Marks</th><th>Result</th></tr>"
                        var subjects = Backlogs[backsem]
                        for (subject in subjects) {
                            // console.log(subjects);
                            if (subject != "Semester")
                                table +=
                                `<tr><td>${subjects[subject]['Subject Code']}</td><td>${subjects[subject]['Subject Name']}</td><td>${subjects[subject]['Total']}</td><td>${subjects[subject]['Result']}</td></tr>`
                        }
                        table += "</table>";
                        str += table;
                    }
                    str += "<hr/>";
                    return(str);
                }
            }
            

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
                    return(`<h3 align='center'>${content.userMessage}</h3>`)
                } else {
                    var str =
                        `<h3>University Seat Number: ${content['University Seat Number ']}</h3><h3>Student Name: ${titleCase(content['Student Name '])}</h3>`
                    str += `<h3>Semester: ${content["Results"]["Current"]["Semester"]}</h3>`
                    var table =
                        "<table class='table'><tr><th>Subject Code</th><th>Subject Name</th><th>Total Marks</th><th>Result</th></tr>"
                    var current = content["Results"]["Current"]["Result"]
                    for (subject in current) {
                        console.log(content["Results"]["Current"]["Result"]["Semester"]);

                        table +=
                            `<tr><td>${current[subject]['Subject Code']}</td><td>${current[subject]['Subject Name']}</td><td>${current[subject]['Total']}</td><td>${current[subject]['Result']}</td></tr>`
                    }
                    table += "</table>";
                    str += table;
                    var Backlogs = content["Results"]["Backlogs"]
                    for (backsem in Backlogs) {
                        console.log(Backlogs[backsem]);
                        str += `<h3>Semester: ${Backlogs[backsem]["Semester"]}</h3><hr/>`
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
                    return(str);
                }
            }
            
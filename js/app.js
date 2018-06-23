function authenticate() {
  $.ajax({
    url: "https://raffle-uat.herokuapp.com/authenticate",
    type: "GET",
    beforeSend: function (request) {
      request.setRequestHeader("X-SESSION-KEY", session);
    },
    data: ""
  }).done(function (response) {
    console.log(response);
    if (response["error"] == true) {
      alert(response.message)
      localStorage.removeItem("session"); //Clear the Invalid Key if exist 
      window.location = "login.html";
    }
  });
}
$("#logout").click(function () {
  console.log("Inside Logout  Handler");
  NProgress.configure({
    showSpinner: false
  });
  NProgress.start();
  const session = localStorage.getItem("session");
  const url = "https://raffle-uat.herokuapp.com/users/logout"
  $.ajax({
    url: url,
    beforeSend: function (request) {
      request.setRequestHeader("X-SESSION-KEY", session);
    },
    type: "GET",
  }).done((response) => {

    NProgress.done();
    localStorage.removeItem("session");
    NProgress.remove();
    window.location = "login.html"
  })
})

function getFormData($form) {
  var unindexed_array = $form.serializeArray();
  var indexed_array = {};
  $.map(unindexed_array, function (n, i) {
    indexed_array[n['name']] = n['value'];
  });

  return indexed_array;
}
$("#loginForm").submit(function (event) {
  event.preventDefault(); //prevent default action
  console.log("In This Function")
  NProgress.configure({
    showSpinner: false
  });
  NProgress.start();
  event.preventDefault(); //prevent default action
  var post_url = $(this).attr("action"); //get form action url
  var request_method = $(this).attr("method"); //get form GET/POST method
  var form_data = getFormData($(this)) //Encode form elements for submission
  form_data["email"] = form_data.username
  if (form_data.rememberme) {
    form_data.rememberme = true;
  } else {
    form_data.rememberme = false;
  }
  $.ajax({
    url: post_url,
    type: request_method,
    data: form_data,
    dataType: "json"
  }).done(function (response) { //
    console.log("LOGIN -> RESPONSE" + JSON.stringify(response))
    NProgress.done();
    if (response.error) {
      console.log("In Error Case")
      // if($("#errorHint").length >0)
      $("#LoginerrorHint").empty()
      $("#LoginerrorHint").append("<p>" + response.message + "</p>")
    } else {
      console.log("Login SUCCESS" + response["SESSION_KEY"])
      localStorage.setItem("session", response["SESSION_KEY"])
      window.location = "index.html"
    }
    NProgress.remove();
  });
});

$("#registerForm").submit(function (event) {
  event.preventDefault(); //prevent default action
  console.log("In This Function")
  NProgress.configure({
    showSpinner: false
  });
  NProgress.start();
  event.preventDefault(); //prevent default action
  var post_url = $(this).attr("action"); //get form action url
  var request_method = $(this).attr("method"); //get form GET/POST method
  var form_data = getFormData($(this)) //Encode form elements for submission
  if (form_data.rememberme) {
    form_data.rememberme = true;
  } else {
    form_data.rememberme = false;
  }
  if (form_data.password === form_data.cpassword) {
    $.ajax({
      url: post_url,
      type: request_method,
      data: form_data,
      dataType: "json"
    }).done(function (response) { //
      console.log("Register -> RESPONSE" + JSON.stringify(response))
      NProgress.done();
      if (response.error) {
        console.log("In Error Case")
        // if($("#errorHint").length >0)
        $("#registererrorHint").empty()
        $("#registererrorHint").append("<p>" + response.message + "</p>")
      } else {
        console.log("Login SUCCESS" + response["SESSION_KEY"])
        localStorage.setItem("session", response["SESSION_KEY"])
        window.location = "index.html"
      }
    });
  } else {
    $("#registererrorHint").empty()
    $("#registererrorHint").append("<p> PASSWORD DOESNOT MATCH</p>")
  }
  NProgress.remove();
});

$("#forgotpasswordform").submit(function (event) {
  event.preventDefault(); //prevent default action
  console.log("In This Function")
  NProgress.configure({
    showSpinner: false
  });
  NProgress.start();
  var post_url = $(this).attr("action"); //get form action url
  var request_method = $(this).attr("method"); //get form GET/POST method
  var form_data = getFormData($(this)) //Encode form elements for submission
  if (form_data.password === form_data.confirm_password) {
    $.ajax({
      url: post_url,
      type: request_method,
      data: form_data,
      dataType: "json"
    }).done(function (response) { //
      console.log("Register -> RESPONSE" + JSON.stringify(response))
      NProgress.done();
      if (response.error) {
        console.log("In Error Case")
        // if($("#errorHint").length >0)
        $("#forgotpasswordError").empty()
        $("#forgotpasswordError").append("<p>" + response.message + "</p>")
      } else {
        $("#forgotpasswordError").empty()
        $("#forgotpasswordError").append("<p>" + response.message + "</p>")
        setTimeout(function () {
          window.location = "login.html"
        }, 5000)
      }
    });
  } else {
    $("#forgotpasswordError").empty()
    $("#forgotpasswordError").append("<p> PASSWORD DOESNOT MATCH</p>")
  }
  NProgress.remove();
});

$("#initforgotpasswordform").submit(function (event) {
  event.preventDefault(); //prevent default action
  console.log("In This Function")
  NProgress.configure({
    showSpinner: false
  });
  NProgress.start();
  var post_url = $(this).attr("action"); //get form action url
  var request_method = $(this).attr("method"); //get form GET/POST method
  var form_data = getFormData($(this)) //Encode form elements for submission
  if (form_data.email != "") {
    $.ajax({
      url: post_url,
      type: request_method,
      data: form_data,
      dataType: "json"
    }).done(function (response) { //
      NProgress.done();
      console.log("Register -> RESPONSE" + JSON.stringify(response))
      if (response.error) {
        console.log("In Error Case")
        // if($("#errorHint").length >0)
        $("#initforgotpasswordError").empty()
        $("#initforgotpasswordError").append("<p>" + response.message + "</p>")
      } else {
        $("#initforgotpasswordError").empty()
        $("#initforgotpasswordError").append("<p>" + response.message + "</p>")
        setTimeout(function () {
          window.location = "forgotpassword.html"
        }, 5000)
      }
    });
  } else {
    $("#initforgotpasswordError").empty()
    $("#initforgotpasswordError").append("<p> Please Enter a Valid Email</p>")
  }

  NProgress.remove();
});
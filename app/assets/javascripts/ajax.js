// var xhr = new XMLHttpRequest();
// xhr.open("GET", "ajax.js");
// xhr.send();


// Post
var xhr = new XMLHttpRequest();
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhr.open("POST", "index.php", true);
xhr.send("first_name=Bob&last_name=Smith");


//response
//text
var text = xhr.responseText;
//json
var person = {
  'first_name' : 'bob',
  'last_name' : 'smith'
};
// This is what the response might look like, note the double quotes.
var response = "{'first_name' : 'bob', 'last_name' : 'smith'}";
// So we need to parse the Json
var person = JSON.parse(response);
var firstName = json.first_name;
var lastName = json.last_name;

//xml
var xml = xhr.responseXML;

//states
// 0 created but not opened
// 1 opened
// 2 request sent, received by server
// 3 response in progress (partial data)
// 4 completed

//Status codes we could write code to handle these situations.
//0 before received
// 200 if success
// 404 if not found
// 500 for error

// We can check the status with the following, which will trigger every change (4 times)
onreadystatechange();

var xhr = new XMLHttpRequest();
xhr.open("GET", "ajax.js");
xhr.onreadystatechange = function () {
  if(xhr.readyState == 4 && xhr.status == 200){
    var target = document.getElementById("main");
    target.innerHTML = xhr.responseText;
  }
};

xhr.send();




//Using jQuery
$.ajax({
  type: "GET",
  url: "script.php",
  async: true,
  data: {},
  dataType: "text",
  success: function(data) {
    $("#main").html(data);
  },
  //we can also add an error call back:
  error: function(jqXHR, textStatus, error){}
});

//shorthand get or post works this way.
$.get({
  url: "script.php",
  dataType: "text",
  success: function(data) {
    $("#main").html(data);
  }
});



//In JavaScript we can prevent default using the .preventDefault(); function

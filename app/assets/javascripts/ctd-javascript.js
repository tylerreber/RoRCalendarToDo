function stripHTML(dirtyString) {
  var container = document.createElement('div');
  var text = document.createTextNode(dirtyString);
  container.appendChild(text);
  return container.innerHTML; // innerHTML will be a xss safe string
}
var ctd_view = "";
var ctd_month = new Date().getMonth();
var ctd_year = new Date().getFullYear();
var ctd_day = new Date().getDate();
var ctd_date = new Date();
var ctd_weekday = new Date().getDay();
var ctd_user = 1;
var ctd_months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var ctd_days_of_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var firstDay = new Date(ctd_year, ctd_month, 1).getDay();
var lastDay = new Date(ctd_year, ctd_month +1, 0).getDate();
var ctd_task_id_to_update = "";
var ctd_unchanged_task_id = "";
var newtask = "";
var ctd_json_info = "";
var ctd_weekdays = [];




//Function to update tasks.
function ctd_assign_duedate(ctd_task_id_to_update, task_due_month, task_due_day, task_due_year, ctd_time_slice) {

  $.post({
    url:"update",
    data: {id: ctd_task_id_to_update, due_month : task_due_month, due_day : task_due_day, due_year : task_due_year, start_time: ctd_time_slice},
    success: function(ctd_updated_json) {
      ctd_json_info = JSON.parse(ctd_updated_json);
    },
    dataType: "text"
  });
}
// Send Post request to update checked or unchecked tasks.
function ctd_task_completed(ctd_task_id_to_update, task_completed) {
  $.post({
    url:"update",
    data: {id: ctd_task_id_to_update, completed : task_completed},
    success: function(ctd_updated_json) {
      ctd_json_info = JSON.parse(ctd_updated_json);
    },
    dataType: "text"
  });
}
// Attach click handle to mark a task completed.
function ctd_bind_task_checkoff() {
  $( ":checkbox" ).change(function(){
    ctd_task_id_to_update = this.id;
    ctd_task_id_to_update = ctd_task_id_to_update.match(/\d+/)[0];
    if(this.checked) {
      ctd_task_completed(ctd_task_id_to_update, 1);
      $("#ctd-draggable-"+ctd_task_id_to_update).delay(2000).fadeOut();
      $("#ctd-oncal-"+ctd_task_id_to_update).delay(2000).fadeOut();
    } else {
      ctd_task_completed(ctd_task_id_to_update, 0);
      $("#ctd-draggable-"+ctd_task_id_to_update).delay(1000).fadeIn();
      $("#ctd-oncal-"+ctd_task_id_to_update).delay(1000).fadeIn();
    }
  });
}


function add_new_task(ctd_json_info) {
  newtask = $('#new-task').val();
  $('#new-task').val("");
  $.post({
    url:"new",
    data: {task_name: newtask},
    success: 	function(ctd_new_task) {
      ctd_new_task = JSON.parse(ctd_new_task);
      ctd_json_info.push(ctd_new_task);
      $('#ctd-no-duedate').append('<li id="ctd-draggable-' + ctd_new_task.id + '" class="list-group-item"><input id=ctd-task-'+ ctd_new_task.id + ' type="checkbox" class="check-me"/>&nbsp;' + ctd_new_task.task_name + '</input> </li>');
      ctd_make_draggable (".list-group-item");
      ctd_bind_task_checkoff();
      ctd_edit_modal(ctd_json_info);
    },
    dataType: "script"
  });

}

//Get the user's tasks.
function ctd_get_tasks(ctd_view) {
  $.get({
    url: "list",
    dataType: "script",
    success: function(data) {
      ctd_json_info = JSON.parse(data);
      ctd_tasks_onpage(ctd_json_info, ctd_view);
      // Now that the tasks are on the page call function to bind checkbox actions, double click to edit, bind draggable and droppable actions.
      ctd_bind_task_checkoff();
      ctd_edit_modal(ctd_json_info);
      ctd_make_draggable('.list-group-item');
      ctd_make_droppable();
    }
  });
}

// Function to attach double click action to bring up a modal.
function ctd_edit_modal(ctd_json_info) {
  $(".list-group-item").dblclick(function(){
    ctd_task_id_to_update = this.id;
    ctd_task_id_to_update = ctd_task_id_to_update.match(/\d+/)[0];
    $("[name='ctd-modal-duedate']").delay(2000).datepicker();
    for (var i = 0; i < ctd_json_info.length; i++) {
      if(ctd_task_id_to_update == ctd_json_info[i].id) {
        $(".modal-title").html(ctd_json_info[i].task_name);
        $("input[name='ctd-modal-taskname']").val(ctd_json_info[i].task_name);
        $("input[name='ctd-modal-duedate']").val(ctd_json_info[i].due_month + "/" + ctd_json_info[i].due_day + "/" + ctd_json_info[i].due_year);
        $("input[name='ctd-modal-starttime']").val(ctd_json_info[i].start_time);
        $("input[name='ctd-modal-endtime']").val(ctd_json_info[i].end_time);
        $("input[name='ctd-modal-note']").val(ctd_json_info[i].note);
      }
    }
    $("#ctd-modal").modal('show');
    $("#ctd-modal-submit").click(function(){
      var ctd_date_array = $("input[name='ctd-modal-duedate']").val().split("/");
      $.post({
        url:"update",
        data: {
          id: ctd_task_id_to_update,
          task_name: $("input[name='ctd-modal-taskname']").val(),
          due_month : ctd_date_array[0],
          due_day : ctd_date_array[1],
          due_year : ctd_date_array[2],
          // start_time : $("input[name='ctd-modal-starttime']").val(),
          // end_time : $("input[name='ctd-modal-endtime']").val(),
          note : $("input[name='ctd-modal-note']").val()
        },
        success: function(result) {
          ctd_successful_new_query(result);
          loadDates(firstDay, lastDay);
          ctd_get_tasks(ctd_view);
        },
        dataType: "text"
      });
    });
  });
}

function ctd_successful_new_query(response) {
  console.log("Update was successful.");
  console.log(response);
}

//Function to make something draggable:
function ctd_make_draggable (ctd_selector) {
  $(ctd_selector).draggable({
    revert: true,
    drag: function(){
      //Set variables for the drop action to use.
      ctd_task_id_to_update = this.id.match(/\d+/)[0];
      ctd_unchanged_task_id = this;
      console.log("now");

    }
  });
}

// Function to make dates droppable.
function ctd_make_droppable(){
  $('.ctd-droppable').droppable({
    activeClass: ".ctd-date-drop",
    drop: function(event, ui){
      $("#ctd-oncal-" + ctd_task_id_to_update).remove();
      ctd_due_day_id = this.id;
      if (ctd_view == "month"){
        ctd_due_day_id = ctd_due_day_id.match(/\d+/)[0];
        ctd_month = parseInt(ctd_month) +1;
          ctd_due_day_id = ctd_due_day_id - firstDay;
        ctd_assign_duedate(ctd_task_id_to_update, ctd_month, ctd_due_day_id, ctd_year);
        $("#ctd-date-box-" + ctd_due_day_id).append("</br><span id='ctd-oncal-" + ctd_task_id_to_update + "' class=' pl-1 bg-primary text-white task-oncal rounded '> " + $(ctd_unchanged_task_id).text() + "</span>");
      }
      if (ctd_view == "week") {
        ctd_time_slice = ctd_due_day_id.slice(0,-1);
        ctd_start = ctd_weekdays[ctd_due_day_id.slice(-1)];

        console.log(ctd_time_slice);
        console.log(ctd_start);
        console.log(ctd_task_id_to_update);
        console.log(ctd_start.getDate());
        ctd_assign_duedate(ctd_task_id_to_update, ctd_start.getMonth() + 1, ctd_start.getDate(), ctd_start.getFullYear(), ctd_time_slice);
        $("#ctd-has-duedate").append(ctd_unchanged_task_id);
        $(this).append("<span id='ctd-oncal-" + ctd_task_id_to_update + "' class=' pl-1 bg-primary text-white task-oncal rounded'> " + $(ctd_unchanged_task_id).text() + "</span></br>");
      }

      $("#ctd-has-duedate").append(ctd_unchanged_task_id);
    }
  });
}



function clickNewTask(){
  //Attach click handle to add new task.
  $("#new-task-button").click(function() {
    add_new_task(ctd_json_info);
  });
  $("#new-task").keypress(function( event ) {
    if ( event.which == 13 ) {
      add_new_task(ctd_json_info);
    }
  });
}


//Go throught each of the tasks and put them in the list.
function ctd_tasks_onpage(ctd_json_info, ctd_view) {
  $("#ctd-no-duedate").html("");
  $("#ctd-has-duedate").html("");
  for (var i = 0; i < ctd_json_info.length; i++) {
    var ctd_task_name = ctd_json_info[i].task_name;
    var ctd_task_id = ctd_json_info[i].id;
    var ctd_task_completed = ctd_json_info[i].completed;
    var ctd_task_duedate = ctd_json_info[i].due_day;
    var ctd_task_info_to_append  = '<li id="ctd-draggable-' + ctd_task_id + '" class="list-group-item"><input ';
    if (ctd_task_completed == 1) {ctd_task_info_to_append += "checked ";}
    ctd_task_info_to_append +='id=ctd-task-';
    ctd_task_info_to_append += ctd_task_id;
    ctd_task_info_to_append += ' type="checkbox" class="check-me"/>&nbsp;' + ctd_task_name + '</input> </li>';
    // If there is a due date and it is in this month put it on the calendar.
    if(ctd_json_info[i].due_day) {
      var ctd_task_duemonth = ctd_json_info[i].due_month - 1;
      var ctd_task_dueyear = ctd_json_info[i].due_year;
      $('#ctd-has-duedate').append(ctd_task_info_to_append);
      if (ctd_task_duemonth == ctd_month && ctd_year == ctd_task_dueyear && ctd_view == "month") {
        ctd_duedate_in_month = ctd_json_info[i].due_day + firstDay;
        $("#ctd-date-box-" + ctd_duedate_in_month).append("<span id='ctd-oncal-" + ctd_task_id + "' class=' pl-1 bg-primary text-white task-oncal rounded'>" + ctd_json_info[i].task_name + "</span>");
      }
      if (ctd_view == "week") {
        //Go through each day of the week to see if the task matches it.

        for (var weekday_iterator = 0; weekday_iterator < 7; weekday_iterator++) {
          task_date = ctd_weekdays[weekday_iterator].getDate();
          task_month = ctd_weekdays[weekday_iterator].getMonth();
          task_year = ctd_weekdays[weekday_iterator].getFullYear();

          if (task_date == ctd_task_duedate && task_month == ctd_task_duemonth && task_year == ctd_task_dueyear) {
            if (ctd_json_info[i].start_time) {
              ctd_weekday_time = ctd_json_info[i].start_time.toString().concat(weekday_iterator);
              $("#" + ctd_weekday_time).append("<span id='ctd-oncal-" + ctd_task_id + "' class=' pl-1 bg-primary text-white task-oncal rounded'>" + ctd_json_info[i].task_name + "</span>");
            } else {
              adjusted_weekday_iterator = weekday_iterator + 2;
              $("#ctd-fullday-events").find("td:nth-of-type(" + adjusted_weekday_iterator +")").append(ctd_task_name);
              console.log(weekday_iterator);
            }
          }
        }
      }
    } else {
      $('#ctd-no-duedate').append(ctd_task_info_to_append);
    }
  }
}


function ctd_tasks_inweek(ctd_json_info){
  $("#ctd-no-duedate").html("");
  $("#ctd-has-duedate").html("");
}












//Day numbers on the calendar.
function loadDates(firstDay, lastDay){
  for (var i = 1; i < 43; i++) {
    $("#ctd-date-box-"+i).html("");
    if (i < firstDay + 1) {
      continue;
    } else {
      $("#ctd-date-box-"+i).append(i - firstDay);
    }
    if (i == firstDay + lastDay) {
      break;
    }
  }
}

/*////////////////////////////// Month View /////////////////////////////*/
function loadMonthView() {
  ctd_view = "month";
  loadDates(firstDay, lastDay);

  //Put the month name at the top of the page.
  $("#ctd-month").html(ctd_months[ctd_month]);

  $("#ctd-prev-month").click( function(){
    ctd_month = ctd_month - 1;
    if (ctd_month == -1){
      ctd_month = 11;
      ctd_year = ctd_year - 1;
    }
    firstDay = new Date(ctd_year, ctd_month, 1).getDay();
    lastDay = new Date(ctd_year, ctd_month +1, 0).getDate();
    loadDates(firstDay, lastDay);
    $("#ctd-month").html(ctd_months[ctd_month]);
    ctd_tasks_onpage(ctd_json_info, "month");
    ctd_bind_task_checkoff();
    ctd_edit_modal(ctd_json_info);
    ctd_make_draggable('.list-group-item');
    ctd_make_droppable();
  });

  $("#ctd-next-month").click(function() {
    ctd_month = (ctd_month == 11 ? 0 : parseInt(ctd_month) +1);
    ctd_year = (ctd_month === 0 ? ctd_year + 1 : ctd_year);
    firstDay = new Date(ctd_year, ctd_month, 1).getDay();
    lastDay = new Date(ctd_year, ctd_month +1, 0).getDate();
    loadDates(firstDay, lastDay);
    $("#ctd-month").html(ctd_months[ctd_month]);
    ctd_tasks_onpage(ctd_json_info, "month");
    ctd_bind_task_checkoff();
    ctd_edit_modal(ctd_json_info);
    ctd_make_draggable('.list-group-item');
    ctd_make_droppable();
  });

  ctd_get_tasks("month");
  clickNewTask();
}

function set_weekdays(day_of_week) {
  $("th").html("");
  for (var iterator = 2; iterator < 9; iterator++) {
    first_day_ofweek = new Date();

    first_day_ofweek.setDate(ctd_date.getDate() - ctd_weekday -2);
    adjusted_first_day = first_day_ofweek.getDate();
    first_day_ofweek.setDate(adjusted_first_day + iterator);
    dayonscreen = first_day_ofweek.getDate();
    $("th:nth-of-type(" + iterator +")").append(ctd_days_of_week[iterator-2] + " " + dayonscreen);
    // The array of weekdays are used throughout the app to identify which day is which.
    ctd_weekdays[iterator-2] = first_day_ofweek;
    if (dayonscreen == ctd_day) {
      $("th:nth-of-type(" + day_of_week +")").addClass("alert-danger");
    }
  }
}



/*////////////////////////////// Week View /////////////////////////////*/
function loadWeekView(){
  ctd_view = "week";
  ctd_get_tasks("week");
  ctd_edit_modal(ctd_json_info);
  clickNewTask();
  ctd_bind_task_checkoff();
  ctd_height = $(window).height()-160;
  $("#ctd-scroll-area").css("height", ctd_height);

  //Set up timeslots.
  var hour = "";
  var ampm = "";
  var quarterhour = "";
  var military_time = 0;
  for (var timeslot = 0; timeslot < 24*4; timeslot++) {
    if(timeslot % 4 === 0){
      quarterhour = "00";
      if (hour == 12){
        hour = 0;
      }
      if(timeslot === 0){
        hour = 12;
      } else {
        hour++;
        military_time++;
      }
    } else if (timeslot % 4 == 1) {
      quarterhour = "15";
    } else if (timeslot % 4 == 2) {
      quarterhour = "30";
    }
    else {
      quarterhour = "45";
    }
    ampm = (timeslot < 48 ? "am" : "pm");

    var ctd_new_row = $("#ctd-week-events").append("<tr id='" + hour.toString() + quarterhour + ampm +"'> <td class='p-0 ctd-five-percent'>" + hour +":"+ quarterhour+ ampm + "</td></tr>");
    for (var i = 0; i < 7; i++) {
      $("#"+hour.toString()+quarterhour+ampm).append("<td id='" + military_time + quarterhour + i + "' class='p-0 ctd-one-seventh ctd-droppable'></td>");
    }
  }

  // Make every fourth row have a top border.
  $("#ctd-week-events").find("tr:nth-of-type(4n+1)").css({"border-top": "1px solid #eceeef"});
  // Add 2 to day of week bc first table column is not a day and it is a 0 index.
  var day_of_week = ctd_weekday + 2;
  //Set days of the week
  set_weekdays(day_of_week);

  $("#ctd-next-month").click(function() {
    ctd_date.setDate(ctd_date.getDate() + 7);
    set_weekdays(day_of_week);
    $("#ctd-month").html(ctd_months[ctd_weekdays[0].getMonth()] + " " + ctd_weekdays[0].getDate() + " - " + ctd_months[ctd_weekdays[6].getMonth()] + " " + ctd_weekdays[6].getDate());
    // clear the tasks on the page.
    $("td span").remove();
    ctd_tasks_onpage(ctd_json_info, "week");
    ctd_bind_task_checkoff();
    ctd_edit_modal(ctd_json_info);
    ctd_make_draggable('.list-group-item');
    ctd_make_droppable();
  });

  $("#ctd-prev-month").click(function() {
    ctd_date.setDate(ctd_date.getDate() - 7);
    set_weekdays(day_of_week);
    $("#ctd-month").html(ctd_months[ctd_weekdays[0].getMonth()] + " " + ctd_weekdays[0].getDate() + " - " + ctd_months[ctd_weekdays[6].getMonth()] + " " + ctd_weekdays[6].getDate());
    // clear the tasks on the page.
    $("td span").remove();
    ctd_tasks_onpage(ctd_json_info, "week");
    ctd_bind_task_checkoff();
    ctd_edit_modal(ctd_json_info);
    ctd_make_draggable('.list-group-item');
    ctd_make_droppable();
  });

  // Set the scroll to the area of 9:00 in the morning.
  $("#ctd-scroll-area").scrollTop(785);
  // Set date range on page.
  $("#ctd-month").text(ctd_months[ctd_weekdays[0].getMonth()] + " " + ctd_weekdays[0].getDate() + " - " + ctd_months[ctd_weekdays[6].getMonth()] + " " + ctd_weekdays[6].getDate());
}

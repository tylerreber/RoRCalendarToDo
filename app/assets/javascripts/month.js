// function stripHTML(dirtyString) {
//   var container = document.createElement('div');
//   var text = document.createTextNode(dirtyString);
//   container.appendChild(text);
//   return container.innerHTML; // innerHTML will be a xss safe string
// }
// function loadMonthView() {
//
//
// 	var ctd_month = ($('ctd-month-value').val() != new Date().getMonth() ? $('#ctd-month-value').val() : new Date().getMonth());
// 	var ctd_year = ($('ctd-year-value').val() != new Date().getFullYear() ? $('#ctd-year-value').val() : new Date().getFullYear());
// 	var ctd_day = new Date().getDate();
// 	var ctd_user = 1;
// 	var ctd_months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// 	var ctd_task_id_to_update = "";
// 	var ctd_unchanged_task_id = "";
// 	var newtask = "";
// 	var ctd_json_info = "";
// 	$("#ctd-month").append(ctd_months[ctd_month]);
//
// 	$("#ctd-prev-month").click( function(){
// 		var ctd_new_month = ctd_month - 1;
// 		ctd_new_month = (ctd_new_month == -1 ? 11 : ctd_new_month);
// 	 	 window.location.href = 'index.php?month=' + ctd_new_month;
// 	});
//
// 	$("#ctd-next-month").click(function() {
// 		ctd_month = (ctd_month == 11 ? 0 : parseInt(ctd_month) +1);
// 		window.location.href = 'index.php?month=' + ctd_month;
// 	});
//
//
// 		//Function to update tasks.
// 		function ctd_assign_duedate(ctd_task_id_to_update, task_due_month, task_due_date, task_due_year) {
// 			$.post({
// 				url:"includes/update_tasks.php",
// 				data: {id: ctd_task_id_to_update, due_month : task_due_month, due_date : task_due_date, due_year : task_due_year},
// 				success: ctd_successful_new_query,
// 				dataType: "text"
// 			});
// 		}
// 		// Send Post request to update checked or unchecked tasks.
// 		function ctd_task_completed(ctd_task_id_to_update, task_completed) {
// 			$.post({
// 				url:"includes/update_tasks.php",
// 				data: {id: ctd_task_id_to_update, completed : task_completed},
// 				success: ctd_successful_new_query,
// 				dataType: "text"
// 			});
// 		}
// 		// Attach click handle to mark a task completed.
// 		function ctd_bind_task_checkoff() {
// 			$( ":checkbox" ).change(function(){
// 				ctd_task_id_to_update = this.id;
// 				ctd_task_id_to_update = ctd_task_id_to_update.match(/\d+/)[0];
// 				if(this.checked) {
// 					ctd_task_completed(ctd_task_id_to_update, 1);
// 					$("#ctd-draggable-"+ctd_task_id_to_update).delay(2000).fadeOut();
// 					$("#ctd-task-oncal-"+ctd_task_id_to_update).delay(2000).fadeOut();
// 				} else {
// 					ctd_task_completed(ctd_task_id_to_update, 0);
// 					$("#ctd-draggable-"+ctd_task_id_to_update).delay(1000).fadeIn();
// 					$("#ctd-task-oncal-"+ctd_task_id_to_update).delay(1000).fadeIn();
// 				}
// 			});
// 		}
//
// 		// Function to attach double click action to bring up a modal.
// 		function ctd_edit_modal() {
// 			$(".list-group-item").dblclick(function(){
// 				ctd_task_id_to_update = this.id;
// 				console.log(ctd_task_id_to_update);
// 				ctd_task_id_to_update = ctd_task_id_to_update.match(/\d+/)[0];
// 				$("[name='ctd-modal-duedate']").delay(2000).datepicker();
// 				for (var i = 0; i < ctd_json_info.length; i++) {
// 					if(ctd_task_id_to_update == ctd_json_info[i].id) {
// 						$(".modal-title").html(ctd_json_info[i].task_name);
// 						$("input[name='ctd-modal-taskname']").val(ctd_json_info[i].task_name);
// 						$("input[name='ctd-modal-duedate']").val(ctd_json_info[i].due_month + "/" + ctd_json_info[i].due_date + "/" + ctd_json_info[i].due_year);
// 						$("input[name='ctd-modal-starttime']").val(ctd_json_info[i].start_time);
// 						$("input[name='ctd-modal-endtime']").val(ctd_json_info[i].end_time);
// 						$("input[name='ctd-modal-note']").val(ctd_json_info[i].note);
// 					}
// 				}
// 				$("#ctd-modal").modal('show');
// 				$("#ctd-modal-submit").click(function(){
// 					var ctd_date_array = $("input[name='ctd-modal-duedate']").val().split("/");
// 					$.post({
// 						url:"includes/update_tasks.php",
// 						data: {
// 							id: ctd_task_id_to_update,
// 							task_name: $("input[name='ctd-modal-taskname']").val(),
// 							due_month : ctd_date_array[0],
// 							due_date : ctd_date_array[1],
// 							due_year : ctd_date_array[2],
// 							start_time : $("input[name='ctd-modal-starttime']").val(),
// 							end_time : $("input[name='ctd-modal-endtime']").val(),
// 							note : $("input[name='ctd-modal-note']").val()
// 						},
// 						success: ctd_successful_new_query,
// 						dataType: "text"
// 					});
// 				});
// 			});
// 		}
//
// 	//Function to handle ajax response to create a new task.
// 	function successfulnewtask(response) {
// 		console.log("Update was successful.");
// 		console.log(response);
// 		response = String(response);
// 		$('#ctd-no-duedate').append('<li id="ctd-draggable-' + response + '" class="list-group-item"><input id="ctd-task-' + response + '" type="checkbox" />&nbsp;' + newtask + '</li>');
// 		ctd_make_draggable ("#ctd-draggable-"+response);
// 		ctd_bind_task_checkoff();
//
// 	}
//
// 	function ctd_successful_new_query(response) {
// 		console.log("Update was successful.");
// 		console.log(response);
// 	}
//
// 	//Go throught each of the tasks and put them in the list.
// 	function ctd_tasks_onpage(ctd_json_info) {
// 		for (var i = 0; i < ctd_json_info.length; i++) {
// 			var ctd_task_name = ctd_json_info[i].task_name;
// 			var ctd_task_id = ctd_json_info[i].id;
// 			var ctd_task_completed = ctd_json_info[i].completed;
// 			var ctd_task_info_to_append  = '<li id="ctd-draggable-' + ctd_task_id + '" class="list-group-item"><input ';
// 			if (ctd_task_completed == 1) {ctd_task_info_to_append += "checked ";}
// 			ctd_task_info_to_append +='id=ctd-task-';
// 			ctd_task_info_to_append += ctd_task_id;
// 			ctd_task_info_to_append += ' type="checkbox" class="check-me"/>&nbsp;' + ctd_task_name + '</input> </li>';
// 			// If there is a due date and it is in this month put it on the calendar.
// 			if(ctd_json_info[i].due_date) {
// 				var ctd_task_duedate = ctd_json_info[i].due_date;
// 				var ctd_task_duemonth = ctd_json_info[i].due_month - 1;
// 				var ctd_task_dueyear = ctd_json_info[i].due_year;
// 				$('#ctd-has-duedate').append(ctd_task_info_to_append);
// 				if (ctd_task_duemonth == ctd_month) {
// 					$("#ctd-date-box-" + ctd_task_duedate).append("<span id='ctd-task-oncal-" + ctd_task_id + "' class='p-1 bg-primary text-white'>" + ctd_json_info[i].task_name + "</span>");
// 				}
// 			} else {
// 				$('#ctd-no-duedate').append(ctd_task_info_to_append);
// 			}
// 		}
// 	}
//
// 	//Function to make something draggable:
// 	function ctd_make_draggable (ctd_selector) {
// 		$(ctd_selector).draggable({
// 			revert: true,
// 			drag: function(){
// 				//Set variables for the drop action to use.
// 				ctd_task_id_to_update = this.id.match(/\d+/)[0];
// 				ctd_unchanged_task_id = this;
// 				console.log("now");
//
// 			}
// 		});
// 	}
//
// 	//Get the user's tasks and put them on the page.
// 	$.get({
// 	  url: "events.php",
// 	  dataType: "text",
// 	  success: function(data) {
// 			ctd_json_info = JSON.parse(data);
// 			ctd_tasks_onpage(ctd_json_info);
// 			// Now that the tasks are on the page call function to bind checkbox actions.
// 			ctd_bind_task_checkoff();
// 			// Now that the tasks are on the page call function to bind double click to edit.
// 			ctd_edit_modal();
// 			// Now that the tasks are on the page call function to bind draggable actions.
// 			ctd_make_draggable('.list-group-item');
// 			$('.ctd-droppable').droppable({
// 				activeClass: ".ctd-date-drop",
// 				drop: function(event, ui){
// 					ctd_due_date_id = this.id;
// 					ctd_due_date_id = ctd_due_date_id.match(/\d+/)[0];
// 					ctd_month = parseInt(ctd_month) +1;
// 					ctd_assign_duedate(ctd_task_id_to_update, ctd_month, ctd_due_date_id, ctd_year);
// 					$("#ctd-has-duedate").append(ctd_unchanged_task_id);
// 					$("#ctd-date-box-" + ctd_due_date_id).append("</br><span class='p-1 bg-primary text-white'>" + $(ctd_unchanged_task_id).text() + "</span>");
// 				}
// 			});
// 		}
// 	});
//
// 	//Attach click handle to add new task.
// 	$("#new-task-button").click(function() {
// 		newtask = $('#new-task').val();
// 		$.post({
// 			url:"includes/new_event.php",
// 			data: {new_task: newtask, user_id : 1},
// 			success: successfulnewtask,
// 			dataType: "text"
// 		});
// 	});
//
//
//   /*////////////////////////////// Week View /////////////////////////////*/
//   //Attach click handle to the week view.
//   $("#ctd-week").click(function(){
//     //I'll need to change click handlers here.
//     $(".col-9").html('<table class="table table-bordered"><thead>  <tr> <th class="ctd-five-percent"></th><th class="ctd-one-seventh">Sunday </th> <th class="ctd-one-seventh">Monday </th> <th class="ctd-one-seventh">Tuesday </th> <th class="ctd-one-seventh">Wednesday<th class="ctd-one-seventh">Thursday </th> <th class="ctd-one-seventh">Friday  <th class="ctd-one-seventh">Saturday </th>  </thead></tr></table>');
//     $(".col-9").append('<table class="ctd-table-week table table-bordered"><tbody class="ctd-table">');
//     var hour = "";
//     var ampm = "";
//     var quarterhour = "";
//     for (var timeslot = 0; timeslot < 24*4; timeslot++) {
//       if(timeslot % 4 === 0){
//         quarterhour = "00";
//         if (hour == 12){
//           hour = 0;
//         }
//         if(timeslot === 0){
//           hour = 12;
//         } else {
//           hour++;
//         }
//       } else if (timeslot % 4 == 1) {
//         quarterhour = "15";
//       } else if (timeslot % 4 == 2) {
//         quarterhour = "30";
//       }
//       else {
//         quarterhour = "45";
//       }
//       ampm = (timeslot < 48 ? "am" : "pm");
//       var ctd_new_row = $(".ctd-table").append("<tr id='" + hour.toString() + quarterhour + ampm +"'> <td class='p-0'>" + hour +":"+ quarterhour+ ampm + "</td></tr>");
//       for (var i = 0; i < 7; i++) {
//         $("#"+hour.toString()+quarterhour+ampm).append("<td class='p-0 ctd-one-seventh'></td>");
//       }
//     }
//     $(".ctd-table").append('</tbody></table>');
//
//     $(".ctd-table-week").height($(window).height()-130);
//   });
//
//
//
//
//
//
//
//
//
// }

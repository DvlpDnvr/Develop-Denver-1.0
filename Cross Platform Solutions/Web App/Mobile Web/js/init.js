/*
PROJECT: Mobile Web Apps
Author: Drew Dahlman
*/

// GLOBAL VARS
var queue = [],
	current = null,
	cache = null;


// JQUERY READY
$(function(){
	app.onBodyLoad();
});


var app = {
	onBodyLoad:function(){
		app.init();
	},
	init:function(){
		app.launch('page','pages/home.html','_home');
	},
	launch:function(type,page,name){
		
		// SET OUR CURRENT PAGE VARIABLE
		current = name;
		
		// ISSUE AJAX REQUEST FOR PAGE
		$.ajax({
			url:page, 
			dataType:'html',
			success:function(data){
				
				// Check to see if cache is null. This will only be null on the first run
				if(cache == null){
					
				}
				else {
					
					// add listener to Cache element to finish CSS animation
					$("#"+cache).bind('webkitAnimationEnd',function(){
						
						// Remove the animating class
						$("#"+cache).removeClass('pageOut');
						
					});
					
					// Add animating class
					/* NOTE - we add the class after the listener */
					$("#"+cache).addClass('pageOut');
					
					// Show the back button
					$("#backBTN").show();	
				}
				
				// Append the new page content to app
				$("#pages").append("<div class='page' id='"+ name +"'>"+ data +"</div>");
				
				// add listener to Name to finish CSS animation
				$("#"+name).bind('webkitAnimationEnd',function(){
					
					// Remove animating class
					$("#"+name).removeClass('pageIn');
					
				});
				
				// add animation class
				$("#"+name).addClass('pageIn');
				
				
				// Set Cache as current name
				cache = name;
				
				// Add the name to the queue, it will be added the the END of the array.
				queue.push(name);
				
				// LOG QUEUE
				console.log("QUEUE: "+queue);
			},
			error:function(w,t,f){
				
				// If something goes wrong.
				console.log(w + " " + t + " " + f);	
			}
		});
	},
	appClose:function(){
		
		// LOG QUEUE
		console.log("QUEUE: "+queue);
		
		// REVERSE ORDER OF QUEUE - Newest first
		queue = queue.reverse();
		console.log("QUEUE: "+queue);
		
		// Make first item in queue our page
		page = queue[0];
		
		// Second item is our cached
		cache = queue[1];
		
		// listen for webkit animation to end
		$("#"+page).bind('webkitAnimationEnd',function(){
			
			// remove listener
			$("#"+page).unbind('webkitAnimationEnd');
			
			// Remove the page and destroy it
			$("#"+page).remove();
			
		});
					
		// add the pageClose class to remove it from the screen
		$("#"+page).addClass('pageClose');
		
		// listen for animation to end
		$("#"+cache).bind('webkitAnimationEnd',function(){
			// Remove Animation class
			$("#"+cache).removeClass('pageBack');
			
		});
		
		// BRING BACK THE LAST PAGE
		$("#"+cache).addClass('pageBack');
		
		// REMOVE THE FIRST ITEM FROM QUEUE
		queue.shift();
		
		// REVERSE IT TO NORMAL ORDER
		queue.reverse();
		
		if(queue.length == 1){
			$("#backBTN").hide();
			
		}
		
	}
}

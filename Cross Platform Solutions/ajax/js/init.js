// THE SHORTHAND FOR jQUERY DOCUMENT READY
$(function(){
	
	// DO SOMETHING
	app.init();
});

var app = {
	init:function(){
		$.ajax({
			url:'index2.html',
			dataType:'html',
			success:function(data){
				//$("#content").html(data); // REPLACE ALL DATA
				$("#content").append(data); // ADD TO DATA
			},
			error:function(w,t,f){
				console.log(w + " " + t + " " + f);	
			}
		});
	}
}

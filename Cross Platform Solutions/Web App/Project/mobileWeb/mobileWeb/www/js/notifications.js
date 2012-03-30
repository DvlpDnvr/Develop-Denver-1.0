var notifications = {
	init:function(){
		console.log('FUUUCK');
	},
	_alert:function(){
		navigator.notification.alert(
			'hello! I am an alert',
			notifications.dismiss,
			'Alert!',
			'Rock & Roll'
		);
	},
	_confirm:function(){
		navigator.notification.confirm(
			'hello! I am a confirm message',
			notifications.confirmed,
			'Confirm!',
			'Bad,Ass'
		);	
	},
	dismiss:function(){
		
	},
	confirmed:function(){
			
	}
}
var locations = {
	getCords:function(){
		 navigator.geolocation.getCurrentPosition(locations.onCoords, locations.onError);
	},
	getDirection:function(){
		navigator.compass.getCurrentHeading(locations.onDirection, locations.onError);
	},
	onDirection:function(heading){
		$("#direction").append(heading.magneticHeading);	
	},
	onCoords:function(position){
		$("#locationInfo").append(
		'Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + new Date(position.timestamp)      + '\n'
		);
		
	},
	onError:function(){
		
	}
}
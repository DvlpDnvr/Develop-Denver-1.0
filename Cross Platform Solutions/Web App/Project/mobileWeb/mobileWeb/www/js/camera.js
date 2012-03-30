// JavaScript Document
var largeImage;

var camera = {
	
	capture:function(){
		var pictureSource=navigator.camera.PictureSourceType;
        var destinationType=navigator.camera.DestinationType;
			
		navigator.camera.getPicture(camera.onSuccess, camera.onFail, { quality : 100, 
           destinationType : Camera.DestinationType.FILE_URI, 
           sourceType : Camera.PictureSourceType.CAMERA,
           encodingType: Camera.EncodingType.JPEG,
           saveToPhotoAlbum:false 
		   });
	},
	library:function(){
		var pictureSource=navigator.camera.PictureSourceType;
        var destinationType=navigator.camera.DestinationType;
			
		navigator.camera.getPicture(camera.onSuccess, camera.onFail, { quality : 100, 
           destinationType : Camera.DestinationType.FILE_URI, 
           sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
           encodingType: Camera.EncodingType.JPEG,
           saveToPhotoAlbum:false 
		   });
		
	},
	onSuccess:function(imageURI){
		app.launch('page','pages/photo.html','_photo');
		largeImage = imageURI;
	},
	onFail:function(){
		
	},
	getPhoto:function(){
		$("#photo").html("<img src='"+largeImage+"' width='100%'>");	
	}
}
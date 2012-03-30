var debugLevel, debug;debugLevel = 0;/** * Debugging function. * This function responds to a global variable "debugLevel" * that doesn't log if this is set to 0. Other possible values * for "debugLevel" are 1(debug), 2(warn), 3(error) which restricts * logging to that severity level. The function, then, lets you * pass in the severity level for this debug that will log based on * the global debug level. *  * @param message	The thing to log (can be any type of variable although IE will only log it as a string) * @param level		The level to log (debug, warn, error) - String */
debug = function(message,level) {
	var levelValue, caller, messageObj;
	if(debugLevel==0) return;
	if(!window.console) return;
	if(level==null) level = "debug";
	var debugFunction = window.console.log;
	switch(level) {
		case "debug":
			level = 1;
			break;
		case "warn":
			level = 2;
			debugFunction = console.warn
			break;
		case "error":
			level = 3;
			debugFunction = console.error
			break;
		default:
			level = 1;
			break;
	}
	if(level<debugLevel) return;
	try {
		caller = arguments.callee.caller.name;
		callerParent = '';
			if(arguments.callee.caller.callee) callerParent = arguments.callee.caller.callee.caller.name;
		
		if(callerParent && callerParent != '' && callerParent != 'anonymous') caller = callerParent + '>' + caller;
	} catch (err) {
		//do nothing
	}
	if(message==null || message=='') {
		//debugFunction.call(console,caller);
		console.log(caller);
	} else {
		if(typeof(message)=='string' && caller!= '' && caller != 'anonymous') message = caller+' > '+message;
		//debugFunction.call(console,message);
		console.log(message);
	}
}

String.prototype.capitalize = function(){
   return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
};function iOS() {	var deviceAgent = navigator.userAgent.toLowerCase();	if(deviceAgent.match(/(iphone|ipod|ipad)/)!=null) {		return true;	}	return false;}/** * Adds rollover to an image. * This script assumes that there is a corresponding * image with _over appended to the filename (before the extension) *  * @param obj	A jquery object representing the image to add the rollover to */function rollover(obj,selectedOverride) {	if(obj.attr("src").indexOf("_over") > 0) return;	if(obj.hasClass("selected") &! selectedOverride) return;	var extension = obj.attr("src").replace("_hit","").substr((obj.attr("src").length-3),3);	obj.attr("src",obj.attr("src").replace("_hit","").replace("."+extension,"_over."+extension));	}/** * Adds rollout to an image. * This script assumes that there is a corresponding * image with _over appended to the filename (before the extension) *  * @param obj	A jquery object representing the image to add the rollout to */function rollout(obj) {	if(obj.attr("src").indexOf("_over") < 0) return;	if(obj.hasClass("selected")) return;	//obj.fadeTo(100,1);	var extension = obj.attr("src").replace("_hit","").substr((obj.attr("src").length-3),3);	obj.attr("src",obj.attr("src").replace("_hit","").replace("_over."+extension,"."+extension));}function hit(obj) {	var extension = obj.attr("src").replace("_hit","").replace("_over","").substr((obj.attr("src").length-3),3);	obj.attr("src",obj.attr("src").replace("_hit","").replace("_over","").replace("."+extension,"_hit."+extension));}function unhit(obj) {	var extension = obj.attr("src").replace("_hit","").replace("_over","").substr((obj.attr("src").length-3),3);	obj.attr("src",obj.attr("src").replace("_over","").replace("."+extension,"_over."+extension).replace("_hit",""));}/** * Preloads a rollover image * This script assumes that there is a corresponding * image with _over appended to the filename (before the extension). *  *  @param obj	A jquery object representing the image to preload a rollover image for */function preloadRollover(obj) {	var extension = obj.attr("src").substr((obj.attr("src").length-3),3);	var img = new Image();	img.src = obj.attr("src").replace("."+extension,"_over."+extension);}function preloadImage(source) {	var img = new Image();	img.src = source;}function addRolloverBackground(obj) {	var extension = obj.attr("src").substr((obj.attr("src").length-3),3);	var parent = obj.parent();	if(parent.get(0).nodeType!="DIV") {		parent = parent.parent();	}	parent.css('backgroundImage',"url('"+obj.attr("src").replace("."+extension,"_over."+extension+"')"));	parent.css('backgroundRepeat',"no-repeat");}function getPixelValue(css_pixel_string) {
	try {		return parseFloat(css_pixel_string.replace("px",''));
	} catch(e) {
		debug("problem parsing:"+css_pixel_string);
		return css_pixel_string;
	}}function getPixelString(css_pixel_value) {	try {
		return parseFloat(css_pixel_value) + "px";
	} catch(e) {
		debug("problem parsing:"+css_pixel_value);
		return css_pixel_value;
	}}/** * Adds rollover/rollout functionality to an image and * preloads the rollover image. * This script assumes that there is a corresponding * image with _over appended to the filename (before the extension) *  *  @param obj	A jquery object representing the image to add rollover functionality to */function addRollover(obj) {	obj.each(function() {		preloadRollover($(this));	});	obj.mouseenter(function() {		rollover($(this));	});	obj.mouseleave(function() {		rollout($(this));	});}function openWindow(pageUrl,width,height,winName,scrollbars) {	if(scrollbars != 1) scrollbars = 0;    var newWindow = window.open(pageUrl,winName,"toolbar=0,scrollbars="+scrollbars+",location=0,statusbar=0,menubar=0,resizable=0,width="+width+",height="+height);    return newWindow;}function getQueryParameterByName(name){  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");  var regexS = "[\\?&]" + name + "=([^&#]*)";  var regex = new RegExp(regexS);  var results = regex.exec(window.location.href);  if(results == null)    return "";  else    return decodeURIComponent(results[1].replace(/\+/g, " "));}

function randomFromTo(from, to){
	return Math.floor(Math.random() * (to - from + 1) + from);
}	/* function to fix the -10000 pixel limit of jquery.animate */$.fx.prototype.cur = function(){    if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {      return this.elem[ this.prop ];    }    var r = parseFloat( jQuery.css( this.elem, this.prop ) );    return typeof r == 'undefined' ? 0 : r;}/* Adds array.indexOf functionality to IE7 */if (!Array.indexOf) {  Array.prototype.indexOf = function (obj, start) {    for (var i = (start || 0); i < this.length; i++) {      if (this[i] == obj) {        return i;      }    }    return -1;  }}$(document).ready(function() {	$(".rollover").each(function() {		addRollover($(this));	});});
/****************************************************
 * Copyright © Legwork Studio. All Rights Reserved.
 * Updated by: Matt Wiggins, 30-Mar-2012
 * 
 * Let's get loaded.
 ****************************************************
/                                                  */

var Dvlpdnvr = Dvlpdnvr || {};
	
(function($, Modernizr) {
	var $self = this;
	
	$self.preloader = (function() {
		
		// class vars
		var pub = {},
				$wn,
				$html,
				$doc,
				$body,
				prefix = (function() {
					switch(true) {
						case $.browser.msie && $.browser.version >= 9:
							return '-ms-';
						case $.browser.mozilla:
							return '-moz-';
						case $.browser.webkit:
							return '-webkit-';
						case $.browser.opera:
							return '-o-';
						default:
							return '-nope-';
					}
				})();
			
    /****************************************************
     * init:void
     * 
     * Not much to say here, how's the weather?
     ****************************************************
    /                                                  */
    pub.init = function() {
			$wn = $(window);
			$html = $('html');
			$doc = $(document);
			$body = $('body');
      
      _preload();
    };
    
    function _preload() {
      // load stuff and then ...
      Dvlpdnvr.global.init();
    }
		
		return pub;
	})();
	
	$(document).ready(function() {
		Dvlpdnvr.preloader.init();
	});
	
}).call(Dvlpdnvr, jQuery, Modernizr);

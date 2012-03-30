/**
  * Author: plarson@jiffymedia.com
  * www.jiffymedia.com
  **/
debugLevel = 1;

/* DEFAULT CONFIG VALUES */
var defaults = {
	minimumWindowWidth:960,
	minimumWindowHeight:600,
	hideMenuWidth:870,
	tabletWindowWidth:1024,
	scrollCompleteEasing:'easeInOutExpo',
	scrollCompleteVelocityModifier:1.5,
	navClickVelocityModifier:.5,
	trackPageTimerDuration:4000,
	mobileWindowWidth: 518
};

var primaryPage = '';
var currentPath = '';
var lastPath = [];
var scrollDirection = 1;
var lastScrollTop = 0;
var scrollTimeout;
var sendScrollComplete = true;
var scrollDistance = 0;
var scrollSpeed = 0;
var gridSizes = {};
var junkDrawer = {};
var activatingCover;
var sectionIndex = 0;
var articlesHeight = 0;
var activeSectionIndex = 0;
var pageTrackTimer;

//preload the rollover arrow graphics


/**
 * Initialize
 **/
jQuery( 
  function ($) {
    $.Body = $('body');
    $.Window = $(window);
    $.Scroll = ($.browser.mozilla || $.browser.msie) ? $('html') : $.Body; 
    
    $.MobileWebkit = ($.Body.hasClass('webkit-mobile') || (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)))
    $.MobileDevice = ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i)));
    $.Tablet = ((navigator.userAgent.match(/iPad/i)));
  } 
);

/**
 * Event Definitions
 **/

(function($) {

  $.Events = {
     ACTIVATE_SECTION: 'activateNavItem',
     LOAD: 'siteLoad',
     NAV_SELECTED: 'navSelected',
     UNFILTER: 'unfilter',
     KEY_ESC: 'keyEscape',
     KEY_ENTER: 'keyEnter',
     KEY_SPACE: 'keySpace',
     KEY_UP: 'keyUp',
     KEY_DOWN: 'keyDown',
     KEY_RIGHT: 'keyRight',
     KEY_LEFT: 'keyLeft',
     LOAD_CONTENT: 'loadContent',
     RESIZE: 'resizeSite',
     RESIZE_COMPLETE: 'resizeSiteComplete',
     SCROLL_COMPLETE: 'scrollComplete',
     CLICK: 'click',
     MOUSE_OVER: 'mouseover',
     MOUSE_OUT: 'mouseout',
     MOUSE_ENTER: 'mouseenter',
     MOUSE_LEAVE: 'mouseleave',
     MOUSE_DOWN: 'mousedown',
     MOUSE_UP: 'mouseup',
     SCROLL: 'scroll',
     CHECK_ACTIVE_INDEX: 'checkActiveIndex',
     TRACK_PAGE:'trackPage'
 } // Events
  
  if($.MobileWebKit) $.Events.CLICK = 'ontouchstart';
})(jQuery);

/* Auto Instantiate */

(function($) {
  $.fn.Instantiate = function(settings) {
    var config = {};
    if(settings) $.extend(config, settings);
      this.each(function() { 
          var $me = $(this),
              $controller = $me.attr('data-script');
          try {
         	 if ($me[$controller]) { $me[$controller](config); }
         } catch(err) {
         	debug("couldn't instantiate:"+$controller,"error");
         	if(debugLevel > 0 && $me[$controller]) { $me[$controller](config); }
         }
      });
  }
})(jQuery);

/**
 * UI Objects 
 **/
(function($) {
	$.fn.Site = function(settings) {
		var $parent = this;
			config = {};
			if (defaults) $.extend(config, defaults);
			if (settings) $.extend(config, settings);
		
		this.each(function(index) {
			var $me = $(this),
				_index = index,
				_resizeTimer,
				_scrollTimeout,
				_content = $me.find("#content");
			$.Window.on('resize',_resize);
			$.Window.on('scroll',_onScroll);
			register($.Events.KEY_DOWN,_moveDown,config.myName);
			register($.Events.KEY_UP,_moveUp,config.myName);
			
			debug("SITE");
			function _init() {
				$.Window.minWidth = config.minimumWindowWidth;
				$.Window.minHeight = config.minimumWindowHeight;
				
				$('[data-script]').Instantiate(config);
			    
			    $.Window.keydown(function(event) {
			    	var keycode = (event.keyCode ? event.keyCode : event.which);
			    	if (keycode == 37) {
			    		$.Window.triggerHandler($.Events.KEY_LEFT);
			    	} else if (keycode == 39) {
			    		$.Window.triggerHandler($.Events.KEY_RIGHT);
			    	} else if (keycode == 27) {
			    		$.Window.triggerHandler($.Events.KEY_ESC);
			    	} else if (keycode == 38) {
			    		event.preventDefault();
			    		$.Window.triggerHandler($.Events.KEY_UP);
			    	} else if(keycode == 40) {
			    		event.preventDefault();
			    		$.Window.triggerHandler($.Events.KEY_DOWN);
			    	} else if(keycode == 32) {
			    		$.Window.triggerHandler($.Events.KEY_ENTER);
			    	} else if(keycode == 13) {
			    		$.Window.triggerHandler($.Events.KEY_SPACE);
			    	}
			    });
			    _content.Content(config);
			    
			    /* Determine the first active section */
			    setTimeout(function() {
			    	if($($.Scroll).scrollTop() > 0) {
		    			activeSectionIndex = Math.floor($($.Scroll).scrollTop()/$.Window.height());
			    	}
			    }, 300);
			}
			
			function _moveDown(evt) {
				debug();
				evt.preventDefault();
				debug($('section').size());
				debug('activeSectionIndex:'+activeSectionIndex);
				if(activeSectionIndex < $('section').size()) {
					debug($('nav a').eq(activeSectionIndex + 1));
					$('nav a').eq(activeSectionIndex + 1).trigger('click');
				}
			}
			
			function _moveUp(evt) {
				debug();
				evt.preventDefault();
				if(activeSectionIndex > 0) {
					$('nav a').eq(activeSectionIndex - 1).trigger('click');
				}
			}
				
			/**
			 * Triggers a resize complete object when resizing is finished
			 **/
			function _resizeComplete() {
				$.Window.windowWidth = $.Window.width();
				$.Window.windowHeight = $.Window.height();
				if($.Window.windowWidth < $.Window.minWidth) $.Window.windowWidth = $.Window.minWidth;
				$.Body.width($.Window.windowWidth);
				$.Window.triggerHandler($.Events.RESIZE_COMPLETE);
			}
			
			/**
			 * Triggers a resize event after setting global variables for window
			 * width and height (so we don't have to keep measuring that
			 **/
			function _resize(evt) {
				$.Window.windowWidth = $.Window.width();
				$.Window.trueWindowWidth = $.Window.width();
				$.Window.windowHeight = $.Window.height();
				$.Window.windowWidth = (($.Window.windowWidth < $.Window.minWidth) && !$.MobileDevice) ? $.Window.minWidth : $.Window.windowWidth;
				if(!$.MobileDevice) {
					$.Window.windowHeight = ($.Window.windowHeight < $.Window.minHeight) ? $.Window.minHeight : $.Window.windowHeight;
				}
				$.Body.width($.Window.windowWidth);
				$.Window.trigger($.Events.RESIZE);
				clearTimeout(_resizeTimer);
				_resizeTimer = setTimeout(function() {
					clearTimeout(_resizeTimer);
					_resizeComplete();
				},150);
			}
			
			function _onScroll(evt) {
				if($.MobileDevice) return;
				if(!sendScrollComplete) evt.preventDefault();
				scrollDistance = Math.abs($.Window.scrollTop() - lastScrollTop);
				scrollSpeed = (scrollDistance/$.Body.height())*50000;
				(lastScrollTop < $.Window.scrollTop()) ? scrollDirection = 1 : scrollDirection = -1;
				if(lastScrollTop == $.Window.scrollTop()) scrollDirection = 0;
				lastScrollTop = $.Window.scrollTop();
				clearTimeout(_scrollTimeout);
				_scrollTimeout = setTimeout(function() {
					clearTimeout(_scrollTimeout);
					if(sendScrollComplete) $.Window.triggerHandler($.Events.SCROLL_COMPLETE);
				},300);
			}
			
			_init();
			_resize();
			$.Window.trigger("resize");
		});
	   
	   return this;
	} //PDL
	
	$.fn.Content = function(settings) {
		var $parent = this,
			config = {
					myName:'Content'
				};
			if (settings) $.extend(config, settings);
		
		this.each(function(index) {
			var $me = $(this),
				_index = index,
				_sections = $me.find("section"),
				_scrollCount = 0,
				_topBounds = 0,
				_scrollCompleting = false,
				_navigation = $('nav.primary'),
				_disabled = false;
				
			register($.Events.SCROLL,_onScroll,config.myName);
			//register($.Events.SCROLL_COMPLETE,_onScrollComplete,config.myName);
			register($.Events.NAV_SELECTED,_onNavSelected,config.myName);
			//register($.Events.RESIZE_COMPLETE,_resizeComplete,config.myName);
			
			function _onNavSelected(evt,which) {
				if($.MobileDevice) return;
				var scrollStop = $('section').eq(which).offset().top - 168;
				tv = 800;
				$.Scroll.stop().animate({scrollTop:scrollStop},tv,config.scrollCompleteEasing,function() {
					preventActivation = false;
					if($.Tablet || $.MobileDevice) {
						//hack to fix an ipad bug with scrolling under fixed position elements
						$("nav.primary").css("position","relative");
						setTimeout(function() {
							$($.Scroll).scrollTop(scrollStop);
							$("nav.primary").css({position:"fixed", zIndex:"1002"});
						},0);	
					}
				});
			}
			
			function _resizeComplete() {
				trigger($.Events.RESIZE);
			}
			
			function _onScrollComplete(evt,direction) {
				if($.MobileDevice || $.Tablet || _disabled) return;

			 	_startingScrollDirection = scrollDirection;
				$('section._active').removeClass("_active");
				$me.find('section').eq(activeSectionIndex).addClass("_active");
				sendScrollComplete = false;
				var scrollStop = ($me.find('section').eq(activeSectionIndex).offset().top);
				
				var tv = Math.abs($($.Scroll).scrollTop() - scrollStop)*config.scrollCompleteVelocityModifier;
				_scrollCompleting = true;
				_scrollCount = 0;
				var lastScrollPosition = $($.Scroll).scrollTop();
				$.Scroll.animate(
					{scrollTop:scrollStop},
					{duration:tv,
					 easing:config.scrollCompleteEasing,
					 step:function(now) {
					 	_nextScrollStep = now;
					 	_scrollCount = 0;
					 	lastScrollPosition = now;
					 },
					 complete:function() {
					 	_scrollCompleting = false;
					 	$.Window.triggerHandler($.Events.CHECK_ACTIVE_INDEX);
						setTimeout(function() { 
						 		clearTimeout(scrollTimeout);
						 		sendScrollComplete = true;
						 		$.Window.triggerHandler($.Events.CHECK_ACTIVE_INDEX);
						 	},50);
					 	}
					 	
					 }
				 );
			}
			
			function _onScroll(evt) {
				if($.MobileDevice) return;
				_scrollCount++;
				if(_scrollCompleting) {
					if((_scrollCount > 1) || (_startingScrollDirection != scrollDirection) || (_startingScrollDirection > 0 && _nextScrollStep < $($.Scroll).scrollTop())) {
						$.Scroll.stop().clearQueue();
						activatingCover = false; 
						_scrollCompleting = false;
						setTimeout(function() { 
						 	sendScrollComplete = true;
						 },100);
					}
				}
			}
			
			function _init() {
				_navigation.Navigation(config);
				_sections.Section(config);
			}
			
			_init();
		});
	   
	   return this;
	} //Content

	$.fn.Navigation = function(settings) {
	 var config = {};
	 if (settings) $.extend(config, settings);
	   this.each(function() { 
	      var $me = $(this),
	      	_hidden = false,
	     	$navitems = $me.find('a');
	          
	      register($.Events.RESIZE,_resize,config.myName);
	      
	      function _resize() {
	      	if($.Window.trueWindowWidth < config.hideMenuWidth || $.MobileDevice) {
	      		$me.hide();
	      		_hidden = true;
	      	} else if(_hidden) {
	      		$me.show();
	      		_hidden = false;
	      	}
	      }
	          
	      $navitems.NavItem();
	   });
	   
	   return this;
	} //Navigation
	
	$.fn.NavItem = function() {
	     var $parent = this
	     this.each(function(index) {
	     
	     	var $me = $(this),
	     		_index = index;
			register($.Events.ACTIVATE_SECTION,_activate,config.myName);
	     	$me.on($.Events.CLICK,_onClick);
	     	
	     	function _onClick(evt) {
	     		if($me.hasClass("external")) return;
	     		evt.preventDefault();
	     		$.Window.triggerHandler($.Events.NAV_SELECTED,_index);
	     	}
	     	
	     	function _activate(evt,data) {
	     		if((_index == data) && !$me.hasClass("active")) {
	     			$me.addClass("active");
	     		} else if (_index != data && $me.hasClass("active")) {
	     			$me.removeClass("active");
	     		}
	     	}
	     });
	     
	     return this;
	} //NavItem
	
	$.fn.Section = function(settings) {
		var $parent = this,
			config = {},
			sectionArticlesHeight = 0;
			
		if(settings) $.extend(config, settings);
		
		this.each(function(index) {
			var $me = $(this),
				_index = index,
				_myHeight = 0,
				_myTop = 0,
				_myName = $me.attr("id"),
				_isLast = (_index == $("section").size()-1);
				_disabled = false,
				_imActive = false;
				
			debug("section");
			
			register($.Events.RESIZE,_resize,config.myName);
			register($.Events.CHECK_ACTIVE_INDEX,_onChecksectionIndex,config.myName);
			register($.Events.SCROLL,$.throttle(100,_onScroll),config.myName);
			
			if(_index == 0) {
				$me.addClass("_active");
			} else {
				$me.removeClass("_active");
			}
			
			function _onChecksectionIndex(evt) {
				if($.MobileDevice) return;
				debug();
				var windowPercentage = ($($.Scroll).scrollTop() - _myTop)/$.Window.windowHeight;
				if((windowPercentage < .2) && (windowPercentage > -.2)) {
					trigger($.Events.ACTIVATE_SECTION, _index);
				}
			}
			
			function _onScroll() {
				if($.MobileDevice) return;
				if(scrollDirection==0) return;
				var windowPercentage = ($($.Scroll).scrollTop()-_myTop)/$.Window.windowHeight;
				if(scrollDirection > 0) {
					var upperPercentage = .9;
					if((windowPercentage > -upperPercentage) && (windowPercentage < -.01) && (activeSectionIndex != _index)) {
						activeSectionIndex = _index;
						$.Window.triggerHandler($.Events.ACTIVATE_SECTION, [_index,_myName]);
					}
				} else {
					windowPercentage = ($($.Scroll).scrollTop()-_myTop)/$me.height();
					var upperPercentage = .91;
					if((windowPercentage > .1) && (windowPercentage < upperPercentage) && (activeSectionIndex != _index)) {
						activeSectionIndex = _index;
						$.Window.triggerHandler($.Events.ACTIVATE_SECTION, [_index,_myName]);
					}
				}
			}
			
			function _resize() {
				_myHeight = $.Window.windowHeight;
				if(_isLast) _myHeight = _myHeight - 244;
				if($.MobileDevice) {
					//$me.css({width:getPixelString($.Window.windowWidth)});
					$me.css({height:getPixelString(_myHeight)});
				} else {
					$me.css({height:getPixelString(_myHeight)});
				}
				_myTop = $me.offset().top;
			}
			
			function _init() {
				_resize();
			}
			
			_init();
		});
	   
	   return this;
	} //Section
	
	
})(jQuery);

$(document).ready(function() {
	$(this).Site();
});

function register(evt,handler,namespace) {
	$.Window.on(evt+'.'+namespace,handler);
}

function trigger(eventName,data) {
	if(data==null) {	
		$.Window.triggerHandler(eventName);
	} else {
		$.Window.triggerHandler(eventName, data);
	}
}
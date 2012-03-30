/****************************************************
 * Copyright © Legwork Studio. All Rights Reserved.
 * Updated by: Matt Wiggins, 30-Mar-2012
 * 
 * Now let's get serious.
 ****************************************************
/                                                  */

var Dvlpdnvr = Dvlpdnvr || {};

(function($, Modernizr) {
	var $self = this;
	
	$self.global = (function() {
		
		// class vars
		var pub = {},
				$wn,
				$html,
				$doc,
				$body,
				$mn,
				$ct,
				$tt,
				example_cnv,
				example_ctx,
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
			$mn = $('#main-nav').find('a');
			$ct = $('#canvas-test');
			$tt = $('<div id="tooltip" />').appendTo($body);
			
			_initCanvas();
			_observeSomeSweetEvents();
		};
		
		/****************************************************
		 * _initCanvas:void
		 * 
		 * Init a cross browser canvas.
		 ****************************************************
		/                                                  */
		function _initCanvas() {
			// add canvas
			example_cnv = document.createElement('canvas');
			example_cnv.setAttribute('id', 'example_cnv');
			example_cnv.setAttribute('width', '270');
			example_cnv.setAttribute('height', '200');
			$ct.prepend(example_cnv);
			
			// init excanvas for IE7 + 8
			if(!Modernizr.canvas) {
        example_cnv = G_vmlCanvasManager.initElement(example_cnv);
			}
			
			// get context
			example_ctx = example_cnv.getContext('2d');
			
			example_ctx.strokeStyle = 'rgba(' + Math.round(Math.random() * 255) + ', ' + Math.round(Math.random() * 255) + ', ' + Math.round(Math.random() * 255) + ', ' + 1 + ')';
			example_ctx.lineWidth = 1;
			example_ctx.beginPath();
			example_ctx.moveTo(135, 100);
			
			for(i = 0; i < 100; i++) {
				example_ctx.lineTo(Math.round(Math.random() * 270), Math.round(Math.random() * 200));
			}
			
			example_ctx.closePath();
			example_ctx.stroke();
		}
		
		/****************************************************
		 * _observeSomeSweetEvents:void
		 * 
		 * Add event listeners.
		 ****************************************************
		/                                                  */
		function _observeSomeSweetEvents() {
			if($html.hasClass('ios') === false) {
    		$mn
    		.on('mousemove', function(e) {
            $tt.text($(this).attr('data-tooltip')).css({'top':(e.pageY - 8) + 'px', 'left':(e.pageX + 15) + 'px'}).show();
        })
        .on('mouseleave', function(e) {
            $tt.hide();
        });
			}
		}

		return pub;
	})();
}).call(Dvlpdnvr, jQuery, Modernizr);
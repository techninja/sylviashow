(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY;};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev]);}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob);},cfg.interval);}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev]);};var handleHover=function(e){var p=(e.type=="mouseover"?e.fromElement:e.toElement)||e.relatedTarget;while(p&&p!=this){try{p=p.parentNode;}catch(e){p=this;}}if(p==this){return false;}var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);}if(e.type=="mouseover"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob);},cfg.interval);}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob);},cfg.timeout);}}};return this.mouseover(handleHover).mouseout(handleHover);};})(jQuery);

(function ($) {

Drupal.behaviors.sylviashow_features = {
  attach: function (context) {
    $('.views-field-body, .views-field-field-ep-number', $('.view-episodes.view-display-id-page')).each(function(){
      $text = $(this);
      $text.data('fullheight', $text.height())
        .height(0)
        .css('opacity', 0.5)
        .addClass('hover-hide');
    });

    $('.view-episodes .views-row').hoverIntent(function(){
      $('.hover-hide', this).each(function(){
        $(this).animate({opacity: 1, height: $(this).data('fullheight')}, 500);
      });
    }, function(){
      $('.hover-hide', this).each(function(){
        $(this).animate({opacity: 0.5, height: 0}, 500);
      });
    });

  }
};

Drupal.behaviors.sylviashow_episode_tabs = {
  attach: function (context) {
    $('.node-type-episode .node-episode .content', context).each(function(){
      var $ep = $(this);
      var tabs = [];

      $('.vert-tabs', $ep).each(function(index){
        var $name = $('div.description', this);
        tabs.push($name.text());
        $name.remove();
        $(this).attr('id', 'tab-' + index);
      });

      var items = '<ul>';
      $.each(tabs, function(i, val){
        items = items + '<li><a href="#tab-' + i + '">' + val + '</a></li>';
      });
      $ep.prepend(items + '</ul>');

      //$ep.tabs();
      $ep.tabs({ fx: { opacity: 'toggle' }}).addClass('ui-tabs-vertical ui-helper-clearfix');
      $('li', $ep).removeClass('ui-corner-top').addClass('ui-corner-left');

    });
  }
};

Drupal.behaviors.sylviashow_animbots = {
  attach: function (context) {
   /*
    $('body').append('<div class="animbot" id="turtle"></div>');
    $turtle = $('#turtle');
    $turtle.sprite({fps: 5, no_of_frames: 2}).spState(4).rotate(90);

    var SineWave = function() {
      this.css = function(p) {
        var css = {};

        var s = Math.sin(p*20)
        css.prevX = this.x;
        css.prevY = this.y;
        css.x = 500 - p * 300;
        css.y = s * 100 + 150;
        css.opacity = ((s+2)/4+0.1);

        return css;
      }
    };

    var bezier_params = {
      start: {
        x: 0,
        y: 0,
        angle: 10
      },
      end: {
        x:540,
        y:500,
        angle: -400,
        length: 0.4
      }
    };

    //$.path.bezier(bezier_params)
    $turtle.animate({path : new $.path.bezier(bezier_params, true)}, 10000)
  //*/

  }
};

Drupal.behaviors.sylviashow_masonry = {
  attach: function (context) {
   $('.view-press-clippings .view-content').masonry({
     itemSelector : '.views-row',
     columnWidth : 445
   });

  }
};

})(jQuery);
;
/*
 * jQuery spritely 0.4
 * http://spritely.net/
 *
 * Documentation:
 * http://spritely.net/documentation/
 *
 * Copyright 2010, Peter Chater, Artlogic Media Ltd, http://www.artlogic.net/
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Change history:
 * Version 0.4
 *   - add up/down for 'pan' method. <ricky.hewitt@artlogic.net>
 *   - added 'dir' option for Sprites. This means a Sprite can be played in reverse. <michel.gotta@4wdmedia.de>
 *   - removed alert message regarding jQuery.draggable (now uses console.log, if available) <ricky.hewitt@artlogic.net>
 * Version 0.3b
 *   - added lockTo method for locking sprites to background images. $('#sprite').lockTo('#background, {'left': 380, 'top': -60, 'bg_img_width': 1110});
 * Version 0.2.1
 *   - animate function will stop cycling after play_frames has completed
 * Version 0.2 beta
 *   - added isDraggable method (requires jquery-ui) $('#sprite').sprite().isDraggable({start: null, stop: function() {alert('Ouch! You dropped me!')});
 *   - sprites may be set to play a limited number of frames when instantiated, e.g. $('#sprite').sprite({fps: 9, no_of_frames: 3, play_frames: 30})
 *   - sprite speed may be controlled at any point by setting the frames-per-second $('#sprite').fps(20);
 *   - sprites with multiple rows of frames may have there 'state' changed, e.g. to make the second row of frames
 *     active, use: $('#sprite').spState(2); - to return to the first row, use $('#sprite').spState(1);
 *   - background element speed may be controlled at any point with .spSpeed(), e.g. $('#bg1').spSpeed(10)
 *   - background elements may be set to a depth where 100 is the viewer (up close) and 0 is the horizon, e.g.:
 *     $('#bg1').pan({fps: 30, speed: 2, dir: 'left', depth: 30});
 *     $('#bg2').pan({fps: 30, speed: 3, dir: 'left', depth: 70});
 *     relative speed of backgrounds may now be set in a single action with $('#bg1, #bg2').spRelSpeed(20);
 *     which will make elements closer to the horizon (lower depths) move slower than closer elements (higher depths)
 */

(function($) {
	$._spritely = {
		// shared methods and variables used by spritely plugin
		animate: function(options) {
			var el = $(options.el);
			var el_id = el.attr('id');
			options = $.extend(options, $._spritely.instances[el_id] || {});
			if (options.play_frames && !$._spritely.instances[el_id]['remaining_frames']) {
				$._spritely.instances[el_id]['remaining_frames'] = options.play_frames + 1;
			}
			if (options.type == 'sprite' && options.fps) {
				var frames;
				var animate = function(el) {
					var w = options.width, h = options.height;
					if (!frames) {
						frames = [];
						total = 0
						for (var i = 0; i < options.no_of_frames; i ++) {
							frames[frames.length] = (0 - total);
							total += w;
						}
					}

					if (options.rewind == true) {
						if ($._spritely.instances[el_id]['current_frame'] <= 0) {
							$._spritely.instances[el_id]['current_frame'] = frames.length - 1;
						} else {
							$._spritely.instances[el_id]['current_frame'] = $._spritely.instances[el_id]['current_frame'] - 1;
						};
					} else {
						if ($._spritely.instances[el_id]['current_frame'] >= frames.length - 1) {
							$._spritely.instances[el_id]['current_frame'] = 0;
						} else {
							$._spritely.instances[el_id]['current_frame'] = $._spritely.instances[el_id]['current_frame'] + 1;
						}
					}

					var yPos = $._spritely.getBgY(el);
					el.css('background-position', frames[$._spritely.instances[el_id]['current_frame']] + 'px ' + yPos);
					if (options.bounce && options.bounce[0] > 0 && options.bounce[1] > 0) {
						var ud = options.bounce[0]; // up-down
						var lr = options.bounce[1]; // left-right
						var ms = options.bounce[2]; // milliseconds
						el
							.animate({top: '+=' + ud + 'px', left: '-=' + lr + 'px'}, ms)
							.animate({top: '-=' + ud + 'px', left: '+=' + lr + 'px'}, ms);
					}
				}
				if ($._spritely.instances[el_id]['remaining_frames'] && $._spritely.instances[el_id]['remaining_frames'] > 0) {
					$._spritely.instances[el_id]['remaining_frames'] --;
					if ($._spritely.instances[el_id]['remaining_frames'] == 0) {
						$._spritely.instances[el_id]['remaining_frames'] = -1;
						delete $._spritely.instances[el_id]['remaining_frames'];
						return;
					} else {
						animate(el);
					}
				} else if ($._spritely.instances[el_id]['remaining_frames'] != -1) {
					animate(el);
				}
			} else if (options.type == 'pan') {
				if (!$._spritely.instances[el_id]['_stopped']) {
                                        if (options.dir == 'up') {
                                            $._spritely.instances[el_id]['l'] = $._spritely.getBgX(el).replace('px', '');
                                            $._spritely.instances[el_id]['t'] = ($._spritely.instances[el_id]['t'] - (options.speed || 1)) || 0;
                                        }
                                        else if (options.dir == 'down') {
                                            $._spritely.instances[el_id]['l'] = $._spritely.getBgX(el).replace('px', '');
                                            $._spritely.instances[el_id]['t'] = ($._spritely.instances[el_id]['t'] + (options.speed || 1)) || 0;
                                        }
					else if (options.dir == 'left') {
						$._spritely.instances[el_id]['l'] = ($._spritely.instances[el_id]['l'] - (options.speed || 1)) || 0;
                                                $._spritely.instances[el_id]['t'] = $._spritely.getBgY(el).replace('px', '');
					} else {
						$._spritely.instances[el_id]['l'] = ($._spritely.instances[el_id]['l'] + (options.speed || 1)) || 0;
                                                $._spritely.instances[el_id]['t'] = $._spritely.getBgY(el).replace('px', '');
					}

                                        // When assembling the background-position string, care must be taken
                                        // to ensure correct formatting.. <ricky.hewitt@artlogic.net>
                                        var bg_left = $._spritely.instances[el_id]['l'].toString();
                                        if (bg_left.indexOf('%') == -1) {
                                            bg_left += 'px ';
                                        } else { bg_left += ' '; }

                                        var bg_top = $._spritely.instances[el_id]['t'].toString();
                                        if (bg_top.indexOf('%') == -1) {
                                            bg_top += 'px ';
                                        } else { bg_top += ' '; }

					$(el).css('background-position', bg_left + bg_top);
				}
			}
			$._spritely.instances[el_id]['options'] = options;
			window.setTimeout(function() {
				$._spritely.animate(options);
			}, parseInt(1000 / options.fps));
		},
		randomIntBetween: function(lower, higher) {
			return parseInt(rand_no = Math.floor((higher - (lower - 1)) * Math.random()) + lower);
		},
		getBgY: function(el) {
			if ($.browser.msie) {
				// fixme - the background-position property does not work
				// correctly in IE so we have to hack it here... Not ideal
				// especially as $.browser is depricated
				var bgY = $(el).css('background-position-y') || '0';
			} else {
				var bgY = ($(el).css('background-position') || ' ').split(' ')[1];
			}
			return bgY;
		},
		getBgX: function(el) {
			if ($.browser.msie) {
				// see note, above
				var bgX = $(el).css('background-position-x') || '0';
			} else {
				var bgX = ($(el).css('background-position') || ' ').split(' ')[0];
			}
			return bgX;
		},
		get_rel_pos: function(pos, w) {
			// return the position of an item relative to a background
			// image of width given by w
			var r = pos;
			if (pos < 0) {
				while (r < 0) {
					r += w;
				}
			} else {
				while (r > w) {
					r -= w;
				}
			}
			return r;
		}
	};
	$.fn.extend({
		spritely: function(options) {
			var options = $.extend({
				type: 'sprite',
				do_once: false,
				width: null,
				height: null,
				fps: 12,
				no_of_frames: 2,
				stop_after: null
			}, options || {});
			var el_id = $(this).attr('id');
			if (!$._spritely.instances) {
				$._spritely.instances = {};
			}
			if (!$._spritely.instances[el_id]) {
				$._spritely.instances[el_id] = {current_frame: -1};
			}
			$._spritely.instances[el_id]['type'] = options.type;
			$._spritely.instances[el_id]['depth'] = options.depth;
			options.el = this;
			options.width = options.width || $(this).width() || 100;
			options.height = options.height || $(this).height() || 100;
			var get_rate = function() {
                return parseInt(1000 / options.fps);
            }
            if (!options.do_once) {
				window.setTimeout(function() {
					$._spritely.animate(options);
				}, get_rate(options.fps));
			} else {
				$._spritely.animate(options);
			}
			return this; // so we can chain events
		},
		sprite: function(options) {
			var options = $.extend({
				type: 'sprite',
				bounce: [0, 0, 1000] // up-down, left-right, milliseconds
			}, options || {});
			return $(this).spritely(options);
		},
		pan: function(options) {
			var options = $.extend({
				type: 'pan',
				dir: 'left',
				continuous: true,
				speed: 1 // 1 pixel per frame
			}, options || {});
			return $(this).spritely(options);
		},
		flyToTap: function(options) {
			var options = $.extend({
				el_to_move: null,
				type: 'moveToTap',
				ms: 1000, // milliseconds
				do_once: true
			}, options || {});
			if (options.el_to_move) {
				$(options.el_to_move).active();
			}
			if ($._spritely.activeSprite) {
				if (window.Touch) { // iphone method see http://cubiq.org/remove-onclick-delay-on-webkit-for-iphone/9 or http://www.nimblekit.com/tutorials.html for clues...
					$(this)[0].ontouchstart = function(e) {
						var el_to_move = $._spritely.activeSprite;
						var touch = e.touches[0];
						var t = touch.pageY - (el_to_move.height() / 2);
						var l = touch.pageX - (el_to_move.width() / 2);
						el_to_move.animate({
							top: t + 'px',
							left: l + 'px'
						}, 1000);
					};
				} else {
					$(this).click(function(e) {
						var el_to_move = $._spritely.activeSprite;
						$(el_to_move).stop(true);
						var w = el_to_move.width();
						var h = el_to_move.height();
						var l = e.pageX - (w / 2);
						var t = e.pageY - (h / 2);
						el_to_move.animate({
							top: t + 'px',
							left: l + 'px'
						}, 1000);
					});
				}
			}
			return this;
		},
                // isDraggable requires jQuery ui
		isDraggable: function(options) {
			if ((!$(this).draggable)) {
				//console.log('To use the isDraggable method you need to load jquery-ui.js');
				return this;
			}
			var options = $.extend({
				type: 'isDraggable',
				start: null,
				stop: null,
				drag: null
			}, options || {});
			var el_id = $(this).attr('id');
			$._spritely.instances[el_id].isDraggableOptions = options;
			$(this).draggable({
				start: function() {
					var el_id = $(this).attr('id');
					$._spritely.instances[el_id].stop_random = true;
					$(this).stop(true);
					if ($._spritely.instances[el_id].isDraggableOptions.start) {
						$._spritely.instances[el_id].isDraggableOptions.start(this);
					}
				},
				drag: options.drag,
				stop: function() {
					var el_id = $(this).attr('id');
					$._spritely.instances[el_id].stop_random = false;
					if ($._spritely.instances[el_id].isDraggableOptions.stop) {
						$._spritely.instances[el_id].isDraggableOptions.stop(this);
					}
				}
			});
			return this;
		},
		active: function() {
			// the active sprite
			$._spritely.activeSprite = this;
			return this;
		},
		activeOnClick: function() {
			// make this the active script if clicked...
			var el = $(this);
			if (window.Touch) { // iphone method see http://cubiq.org/remove-onclick-delay-on-webkit-for-iphone/9 or http://www.nimblekit.com/tutorials.html for clues...
				el[0].ontouchstart = function(e) {
					$._spritely.activeSprite = el;
				};
			} else {
				el.click(function(e) {
					$._spritely.activeSprite = el;
				});
			}
			return this;
		},
		spRandom: function(options) {
			var options = $.extend({
				top: 50,
				left: 50,
				right: 290,
				bottom: 320,
				speed: 4000,
				pause: 0
			}, options || {});
			var el_id = $(this).attr('id');
			if (!$._spritely.instances[el_id].stop_random) {
				var r = $._spritely.randomIntBetween;
				var t = r(options.top, options.bottom);
				var l = r(options.left, options.right);
				$('#' + el_id).animate({
					top: t + 'px',
					left: l + 'px'
				}, options.speed)
			}
			window.setTimeout(function() {
				$('#' + el_id).spRandom(options);
			}, options.speed + options.pause)
			return this;
		},
		makeAbsolute: function() {
			// remove an element from its current position in the DOM and
			// position it absolutely, appended to the body tag.
			return this.each(function() {
				var el = $(this);
				var pos = el.position();
				el.css({position: "absolute", marginLeft: 0, marginTop: 0, top: pos.top, left: pos.left })
					.remove()
					.appendTo("body");
			});

		},
		spSet: function(prop_name, prop_value) {
			var el_id = $(this).attr('id');
			$._spritely.instances[el_id][prop_name] = prop_value;
			return this;
		},
		spGet: function(prop_name, prop_value) {
			var el_id = $(this).attr('id');
			return $._spritely.instances[el_id][prop_name];
		},
		spStop: function(bool) {
			$(this).each(function() {
				var el_id = $(this).attr('id');
				$._spritely.instances[el_id]['_last_fps'] = $(this).spGet('fps');
				$._spritely.instances[el_id]['_stopped'] = true;
				$._spritely.instances[el_id]['_stopped_f1'] = bool;
				if ($._spritely.instances[el_id]['type'] == 'sprite') {
					$(this).spSet('fps', 0);
				}
				if (bool) {
					// set background image position to 0
					var bp_top = $._spritely.getBgY($(this));
					$(this).css('background-position', '0 ' + bp_top);
				}
			});
			return this;
		},
		spStart: function() {
			$(this).each(function() {
				var el_id = $(this).attr('id');
				var fps = $._spritely.instances[el_id]['_last_fps'] || 12;
				$._spritely.instances[el_id]['_stopped'] = false;
				if ($._spritely.instances[el_id]['type'] == 'sprite') {
					$(this).spSet('fps', fps);
				}
			});
			return this;
		},
		spToggle: function() {
			var el_id = $(this).attr('id');
			var stopped = $._spritely.instances[el_id]['_stopped'] || false;
			var stopped_f1 = $._spritely.instances[el_id]['_stopped_f1'] || false;
			if (stopped) {
				$(this).spStart();
			} else {
				$(this).spStop(stopped_f1);
			}
			return this;
		},
		fps: function(fps) {
			$(this).each(function() {
				$(this).spSet('fps', fps);
			});
			return this;
		},
		spSpeed: function(speed) {
			$(this).each(function() {
				$(this).spSet('speed', speed);
			});
			return this;
		},
		spRelSpeed: function(speed) {
			$(this).each(function() {
				var rel_depth = $(this).spGet('depth') / 100;
				$(this).spSet('speed', speed * rel_depth);
			});
			return this;
		},
		spChangeDir: function(dir) {
			$(this).each(function() {
				$(this).spSet('dir', dir);
			});
			return this;
		},
		spState: function(n) {
			$(this).each(function() {
				// change state of a sprite, where state is the vertical
				// position of the background image (e.g. frames row)
				var yPos = ((n - 1) * $(this).height()) + 'px';
				var xPos = $._spritely.getBgX($(this));
				var bp = xPos + ' -' + yPos;
				$(this).css('background-position', bp);
			});
			return this;
		},
		lockTo: function(el, options) {
			$(this).each(function() {
				var el_id = $(this).attr('id');
				$._spritely.instances[el_id]['locked_el'] = $(this);
				$._spritely.instances[el_id]['lock_to'] = $(el);
				$._spritely.instances[el_id]['lock_to_options'] = options;
				window.setInterval(function() {
					if ($._spritely.instances[el_id]['lock_to']) {
						var locked_el = $._spritely.instances[el_id]['locked_el'];
						var locked_to_el = $._spritely.instances[el_id]['lock_to'];
						var locked_to_options = $._spritely.instances[el_id]['lock_to_options'];
						var locked_to_el_w = locked_to_options.bg_img_width;
						var locked_to_el_h = locked_to_el.height();
						var locked_to_el_y = $._spritely.getBgY(locked_to_el);
						var locked_to_el_x = $._spritely.getBgX(locked_to_el);
						var el_l = (parseInt(locked_to_el_x) + parseInt(locked_to_options['left']));
						var el_t = (parseInt(locked_to_el_y) + parseInt(locked_to_options['top']));
						el_l = $._spritely.get_rel_pos(el_l, locked_to_el_w);
						$(locked_el).css({
							'top': el_t + 'px',
							'left': el_l + 'px'
						});
					}
				}, options.interval || 20);
			});
			return this;
		}
	})
})(jQuery);
// Stop IE6 re-loading background images continuously
try {
  document.execCommand("BackgroundImageCache", false, true);
} catch(err) {} ;
/*
* jQuery css bezier animation support -- Jonah Fox
* version 0.0.1
* Released under the MIT license.
*/
/*
var path = $.path.bezier({
start: {x:10, y:10, angle: 20, length: 0.3},
end: {x:20, y:30, angle: -20, length: 0.2}
})
$("myobj").animate({path: path}, duration)

*/

;(function($){

  $.path = {}


  var V = {
    rotate: function(p, degrees) {
      var radians = degrees * 3.141592654 / 180
      var c = Math.cos(radians), s = Math.sin(radians)
      return [c*p[0] - s*p[1], s*p[0] + c*p[1] ]
    },
    scale: function(p, n) {
      return [n*p[0], n*p[1]]
    },
    add: function(a, b) {
      return [a[0]+b[0], a[1]+b[1]]
    },
    minus: function(a, b) {
      return [a[0]-b[0], a[1]-b[1]]
    }
  };

  $.path.bezier = function( params, rotate ) {
    params.start = $.extend({angle: 0, length: 0.3333}, params.start )
    params.end = $.extend({angle: 0, length: 0.3333}, params.end )

    this.p1 = [params.start.x, params.start.y];
    this.p4 = [params.end.x, params.end.y];

    var v14 = V.minus(this.p4, this.p1)
    var v12 = V.scale(v14, params.start.length)
    v12 = V.rotate(v12, params.start.angle)
    this.p2 = V.add(this.p1, v12)

    var v41 = V.scale(v14, -1)
    var v43 = V.scale(v41, params.end.length)
    v43 = V.rotate(v43, params.end.angle)
    this.p3 = V.add(this.p4, v43)

    this.f1 = function(t) { return (t*t*t); }
    this.f2 = function(t) { return (3*t*t*(1-t)); }
    this.f3 = function(t) { return (3*t*(1-t)*(1-t)); }
    this.f4 = function(t) { return ((1-t)*(1-t)*(1-t)); }

    /* p from 0 to 1 */
    this.css = function(p) {
      var f1 = this.f1(p), f2 = this.f2(p), f3 = this.f3(p), f4=this.f4(p), css = {};
      if (rotate) {
        css.prevX = this.x;
        css.prevY = this.y;
      }
      css.x = this.x = this.p1[0]*f1 + this.p2[0]*f2 +this.p3[0]*f3 + this.p4[0]*f4;
      css.y = this.y = this.p1[1]*f1 + this.p2[1]*f2 +this.p3[1]*f3 + this.p4[1]*f4;
      return css;
    }
  }

  $.path.arc = function(params, rotate) {
    for(var i in params)
      this[i] = params[i]

    this.dir = this.dir || 1

    while(this.start > this.end && this.dir > 0)
      this.start -= 360

    while(this.start < this.end && this.dir < 0)
      this.start += 360

    this.css = function(p) {
      var a = ( this.start * (p ) + this.end * (1-(p )) ) * Math.PI / 180,
        css = {};

      if (rotate) {
        css.prevX = this.x;
        css.prevY = this.y;
      }
      css.x = this.x = Math.sin(a) * this.radius + this.center[0];
      css.y = this.y = Math.cos(a) * this.radius + this.center[1];
      return css;
    }

  };

  $.fx.step.path = function(fx){
    var css = fx.end.css(1 - fx.pos);
    if (css.prevX != null) {
      $(fx.elem).rotate(angle({x:css.prevX, y:css.prevY}, {x:css.x, y:css.y}));
      css = {
        top: css.y + 'px',
        left: css.x + 'px'
      }
    }
    for(var i in css)
      fx.elem.style[i] = css[i];
  }
})(jQuery);

function angle(center, p1) {
  var p0 = {x: center.x, y: center.y - Math.sqrt(Math.abs(p1.x - center.x) * Math.abs(p1.x - center.x)
  + Math.abs(p1.y - center.y) * Math.abs(p1.y - center.y))};
  return (2 * Math.atan2(p1.y - p0.y, p1.x - p0.x)) * 180 / Math.PI;
};
// VERSION: 1.8 LAST UPDATE: 9.03.2011
/* 
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * 
 * Made by Wilq32, wilq32@gmail.com, Wroclaw, Poland, 01.2009
 * Website: http://code.google.com/p/jqueryrotate/ 
 */
 (function(g){for(var d,j=document.getElementsByTagName("head")[0].style,h="transformProperty WebkitTransform OTransform msTransform MozTransform".split(" "),e=0;e<h.length;e++)j[h[e]]!==void 0&&(d=h[e]);var i="v"=="\v";jQuery.fn.extend({ImageRotate:function(a){if(!this.Wilq32||!this.Wilq32.PhotoEffect)return a=g.extend(!0,{},a),(new Wilq32.PhotoEffect(this.get(0),a))._rootObj},rotate:function(a){if(!(this.length===0||typeof a=="undefined")){typeof a=="number"&&(a={angle:a});for(var c=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                [],b=0,d=this.length;b<d;b++){var f=this.get(b);typeof f.Wilq32=="undefined"?c.push(g(g(f).ImageRotate(a))):f.Wilq32.PhotoEffect._handleRotation(a)}return c}}});Wilq32=window.Wilq32||{};Wilq32.PhotoEffect=function(){return d?function(a,c){a.Wilq32={PhotoEffect:this};this._img=this._rootObj=this._eventObj=a;this._handleRotation(c)}:function(a,c){this._img=a;this._rootObj=document.createElement("span");this._rootObj.style.display="inline-block";this._rootObj.Wilq32={PhotoEffect:this};a.parentNode.insertBefore(this._rootObj,
     a);if(a.complete)this._Loader(c);else{var b=this;jQuery(this._img).bind("load",function(){b._Loader(c)})}}}();Wilq32.PhotoEffect.prototype={_setupParameters:function(a){this._parameters=this._parameters||{};if(typeof this._angle!=="number")this._angle=0;if(typeof a.angle==="number")this._angle=a.angle;this._parameters.animateTo=typeof a.animateTo==="number"?a.animateTo:this._angle;this._parameters.easing=a.easing||this._parameters.easing||function(a,b,d,f,e){return-f*((b=b/e-1)*b*b*b-1)+d};this._parameters.duration=
     a.duration||this._parameters.duration||1E3;this._parameters.callback=a.callback||this._parameters.callback||function(){};a.bind&&a.bind!=this._parameters.bind&&this._BindEvents(a.bind)},_handleRotation:function(a){this._setupParameters(a);this._angle==this._parameters.animateTo?this._rotate(this._angle):this._animateStart()},_BindEvents:function(a){if(a&&this._eventObj){if(this._parameters.bind){var c=this._parameters.bind,b;for(b in c)c.hasOwnProperty(b)&&jQuery(this._eventObj).unbind(b,c[b])}this._parameters.bind=
         a;for(b in a)a.hasOwnProperty(b)&&jQuery(this._eventObj).bind(b,a[b])}},_Loader:function(){return i?function(a){var c=this._img.width,b=this._img.height;this._img.parentNode.removeChild(this._img);this._vimage=this.createVMLNode("image");this._vimage.src=this._img.src;this._vimage.style.height=b+"px";this._vimage.style.width=c+"px";this._vimage.style.position="absolute";this._vimage.style.top="0px";this._vimage.style.left="0px";this._container=this.createVMLNode("group");this._container.style.width=
         c;this._container.style.height=b;this._container.style.position="absolute";this._container.setAttribute("coordsize",c-1+","+(b-1));this._container.appendChild(this._vimage);this._rootObj.appendChild(this._container);this._rootObj.style.position="relative";this._rootObj.style.width=c+"px";this._rootObj.style.height=b+"px";this._rootObj.setAttribute("id",this._img.getAttribute("id"));this._rootObj.className=this._img.className;this._eventObj=this._rootObj;this._handleRotation(a)}:function(a){this._rootObj.setAttribute("id",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   this._img.getAttribute("id"));this._rootObj.className=this._img.className;this._width=this._img.width;this._height=this._img.height;this._widthHalf=this._width/2;this._heightHalf=this._height/2;var c=Math.sqrt(this._height*this._height+this._width*this._width);this._widthAdd=c-this._width;this._heightAdd=c-this._height;this._widthAddHalf=this._widthAdd/2;this._heightAddHalf=this._heightAdd/2;this._img.parentNode.removeChild(this._img);this._aspectW=(parseInt(this._img.style.width,10)||this._width)/
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       this._img.width;this._aspectH=(parseInt(this._img.style.height,10)||this._height)/this._img.height;this._canvas=document.createElement("canvas");this._canvas.setAttribute("width",this._width);this._canvas.style.position="relative";this._canvas.style.left=-this._widthAddHalf+"px";this._canvas.style.top=-this._heightAddHalf+"px";this._canvas.Wilq32=this._rootObj.Wilq32;this._rootObj.appendChild(this._canvas);this._rootObj.style.width=this._width+"px";this._rootObj.style.height=this._height+"px";this._eventObj=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           this._canvas;this._cnv=this._canvas.getContext("2d");this._handleRotation(a)}}(),_animateStart:function(){this._timer&&clearTimeout(this._timer);this._animateStartTime=+new Date;this._animateStartAngle=this._angle;this._animate()},_animate:function(){var a=+new Date,c=a-this._animateStartTime>this._parameters.duration;if(c&&!this._parameters.animatedGif)clearTimeout(this._timer);else{(this._canvas||this._vimage||this._img)&&this._rotate(~~(this._parameters.easing(0,a-this._animateStartTime,this._animateStartAngle,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               this._parameters.animateTo-this._animateStartAngle,this._parameters.duration)*10)/10);var b=this;this._timer=setTimeout(function(){b._animate.call(b)},10)}if(this._parameters.callback&&c)this._angle=this._parameters.animateTo,this._rotate(this._angle),this._parameters.callback.call(this._rootObj)},_rotate:function(){var a=Math.PI/180;return i?function(a){this._angle=a;this._container.style.rotation=a%360+"deg"}:d?function(a){this._angle=a;this._img.style[d]="rotate("+a%360+"deg)"}:function(c){this._angle=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   c;c=c%360*a;this._canvas.width=this._width+this._widthAdd;this._canvas.height=this._height+this._heightAdd;this._cnv.translate(this._widthAddHalf,this._heightAddHalf);this._cnv.translate(this._widthHalf,this._heightHalf);this._cnv.rotate(c);this._cnv.translate(-this._widthHalf,-this._heightHalf);this._cnv.scale(this._aspectW,this._aspectH);this._cnv.drawImage(this._img,0,0)}}()};if(i)Wilq32.PhotoEffect.prototype.createVMLNode=function(){document.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               try{return!document.namespaces.rvml&&document.namespaces.add("rvml","urn:schemas-microsoft-com:vml"),function(a){return document.createElement("<rvml:"+a+' class="rvml">')}}catch(a){return function(a){return document.createElement("<"+a+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}}()})(jQuery);
;
/**
 * jQuery Masonry v2.1.04
 * A dynamic layout plugin for jQuery
 * The flip-side of CSS Floats
 * http://masonry.desandro.com
 *
 * Licensed under the MIT license.
 * Copyright 2012 David DeSandro
 */
(function(a,b,c){"use strict";var d=b.event,e;d.special.smartresize={setup:function(){b(this).bind("resize",d.special.smartresize.handler)},teardown:function(){b(this).unbind("resize",d.special.smartresize.handler)},handler:function(a,c){var d=this,f=arguments;a.type="smartresize",e&&clearTimeout(e),e=setTimeout(function(){b.event.handle.apply(d,f)},c==="execAsap"?0:100)}},b.fn.smartresize=function(a){return a?this.bind("smartresize",a):this.trigger("smartresize",["execAsap"])},b.Mason=function(a,c){this.element=b(c),this._create(a),this._init()},b.Mason.settings={isResizable:!0,isAnimated:!1,animationOptions:{queue:!1,duration:500},gutterWidth:0,isRTL:!1,isFitWidth:!1,containerStyle:{position:"relative"}},b.Mason.prototype={_filterFindBricks:function(a){var b=this.options.itemSelector;return b?a.filter(b).add(a.find(b)):a},_getBricks:function(a){var b=this._filterFindBricks(a).css({position:"absolute"}).addClass("masonry-brick");return b},_create:function(c){this.options=b.extend(!0,{},b.Mason.settings,c),this.styleQueue=[];var d=this.element[0].style;this.originalStyle={height:d.height||""};var e=this.options.containerStyle;for(var f in e)this.originalStyle[f]=d[f]||"";this.element.css(e),this.horizontalDirection=this.options.isRTL?"right":"left",this.offset={x:parseInt(this.element.css("padding-"+this.horizontalDirection),10),y:parseInt(this.element.css("padding-top"),10)},this.isFluid=this.options.columnWidth&&typeof this.options.columnWidth=="function";var g=this;setTimeout(function(){g.element.addClass("masonry")},0),this.options.isResizable&&b(a).bind("smartresize.masonry",function(){g.resize()}),this.reloadItems()},_init:function(a){this._getColumns(),this._reLayout(a)},option:function(a,c){b.isPlainObject(a)&&(this.options=b.extend(!0,this.options,a))},layout:function(a,b){for(var c=0,d=a.length;c<d;c++)this._placeBrick(a[c]);var e={};e.height=Math.max.apply(Math,this.colYs);if(this.options.isFitWidth){var f=0;c=this.cols;while(--c){if(this.colYs[c]!==0)break;f++}e.width=(this.cols-f)*this.columnWidth-this.options.gutterWidth}this.styleQueue.push({$el:this.element,style:e});var g=this.isLaidOut?this.options.isAnimated?"animate":"css":"css",h=this.options.animationOptions,i;for(c=0,d=this.styleQueue.length;c<d;c++)i=this.styleQueue[c],i.$el[g](i.style,h);this.styleQueue=[],b&&b.call(a),this.isLaidOut=!0},_getColumns:function(){var a=this.options.isFitWidth?this.element.parent():this.element,b=a.width();this.columnWidth=this.isFluid?this.options.columnWidth(b):this.options.columnWidth||this.$bricks.outerWidth(!0)||b,this.columnWidth+=this.options.gutterWidth,this.cols=Math.floor((b+this.options.gutterWidth)/this.columnWidth),this.cols=Math.max(this.cols,1)},_placeBrick:function(a){var c=b(a),d,e,f,g,h;d=Math.ceil(c.outerWidth(!0)/(this.columnWidth+this.options.gutterWidth)),d=Math.min(d,this.cols);if(d===1)f=this.colYs;else{e=this.cols+1-d,f=[];for(h=0;h<e;h++)g=this.colYs.slice(h,h+d),f[h]=Math.max.apply(Math,g)}var i=Math.min.apply(Math,f),j=0;for(var k=0,l=f.length;k<l;k++)if(f[k]===i){j=k;break}var m={top:i+this.offset.y};m[this.horizontalDirection]=this.columnWidth*j+this.offset.x,this.styleQueue.push({$el:c,style:m});var n=i+c.outerHeight(!0),o=this.cols+1-l;for(k=0;k<o;k++)this.colYs[j+k]=n},resize:function(){var a=this.cols;this._getColumns(),(this.isFluid||this.cols!==a)&&this._reLayout()},_reLayout:function(a){var b=this.cols;this.colYs=[];while(b--)this.colYs.push(0);this.layout(this.$bricks,a)},reloadItems:function(){this.$bricks=this._getBricks(this.element.children())},reload:function(a){this.reloadItems(),this._init(a)},appended:function(a,b,c){if(b){this._filterFindBricks(a).css({top:this.element.height()});var d=this;setTimeout(function(){d._appended(a,c)},1)}else this._appended(a,c)},_appended:function(a,b){var c=this._getBricks(a);this.$bricks=this.$bricks.add(c),this.layout(c,b)},remove:function(a){this.$bricks=this.$bricks.not(a),a.remove()},destroy:function(){this.$bricks.removeClass("masonry-brick").each(function(){this.style.position="",this.style.top="",this.style.left=""});var c=this.element[0].style;for(var d in this.originalStyle)c[d]=this.originalStyle[d];this.element.unbind(".masonry").removeClass("masonry").removeData("masonry"),b(a).unbind(".masonry")}},b.fn.imagesLoaded=function(a){function h(){a.call(c,d)}function i(a){var c=a.target;c.src!==f&&b.inArray(c,g)===-1&&(g.push(c),--e<=0&&(setTimeout(h),d.unbind(".imagesLoaded",i)))}var c=this,d=c.find("img").add(c.filter("img")),e=d.length,f="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",g=[];return e||h(),d.bind("load.imagesLoaded error.imagesLoaded",i).each(function(){var a=this.src;this.src=f,this.src=a}),c};var f=function(b){a.console&&a.console.error(b)};b.fn.masonry=function(a){if(typeof a=="string"){var c=Array.prototype.slice.call(arguments,1);this.each(function(){var d=b.data(this,"masonry");if(!d){f("cannot call methods on masonry prior to initialization; attempted to call method '"+a+"'");return}if(!b.isFunction(d[a])||a.charAt(0)==="_"){f("no such method '"+a+"' for masonry instance");return}d[a].apply(d,c)})}else this.each(function(){var c=b.data(this,"masonry");c?(c.option(a||{}),c._init()):b.data(this,"masonry",new b.Mason(a,this))});return this}})(window,jQuery);;
//
// TechNinja - Feb 2011
// MiniPOV Helper, for Sylvia's Super Awesome Mini Maker Show Ep 7
//
// Made in a fevered rush in the course of a few days.. hackity hackity hack!
//

(function($){
  $(document).ready(function() {
    var $txtCanvas = $('#txt-canvas');
    var $col = $('<div>').addClass('col');
    var mouse_down = null;
    var last_text = '';

    if (supports_canvas()) {
      var ctx = $txtCanvas[0].getContext('2d');
    }else{
      $('#txt-paint').hide();
    }

    if ($.browser.safari){
      $('#txt-top-offset').val(-5);
    }


    // Prevent form submission when using buttons
    $('#pov-container button').click(function(event){
      event.preventDefault();
    });

    // Load POV from view.
    $('a.pov_load').click(function(e) {
      e.preventDefault();
      location.hash = "pov_" + $(this).attr('href').slice(5,-5);
    });

    // Save out LED matric to string array
    $('#make_output, #make_input, button.reset').click(function(event){
      if ($(this).is('#make_input')){
        binary_load();
      }else if($(this).is('#make_output')){
        binary_save();
      }

      if ($(this).is('#reset-on')){
        $('.led').each(function(){
          check_meld($(this).removeClass('led_off'));
        });
      }else if ($(this).is('#reset-off')){
        $('.led').addClass('led_off').removeClass('meld_right meld_left');
      }else if ($(this).is('#led-invert')){
        $('.led').each(function(){
          check_meld($(this).toggleClass('led_off'));
        });
      }

    });

    $('#save-pov-button').click(function(){
      pov_save();
    }) ;


    // Bind keydown to change for all form inputs (except numerical ones)
    $('.txt-paint-opts').bind('click change keydown',function(){
      window.setTimeout(function(){$('#txt-input').change()}, 1);
    });

    $('#txt-input').change(function(){
      draw_text();
    });

     // Bind to the change for specific triggers
     $('#txt-paint input').change(function(){
       draw_text();
     });

     $('#draw-width').change(function(){
       build_cols($(this).val());
     })

    // Initialize
    pov_init();

    // Load from URL, or draw default
    if (!hashCatch()) {
      // Draw text automatically after a wait
      window.setTimeout(function(){
        draw_text(true);
        render_text();
      }, 1000);
    }




    function pov_init(){
      // Unclick mouse bind from whole document
      $(document).bind('mouseup', function(e){
        mouse_down = null;
        check_autosize();
      });

      // Build out single column with all rows
      for (var i = 0; i < 8; i++){
        $('<a>').attr('row', i).addClass('led led_off row_'+i).attr('href', '#').appendTo($col);
      }

      build_cols($('#draw-width').val());

      // LED Click etc
      $('a.led').bind('mouseover mousedown keydown click', led_binding_target);

      // Move form fields over
      $('.form-item-title, .field-name-field-pov-author-site, .field-name-field-pov-author').prependTo($('#save-pov'));
      $('.field-name-field-pov-data').prependTo($('#import-export'));

      // Bind click drag adjusting position of text render
      var moveOrigin = {x: 0, y:0};
      var offsetOrigin = {x: 0, y:0};
      $txtCanvas.bind('mousedown mousemove', function(e) {
        if (e.type == 'mousedown') {
          mouse_down = true;
          moveOrigin = {x:e.offsetX, y: e.offsetY};
          offsetOrigin = {
            x: parseInt($('#txt-left-offset').val()),
            y: parseInt($('#txt-top-offset').val())
          };
        } else if (e.type == 'mousemove' && mouse_down === true) {
          var offset = {x: e.offsetX - moveOrigin.x, y: e.offsetY - moveOrigin.y};

          // Calculate the new values as a double accuracy offset from pixels.
          var newVals = {
            x: Math.round(offset.x / 2) + offsetOrigin.x,
            y: Math.round(offset.y / 2) + offsetOrigin.y
          };

          // Only if the value changed, changed the value (and trigger render)
          if (newVals.x !== parseInt($('#txt-left-offset').val()) || newVals.x !== parseInt($('#txt-top-offset').val())) {
            $('#txt-left-offset').val(newVals.x);
            $('#txt-top-offset').val(newVals.y).change();
          }
        }
      });

      // Bind AutoDraw change
      $('#txt-auto-draw').change(function(){
        if ($('#txt-auto-draw').is(':checked')) {
          render_text();
          $('#txt-render').attr('disabled', 'disabled');
        } else {
          $('#txt-render').attr('disabled', '');
        }
      });

      // Bind AutoSize change
      $('#draw-autosize').change(function(){
        if ($('#draw-autosize').is(':checked')) {
          $('#draw-width').attr('disabled', 'disabled');
          check_autosize();
        } else {
          $('#draw-width').attr('disabled', '');
        }
      });

      // Bind Tab links
      $('ul.pov-tabs a').click(function(e) {
        e.preventDefault();

        $('ul.pov-tabs li').removeClass('active');
        $(this).parent().addClass('active');

        // Switch content
        if (this.href.split('#')[1] == "featured") {
          $('.view-pov-list div.view-content:first').show();
          $('.view-pov-list div.attachment').hide();
        } else {
          $('.view-pov-list div.attachment').show();
          $('.view-pov-list div.view-content:first').hide();
        }
      });
      $('ul.pov-tabs a:first').click(); // Initial selection

      // Bind loading from hash
      $(window).bind('hashchange', hashCatch);

      // Bind button to Render convas to LEDs
      $('#txt-render').click(function(event){render_text();});
    }


    function hashCatch(e) {
      var h = location.hash.split('_');
      if (h[0] === '#pov' && h[1]) {
        pov_load(h[1]);
        return true;
      }

      return false;
    }

    // Output the binary text to be pasted into the Arduino
    function binary_save(){
      var $code = $('#edit-field-pov-data-und-0-value');

      var out = '';

      $('div.col').each(function(colindex){
        var row = '';
        $('.led', this).each(function(rowindex){
          row = ($(this).is('.led_off') ? '0' : '1') + row;
        });
        out+= '  B8(' + row + '),\n';
      })

      $code.val(out);
    }

    // Input binary text to be imported
    function binary_load(){
      var $code = $('#edit-field-pov-data-und-0-value');
      var lines = [];

      // Turn off auto width on import
      $('#draw-autosize').attr('checked', false).change();

      // Clear render text on import
      $('#txt-input').val('');


      $.each($code.val().split('\n'), function(i, val){
        val = $.trim(val);
        if (val && val.substr(0, 3) == 'B8('){
          lines.push(val.substr(3, 8));
        }
      });

      // Force width of drawing to imported content
      $('#draw-width').val(lines.length).change();

      // Each line is a column of rows
      $.each(lines, function(columnindex, rows){
        $.each(rows, function(rowindex, row){
          check_meld($('a.row_' + (7-rowindex), $('.col')[columnindex]).toggleClass('led_off', (row == '0' ? true : false)));
        });
      });
    }

    function build_cols(num){
      var $cols = $('.col');

      // Don't do anything if it matches
      if (num == $cols.length) {
        return;
      }

      // If we need more than we have, add those
      if (num > $cols.length){
        for (var i = $cols.length; i < num; i++){
          $col.clone().appendTo($('#pov'));
          $('.col:last a').bind('mouseover mousedown keydown click', led_binding_target);
        }
      }else{ // If we need less than we have, slice and remove them
        $cols.slice(num - $cols.length).remove();
        $('.col:last a').removeClass('meld_right');
      }

      $('#pov').width(num*31);
      $txtCanvas.attr('width', (num * 4));
      draw_text(true);
    }

    function draw_text(force_load){
      if (!supports_canvas()) return;

      var text_color = '#FFFFFF';
      var back_color = '#000000';

      if (!force_load && last_text == $('#txt-input').val() +
                       $('#txt-font-size').val() +
                       $('#txt-font').val()+
                       $('#txt-left-offset').val()+
                       $('#txt-top-offset').val() +
                       $('#txt-draw-invert').is(':checked')
         ){
        return;
      }
      last_text = $('#txt-input').val() + $('#txt-font-size').val() + $('#txt-font').val() +
                  $('#txt-left-offset').val()+ $('#txt-top-offset').val() + $('#txt-draw-invert').is(':checked');

      if ($('#txt-draw-invert').is(':checked')){
        back_color = text_color;
        text_color = '#000000';
      }

      $txtCanvas.attr('width', ($txtCanvas[0].width)); // Clear Canvas

      ctx.fillStyle = back_color;
      ctx.fillRect(0, 0, $txtCanvas[0].width, $txtCanvas[0].height);

      ctx.font = $('#txt-font-size').val()+'px '+$('#txt-font').val();
      ctx.textBaseline = 'top';
      ctx.fillStyle = text_color;

      // If enabled, auto fix the LED width to the text size
      if ($('#draw-autosize').is(':checked')) {
        var w = Math.max(26, Math.round(ctx.measureText($('#txt-input').val()).width / 4));
        if (w > $('#draw-width').val()) {
          $('#draw-width').val(w).change();
        }
      }

      ctx.fillText($('#txt-input').val(), parseInt($('#txt-left-offset').val()), parseInt($('#txt-top-offset').val()));

      if ($('#txt-auto-draw').is(':checked')) {
        render_text();
        //check_autosize();
      }

      // Save settings to field
      $('#edit-field-pov-settings-und-0-value').val(get_json_settings_string());

    }

    function pov_load(n){
      set_message('Loading pov pattern');

      $.ajax({
        type: "GET",
        url: "/pov/" + n + ".json",
        dataType: 'json',
        success: function(json){
          if (json.status !='error'){
            $('#edit-title, #edit-field-pov-author-und-0-value, #edit-field-pov-author-site-und-0-url').val('');

            $('#edit-field-pov-data-und-0-value').val(json.data);
            apply_json_settings(json.settings);
            binary_load();
          }

          clear_message();
        },
        error: function(jqXHR, textStatus, errorThrown){
          alert('Loading failed');
          clear_message();
        }
      });
    }

    function set_message(msg){
      $('h3', $('#pov-loader').fadeIn('slow')).text(msg + '...');
    }

    function clear_message(){
      $('#pov-loader').fadeOut('slow');
    }

    function refresh_view(){
      set_message('Refreshing list');
      $.ajax({
        type: "GET",
        url: "/pov",
        data: {r: 'view'},
        dataType: 'json',
        success: function(json){
          if (json.status != 'error') {
            $('#view-data').empty();
            $('#view-data').append(json.ahah);

            Drupal.behaviors.fivestar.attach('#view-data');
            $('ul.pov-tabs li.active a').click();
          }
          clear_message();
        },
        error: function(jqXHR, textStatus, errorThrown){
          alert('Refreshing Failed');
          clear_message();
        }
      });
    }

    function render_text(draw_mode){
     if (!supports_canvas()) return;

      if (draw_mode == 'clear' || draw_mode == undefined){
        $('div.col .led').addClass('led_off').removeClass('meld_left meld_right');
      }else if(draw_mode == 'add'){

      }

      $('div.col').each(function(colindex){
        $('.led', this).each(function(rowindex){
          if (ctx.getImageData(colindex*4, rowindex * 4, 1, 1).data[1] > 128){
            $(this).toggleClass('led_off', false);
          }
          check_meld($(this));
        });
      })
    }

    function check_meld($led){
      var row = $led.attr('row');
      var off = $led.is('.led_off');
      var $prev = $led.parent().prev().children('.row_'+row);
      var $next = $led.parent().next().children('.row_'+row);

      //console.log(row, off, $prev, $next);

      if ($prev.length && !$prev.is('.led_off')){
        if (off){
          $prev.removeClass('meld_right');
        }else{
          $prev.addClass('meld_right');
        }
      }

      if (!off){
        if ($prev.length && !$prev.is('.led_off')){
          $led.addClass('meld_left');
        }
        if ($next.length && !$next.is('.led_off')){
          $led.addClass('meld_right');
        }
      }else{
        $led.removeClass('meld_left meld_right');
      }

      if ($next.length && !$next.is('.led_off')){
        if (off){
          $next.removeClass('meld_left');
        }else{
          $next.addClass('meld_left');
        }
      }

    }

    function get_json_settings_string(){
      return JSON.stringify({
        width: $('#draw-width').val(),
        text:  $('#txt-input').val(),
        font_size: $('#txt-font-size').val(),
        font: $('#txt-font').val(),
        left: $('#txt-left-offset').val(),
        top: $('#txt-top-offset').val(),
        invert: $('#txt-draw-invert').is(':checked')
      });
    }

    function apply_json_settings(j){
      $('#draw-width').val(j.width).change();
      $('#txt-input').val(j.text);
      $('#txt-font-size').val(j.font_size);
      $('#txt-font').val(j.font);
      $('#txt-left-offset').val(j.left);
      $('#txt-top-offset').val(j.top);
      $('#txt-draw-invert').attr('checked', j.invert);
      draw_text();
    }



    function led_binding_target(e){
      var dotoggle = false;

      //SHIFT is force on
      if (e.shiftKey && e.type == 'mouseover'){
        $(this).removeClass('led_off');
        check_meld($(this));
      }

      // ALT is force off
      if (e.altKey && e.type == 'mouseover'){
        $(this).addClass('led_off');
        check_meld($(this));
      }

      // CTRL is toggle
      if (e.ctrlKey && e.type == 'mouseover'){
        dotoggle=true;
      }

      if (mouse_down != null && e.type == 'mouseover'){
        $(this).toggleClass('led_off', mouse_down);
        check_meld($(this));
      }

      if (e.type == 'click'){
        e.preventDefault ? e.preventDefault() : e.returnValue = false
        /*if (no_mouse){
          dotoggle = true;
        }*/
      }

      if (e.type == 'mousedown' && mouse_down == null){
        mouse_down = !$(this).is('.led_off');
        e.preventDefault ? e.preventDefault() : e.returnValue = false
        dotoggle = true;
      }

      if (dotoggle) {
        $(this).toggleClass('led_off');
        check_meld($(this));
        // Turn off Auto Render if the user draws by hand
        $('#txt-auto-draw').attr('checked', false).change();
      }
    }

    /**
     * Auto-size the LED/Canvas width (if enabled).
     */
    function check_autosize() {
      if ($('#draw-autosize').is(':checked')) {
        var $cols = $('#pov .col');
        for(var i = $cols.length-1; i >= 25; i--) {
          // Last line, add one more if it has any in it.
          if (i == $cols.length-1 && i != $('#draw-width').attr('max')) {
            if ($($cols[i]).find('a:not(.led_off)').length) {
              $('#draw-width').val(parseInt($('#draw-width').val()) + 1).change();
            }
          } else {
            // Below last line down, look for empty rows until the first non-empty row
            if ($($cols[i]).find('a.led_off').length == 8) {
              $('#draw-width').val(parseInt($('#draw-width').val()) - 1).change();
            } else {
              break;
            }
          }
        }

      }
    }

    function supports_canvas() {
      return !!document.createElement('canvas').getContext;
    }

  });
})(jQuery);
;
/**
 * @file
 *
 * Fivestar JavaScript behaviors integration.
 */

/**
 * Create a degradeable star rating interface out of a simple form structure.
 *
 * Originally based on the Star Rating jQuery plugin by Wil Stuckey:
 * http://sandbox.wilstuckey.com/jquery-ratings/
 */
(function($){ // Create local scope.

Drupal.behaviors.fivestar = {
  attach: function (context) {
    $(context).find('div.fivestar-form-item').once('fivestar', function() {
      var $this = $(this);
      var $container = $('<div class="fivestar-widget clearfix"></div>');
      var $select = $('select', $this);

      // Setup the cancel button
      var $cancel = $('option[value="0"]', $this);
      if ($cancel.length) {
        $('<div class="cancel"><a href="#0" title="' + $cancel.text() + '">' + $cancel.text() + '</a></div>')
          .appendTo($container);
      }

      // Setup the rating buttons
      var $options = $('option', $this).not('[value="-"], [value="0"]');
      var index = -1;
      $options.each(function(i, element) {
        var classes = 'star-' + (i+1);
        classes += (i + 1) % 2 == 0 ? ' even' : ' odd';
        classes += i == 0 ? ' star-first' : '';
        classes += i + 1 == $options.length ? ' star-last' : '';
        $('<div class="star"><a href="#' + element.value + '" title="' + element.text + '">' + element.text + '</a></div>')
          .addClass(classes)
          .appendTo($container);
        if (element.value == $select.val()) {
          index = i + 1;
        }
      });

      if (index != -1) {
        $container.find('.star').slice(0, index).addClass('on');
      }
      $container.addClass('fivestar-widget-' + ($options.length));
      $container.find('a')
        .bind('click', $this, Drupal.behaviors.fivestar.rate)
        .bind('mouseover', $this, Drupal.behaviors.fivestar.hover);

      $container.bind('mouseover mouseout', $this, Drupal.behaviors.fivestar.hover);

      // Attach the new widget and hide the existing widget.
      $select.after($container).css('display', 'none');

      // Allow other modules to modify the widget.
      Drupal.attachBehaviors($this);
    });
  },
  rate: function(event) {
    var $this = $(this);
    var $widget = event.data;
    var value = this.hash.replace('#', '');
    $('select', $widget).val(value).change();
    var $this_star = (value == 0) ? $this.parent().parent().find('.star') : $this.closest('.star');
    $this_star.prevAll('.star').andSelf().addClass('on');
    $this_star.nextAll('.star').removeClass('on');
    if(value==0){
      $this_star.removeClass('on');
    }

    event.preventDefault();
  },
  hover: function(event) {
    var $this = $(this);
    var $widget = event.data;
    var $target = $(event.target);
    var $stars = $('.star', $this);

    if (event.type == 'mouseover') {
      var index = $stars.index($target.parent());
      $stars.each(function(i, element) {
        if (i <= index) {
          $(element).addClass('hover');
        } else {
          $(element).removeClass('hover');
        }
      });
    } else {
      $stars.removeClass('hover');
    }
  }
};

})(jQuery);
;
(function ($) {

/**
 * Toggle the visibility of a fieldset using smooth animations.
 */
Drupal.toggleFieldset = function (fieldset) {
  var $fieldset = $(fieldset);
  if ($fieldset.is('.collapsed')) {
    var $content = $('> .fieldset-wrapper', fieldset).hide();
    $fieldset
      .removeClass('collapsed')
      .trigger({ type: 'collapsed', value: false })
      .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Hide'));
    $content.slideDown({
      duration: 'fast',
      easing: 'linear',
      complete: function () {
        Drupal.collapseScrollIntoView(fieldset);
        fieldset.animating = false;
      },
      step: function () {
        // Scroll the fieldset into view.
        Drupal.collapseScrollIntoView(fieldset);
      }
    });
  }
  else {
    $fieldset.trigger({ type: 'collapsed', value: true });
    $('> .fieldset-wrapper', fieldset).slideUp('fast', function () {
      $fieldset
        .addClass('collapsed')
        .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Show'));
      fieldset.animating = false;
    });
  }
};

/**
 * Scroll a given fieldset into view as much as possible.
 */
Drupal.collapseScrollIntoView = function (node) {
  var h = document.documentElement.clientHeight || document.body.clientHeight || 0;
  var offset = document.documentElement.scrollTop || document.body.scrollTop || 0;
  var posY = $(node).offset().top;
  var fudge = 55;
  if (posY + node.offsetHeight + fudge > h + offset) {
    if (node.offsetHeight > h) {
      window.scrollTo(0, posY);
    }
    else {
      window.scrollTo(0, posY + node.offsetHeight - h + fudge);
    }
  }
};

Drupal.behaviors.collapse = {
  attach: function (context, settings) {
    $('fieldset.collapsible', context).once('collapse', function () {
      var $fieldset = $(this);
      // Expand fieldset if there are errors inside, or if it contains an
      // element that is targeted by the URI fragment identifier.
      var anchor = location.hash && location.hash != '#' ? ', ' + location.hash : '';
      if ($fieldset.find('.error' + anchor).length) {
        $fieldset.removeClass('collapsed');
      }

      var summary = $('<span class="summary"></span>');
      $fieldset.
        bind('summaryUpdated', function () {
          var text = $.trim($fieldset.drupalGetSummary());
          summary.html(text ? ' (' + text + ')' : '');
        })
        .trigger('summaryUpdated');

      // Turn the legend into a clickable link, but retain span.fieldset-legend
      // for CSS positioning.
      var $legend = $('> legend .fieldset-legend', this);

      $('<span class="fieldset-legend-prefix element-invisible"></span>')
        .append($fieldset.hasClass('collapsed') ? Drupal.t('Show') : Drupal.t('Hide'))
        .prependTo($legend)
        .after(' ');

      // .wrapInner() does not retain bound events.
      var $link = $('<a class="fieldset-title" href="#"></a>')
        .prepend($legend.contents())
        .appendTo($legend)
        .click(function () {
          var fieldset = $fieldset.get(0);
          // Don't animate multiple times.
          if (!fieldset.animating) {
            fieldset.animating = true;
            Drupal.toggleFieldset(fieldset);
          }
          return false;
        });

      $legend.append(summary);
    });
  }
};

})(jQuery);
;
(function ($) {

Drupal.behaviors.textarea = {
  attach: function (context, settings) {
    $('.form-textarea-wrapper.resizable', context).once('textarea', function () {
      var staticOffset = null;
      var textarea = $(this).addClass('resizable-textarea').find('textarea');
      var grippie = $('<div class="grippie"></div>').mousedown(startDrag);

      grippie.insertAfter(textarea);

      function startDrag(e) {
        staticOffset = textarea.height() - e.pageY;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
      }

      function performDrag(e) {
        textarea.height(Math.max(32, staticOffset + e.pageY) + 'px');
        return false;
      }

      function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
      }
    });
  }
};

})(jQuery);
;

(function($) {

/**
 * Drupal FieldGroup object.
 */
Drupal.FieldGroup = Drupal.FieldGroup || {};
Drupal.FieldGroup.Effects = Drupal.FieldGroup.Effects || {};
Drupal.FieldGroup.groupWithfocus = null;

Drupal.FieldGroup.setGroupWithfocus = function(element) {
  element.css({display: 'block'});
  Drupal.FieldGroup.groupWithfocus = element;
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processFieldset = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any fieldsets containing required fields
      $('fieldset.fieldset', context).once('fieldgroup-effects', function(i) {
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $('legend span.fieldset-legend', $(this)).eq(0).append(' ').append($('.form-required').eq(0).clone());
        }
        if ($('.error', $(this)).length) {
          $('legend span.fieldset-legend', $(this)).eq(0).addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processAccordion = {
  execute: function (context, settings, type) {
    $('div.field-group-accordion-wrapper', context).once('fieldgroup-effects', function () {
      var wrapper = $(this);

      // Get the index to set active.
      var active_index = false;
      wrapper.find('.accordion-item').each(function(i) {
        if ($(this).hasClass('field-group-accordion-active')) {
          active_index = i;
        }
      });

      wrapper.accordion({
        heightStyle: "content",
        active: active_index,
        collapsible: true,
        changestart: function(event, ui) {
          if ($(this).hasClass('effect-none')) {
            ui.options.animated = false;
          }
          else {
            ui.options.animated = 'slide';
          }
        }
      });

      if (type == 'form') {

        var $firstErrorItem = false;

        // Add required fields mark to any element containing required fields
        wrapper.find('div.field-group-accordion-item').each(function(i) {

          if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
            $('h3.ui-accordion-header a').eq(i).append(' ').append($('.form-required').eq(0).clone());
          }
          if ($('.error', $(this)).length) {
            // Save first error item, for focussing it.
            if (!$firstErrorItem) {
              $firstErrorItem = $(this).parent().accordion("activate" , i);
            }
            $('h3.ui-accordion-header').eq(i).addClass('error');
          }
        });

        // Save first error item, for focussing it.
        if (!$firstErrorItem) {
          $('.ui-accordion-content-active', $firstErrorItem).css({height: 'auto', width: 'auto', display: 'block'});
        }

      }
    });
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processHtabs = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any element containing required fields
      $('fieldset.horizontal-tabs-pane', context).once('fieldgroup-effects', function(i) {
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $(this).data('horizontalTab').link.find('strong:first').after($('.form-required').eq(0).clone()).after(' ');
        }
        if ($('.error', $(this)).length) {
          $(this).data('horizontalTab').link.parent().addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
          $(this).data('horizontalTab').focus();
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processTabs = {
  execute: function (context, settings, type) {
    if (type == 'form') {

      var errorFocussed = false;

      // Add required fields mark to any fieldsets containing required fields
      $('fieldset.vertical-tabs-pane', context).once('fieldgroup-effects', function(i) {
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $(this).data('verticalTab').link.find('strong:first').after($('.form-required').eq(0).clone()).after(' ');
        }
        if ($('.error', $(this)).length) {
          $(this).data('verticalTab').link.parent().addClass('error');
          // Focus the first tab with error.
          if (!errorFocussed) {
            Drupal.FieldGroup.setGroupWithfocus($(this));
            $(this).data('verticalTab').focus();
            errorFocussed = true;
          }
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 *
 * TODO clean this up meaning check if this is really
 *      necessary.
 */
Drupal.FieldGroup.Effects.processDiv = {
  execute: function (context, settings, type) {

    $('div.collapsible', context).once('fieldgroup-effects', function() {
      var $wrapper = $(this);

      // Turn the legend into a clickable link, but retain span.field-group-format-toggler
      // for CSS positioning.

      var $toggler = $('span.field-group-format-toggler:first', $wrapper);
      var $link = $('<a class="field-group-format-title" href="#"></a>');
      $link.prepend($toggler.contents());

      // Add required field markers if needed
      if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
        $link.append(' ').append($('.form-required').eq(0).clone());
      }

      $link.appendTo($toggler);

      // .wrapInner() does not retain bound events.
      $link.click(function () {
        var wrapper = $wrapper.get(0);
        // Don't animate multiple times.
        if (!wrapper.animating) {
          wrapper.animating = true;
          var speed = $wrapper.hasClass('speed-fast') ? 300 : 1000;
          if ($wrapper.hasClass('effect-none') && $wrapper.hasClass('speed-none')) {
            $('> .field-group-format-wrapper', wrapper).toggle();
          }
          else if ($wrapper.hasClass('effect-blind')) {
            $('> .field-group-format-wrapper', wrapper).toggle('blind', {}, speed);
          }
          else {
            $('> .field-group-format-wrapper', wrapper).toggle(speed);
          }
          wrapper.animating = false;
        }
        $wrapper.toggleClass('collapsed');
        return false;
      });

    });
  }
};

/**
 * Behaviors.
 */
Drupal.behaviors.fieldGroup = {
  attach: function (context, settings) {
    settings.field_group = settings.field_group || Drupal.settings.field_group;
    if (settings.field_group == undefined) {
      return;
    }

    // Execute all of them.
    $.each(Drupal.FieldGroup.Effects, function (func) {
      // We check for a wrapper function in Drupal.field_group as
      // alternative for dynamic string function calls.
      var type = func.toLowerCase().replace("process", "");
      if (settings.field_group[type] != undefined && $.isFunction(this.execute)) {
        this.execute(context, settings, settings.field_group[type]);
      }
    });

    // Fixes css for fieldgroups under vertical tabs.
    $('.fieldset-wrapper .fieldset > legend').css({display: 'block'});
    $('.vertical-tabs fieldset.fieldset').addClass('default-fallback');

    // Add a new ID to each fieldset.
    $('.group-wrapper .horizontal-tabs-panes > fieldset', context).once('group-wrapper-panes-processed', function() {
      // Tats bad, but we have to keep the actual id to prevent layouts to break.
      var fieldgroupID = 'field_group-' + $(this).attr('id');
      $(this).attr('id', fieldgroupID);
    });
    // Set the hash in url to remember last userselection.
    $('.group-wrapper ul li').once('group-wrapper-ul-processed', function() {
      var fieldGroupNavigationListIndex = $(this).index();
      $(this).children('a').click(function() {
        var fieldset = $('.group-wrapper fieldset').get(fieldGroupNavigationListIndex);
        // Grab the first id, holding the wanted hashurl.
        var hashUrl = $(fieldset).attr('id').replace(/^field_group-/, '').split(' ')[0];
        window.location.hash = hashUrl;
      });
    });

  }
};

})(jQuery);
;

;(function ($, undefined) {
	"use strict"; 

	var _audioclips = [];
	var next_clip = 0;

	var NUMCLIPS = 8;

	var _share_clicked_timer = null;
	var _original_text = $('#main').text();

	$(document).ready(function() {
		shareButtonConfiguration();
		configureAudio();
	});

	function configureAudio () {

		var choices = range(1, NUMCLIPS);

		for (var i = 0; i < 5; i++) {
			var random_index = random_integer(choices.length - 1);
			var clip_id = choices[random_index];
			choices.splice(random_index, 1);

			clip_id = clip_id.toFixed(0);

			var clip = new Audio("/audio/veryshare-" + clip_id + ".wav");
			clip.preload = true;

			$(clip).one('canplaythrough', (function (bound_clip) {
				return function () {
					_audioclips.push(bound_clip);
				};
			}(clip)));
		}

		$('#share').click(function () {
			if (_share_clicked_timer) {
				_share_clicked_timer = clearInterval(_share_clicked_timer);
				clickMeBlinkDisplay({ 
					initial_delay: 5000
				});
			}

			if (_audioclips.length === 0) {
				return;
			}

			var clipindex = next_clip % _audioclips.length;
			var selectedclip = _audioclips[clipindex];
			next_clip++; // must occur before play otherwise there's a race condition

			selectedclip.play();
		});
	}

	function shareButtonConfiguration () {
		buttonSize();
		$(window).on('resize', buttonSize);

		$('#share').alwaysCenterIn(window, {
			top: -50,
			left: -15
		});

		setTimeout(function () {
			$('#main').alwaysCenterIn('#share');
			$('#social').alwaysCenterIn('#share', { direction: 'horizontal' });
		}, 300);
		
		setTimeout(function () { 
			shakaroo($('#share')); 
		}, 500);

		setInterval(function() {
			shakaroo($('#share'));
		}, Math.round(Math.random() * (5000) + 4500));

		clickMeBlinkDisplay({ 
			initial_delay: 3000
		});
	}

	function buttonSize() {
		var min_size = 300;

		var minside = Math.min($(this).innerHeight(), $(this).innerWidth());

		var diameter = Math.max(minside * 0.5, min_size);

		$('#share').css('width', diameter).css('height', diameter);

		var fontsize = 3.5;

		fontsize *= diameter / min_size;

		$('#main').css('font-size', fontsize + "em");
	}

	/* clickMeBlinkDisplay
	 *
	 * Switches the text of the button to "Click Me!"
	 * or some such briefly.
	 *
	 * Optional:
	 *   initial_delay: msec delay before executing the first switch
	 *   repeat_delay: 
	 *
	 * Returns:
	 */
	function clickMeBlinkDisplay (args) {
		args = args || {};
		var initial_delay = args.initial_delay || 0;
		var repeat_delay = args.releat_delay || 7000;

		var switcher = function () {
			$('#main').text('Click Me!');
			setTimeout(function () {
				$('#main').text(_original_text);
			}, 400);
		};

		setTimeout(function () {
			switcher();
			_share_clicked_timer = setInterval(switcher, repeat_delay);
		}, initial_delay);
	}

	function shakaroo (element) {
		var bool = Math.round(Math.random()); // true/false

		var direction = bool 
			? 'up' 
			: 'left';
		
		var diameter = $('#share').width();
		
		$(element).effect('shake', {
			times: 3, 
			distance: diameter * .025,
			direction: direction,
		}, 25);
	}

	function random_integer (max) {
		return Math.round(Math.random() * max);
	}

	function range (from, to, incr) {
		var rng = [];

		incr = incr || 1;

		for (var i = from; i <= to; i += incr) {
			rng.push(i);
		}

		return rng;
	}

})(jQuery);

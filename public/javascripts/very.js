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
		$('#share').alwaysCenterIn(document, {
			top: -50
		});
		
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
			
		$(element).effect('shake', {
			times: 3, 
			distance: 3,
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

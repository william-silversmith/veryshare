;(function ($, undefined) {

	var _audioclips = [];
	var next_clip = 0;

	var NUMCLIPS = 8;

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
			top: -50,
		});
		
		setTimeout(function () { 
			shakaroo($('#share')); 
		}, 500);

		setInterval(function() {
			shakaroo($('#share'));
		}, Math.round(Math.random() * (5000) + 4500));

		$('#share').mouseenter(function(){
			$(this).fadeTo('fast', .5);
		});

		$('#share').mouseleave(function(){
			$(this).fadeTo('fast', 1);
		});

		$('#share').click(function(){
			$(this).fadeOut('fast');
		});
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

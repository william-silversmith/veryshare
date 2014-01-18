;(function ($, undefined) {

	var _audioclips = [];
	var next_clip = 0;

	var NUMCLIPS = 8;

	$(document).ready(function() {
		shareButtonConfiguration();
		configureAudio();
	});

	function configureAudio () {
		for (var i = 0; i < 5; i++) {
			var random = random_integer(NUMCLIPS) + 1;
			random = random.toFixed(0);

			var clip = new Audio("/audio/veryshare-" + random + ".wav");
			clip.preload = true;

			clip.addEventListener('canplay', (function (bound_clip) {
				return function () {
					_audioclips.push(bound_clip);
				};
			})(clip));
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
		return Math.round(Math.random() * 10000) % max;
	}
})(jQuery);

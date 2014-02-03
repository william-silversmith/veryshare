/* blot.js
 * 
 * Cartoon blot in and blot out animations.
 *
 * Authors: William Silversmith & Alex Norton
 * Date: February 2014
 */

;(function ($, undefined) {

	$.blot = $.blot || {};
	$.blot.defaults = {
		duration: 1500, // msec
		easing: "easeInOutCubic",
	};

	/* blotIn
	 *
	 * Old school style collapsing circle of color
	 * that hides everything in the scene. Think 
	 * looney toons.
	 *
	 * Optional:
	 *   duration: in msec
	 *   easing
	 *   complete: Final callback
	 *
	 * Returns: this
	 */
	$.blotIn = function (args) {
		args = args || {};

		var blot = $('<div>').addClass('blot-in');

		var radius = compute_radius();

		blot.css('width', radius).css('height', radius);

		blot.centerIn(window);

		$('body').append(blot);

		var duration = args.duration || $.blot.defaults.duration; // msec
		var complete = args.complete || function () {};
		var easing = args.easing || $.blot.defaults.easing;

		blot.animate({
			borderWidth: radius / 2 + 1,
		}, duration, easing, complete);

		return this;
	};

	/* blotIn.off
	 *
	 * Animate the removal of the inward blot.
	 *
	 * Optional: Same as blotIn
	 *
	 * Returns: this
	 */
	$.blotIn.off = function (args) {
		args = args || {};

		var radius = compute_radius();

		var duration = args.duration || $.blot.defaults.duration; // msec
		var complete = args.complete || function () {};
		var easing = args.easing || $.blot.defaults.easing;

		$('.blot-in').animate({
			borderWidth: 0,
		}, duration, easing, complete);

		return this;
	};

	/* blotOut
	 *
	 * Blot out the screen widening from a central point.
	 *
	 * Optional: Same as blotIn
	 *
	 * Returns: this
	 */
	$.blotOut = function (args) {
		args = args || {};

		var blot = $('<div>').addClass('blot-out');

		var radius = compute_radius();

		blot.css('width', 1).css('height', 1);

		blot.centerIn(window);

		$('body').append(blot);

		var duration = args.duration || $.blot.defaults.duration; // msec
		var complete = args.complete || function () {};
		var easing = args.easing || $.blot.defaults.easing;

		blot.animate({
			width: radius + 1,
			height: radius + 1,
				
		}, {
			duration: duration,
			easing: easing,
			complete: complete,
			step: function () {
				blot.centerIn(window);
			},
		});

		return this;
	};


	/* blotOut.off
	 *
	 * Animate the removal of the blot.
	 *
	 * Optional: Same as blotIn
	 *
	 * Returns: this
	 */
	$.blotOut.off = function (args) {
		args = args || {};

		var radius = compute_radius();

		var duration = args.duration || $.blot.defaults.duration; // msec
		var complete = args.complete || function () {};
		var easing = args.easing || $.blot.defaults.easing;

		var blot = $('.blot-out');

		blot.animate({
			width: 0,
			height: 0,
				
		}, {
			duration: duration,
			easing: easing,
			complete: complete,
			step: function () {
				blot.centerIn(window);
			},
		});

		return this;
	};

	/* compute_radius
	 *
	 * Use pythagorean theorem to find radius of circle that circumscribes
	 * the screen. Fucking SATs man.
	 *
	 * Required: None
	 *
	 * Returns: float radius of said circle
	 */
	function compute_radius () {
		var window_w = $(window).innerWidth();
		var window_h = $(window).innerHeight();

		return Math.sqrt(Math.pow(window_w, 2) + Math.pow(window_h, 2));
	}

})(jQuery);
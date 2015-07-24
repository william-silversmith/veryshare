/* blot.js
 * 
 * Cartoon blot in and blot out animations.
 *
 * Dependencies: jQuery and centerIn.js
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
	$.blotIn = function (args, complete) {
		args = args || {};

		if (typeof(args) === 'function') {
			complete = args;
			args = {};
		}

		var blot = $('<div>').addClass('blot-in');

		var radius = compute_radius();

		blot.css('width', radius).css('height', radius);

		blot.centerIn(window);

		$('body').append(blot);

		var duration = args.duration || $.blot.defaults.duration; // msec
		complete = complete || args.complete || function () {};
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
	 *	remove: Auotmatically remove at the end of the animation
	 *
	 * Returns: this
	 */
	$.blotIn.off = function (args, complete) {
		args = args || {};

		if (typeof(args) === 'function') {
			complete = args;
			args = {};
		}

		var blot = $('.blot-in');

		var radius = compute_radius();

		var duration = args.duration || $.blot.defaults.duration; // msec
		complete = complete || args.complete || function () {};
		var easing = args.easing || $.blot.defaults.easing;

		blot.animate({
			borderWidth: 0,
		}, duration, easing, function () {
			blot.remove();
			complete();
		});

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
	$.blotOut = function (args, complete) {
		args = args || {};

		if (typeof(args) === 'function') {
			complete = args;
			args = {};
		}

		var blot = $('<div>').addClass('blot-out');

		var radius = compute_radius();

		blot.css('width', 1).css('height', 1);

		blot.centerIn(window);

		$('body').append(blot);

		var duration = args.duration || $.blot.defaults.duration; // msec
		complete = complete || args.complete || function () {};
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
	$.blotOut.off = function (args, complete) {
		args = args || {};

		if (typeof(args) === 'function') {
			complete = args;
			args = {};
		}

		var blot = $('.blot-out');

		var radius = compute_radius();

		var duration = args.duration || $.blot.defaults.duration; // msec
		complete = complete || args.complete || function () {};
		var easing = args.easing || $.blot.defaults.easing;

		blot.animate({
			width: 0,
			height: 0,
				
		}, {
			duration: duration,
			easing: easing,
			complete: function () {
				blot.remove();
				complete();
			},
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

})(jQuery);;/* centerIn.js
 *
 * jQuery plugin that allows you to center an element within an element.
 *
 * e.g. 
 *
 * $(element).centerIn(); // centers horizontally and vertically in parent
 * $(element).centerIn(window); // centers horizontally and vertically in window
 * $(element).centerIn(window, { direction: 'vertical' ); // centers vertically in window
 * $(element).centerIn(window, { top: "-20%" }); // centers vertically in window offset upwards by 20%
 * $(element).alwaysCenterIn(window); // deals with resize events
 *
 * Author: William Silversmith
 * Affiliation: Seung Lab, Brain and Cognitive Sciences Dept., MIT
 * Date: August 2013 - February 2014
 */
;(function($, undefined) {

	/* centerIn
	 *
	 * Centers the element with respect to
	 * the first element of the given selector
	 * both horizontally and vertically.
	 *
	 * Required:
	 *   [0] selector: The element to center within
	 *   [1] options or callback
	 *   [2] callback (if [1] is options): Mostly useful for alwaysCenterIn
	 *
	 * Options:
	 *	 direction: 'horizontal', 'vertical', or 'both' (default)
	 *	 top: Additional offset in px
	 *	 left: Additional offset in px
	 *
	 * Returns: void
	 */
	$.fn.centerIn = function (selector, options, callback) {
		var elements = this;
		options = options || {};

		if (typeof(options) === 'function') {
			callback = options;
			options = {};
		}

		var direction = options.direction || $.fn.centerIn.defaults.direction;
		var extraleft = options.left || 0;
		var extratop = options.top || 0;

		if (selector) {
			selector = $(selector).first();
		}
		else {
			selector = elements.first().parent();
		}

		try {
			if (!selector.css('position') || selector.css('position') === 'static') {
				selector.css('position', 'relative'); 
			}
		}
		catch (e) {
			// selector was something like window, document, html, or body
			// which doesn't have a position attribute
		}

		var horizontal = function (element) {
			var left = Math.round((selector.innerWidth() - element.outerWidth(false)) / 2);
			left += translateDisplacement(selector, extraleft, 'width');
			element.css('left', left + "px");
		};

		var vertical = function (element) {
			var top = Math.round((selector.innerHeight() - element.outerHeight(false)) / 2);
			top += translateDisplacement(selector, extratop, 'height');
			element.css('top', top + "px");
		};

		var centerfn = constructCenterFn(horizontal, vertical, callback, direction);

		elements.each(function (index, element) {
			element = $(element);

			if (element.css("position") !== 'fixed') {
				element.css("position", 'absolute');
			}
			centerfn(element);
		});

		return this;
	};

	/* alwaysCenterIn
	 * 
	 * Maintains centering even on window resize.
	 */
	$.fn.alwaysCenterIn = function () {
		var args = arguments || []; 
		var selector = $(this);

		selector.centerIn.apply(selector, args);

		var evt = 'resize.centerIn';
        if (selector.attr('id')) {
            evt += '.' + selector.attr('id');
        }

        $(window).on(evt, function () {
			selector.centerIn.apply(selector, args);
		});

		return this;
	 };

	/* Defaults */

	$.fn.centerIn.defaults = {
		direction: 'both'
	};

    /* translateDisplacement
     *
     * Translates dimensionless units, pixel measures, and percent
     * measures into px.
     *
     * Required: 
     *   [0] selector: Container, relevant for percent measures
     *   [1] value: Amount to displace. e.g. 5, "5px", or "5%"
     *   [2] direction: 'width' or 'height'
     * 
     * Returns: px
     */
    function translateDisplacement(selector, value, direction) {
        if (typeof(value) === 'number') {
            return value;
        }
        else if (/px$/i.test(value)) {
            return parseFloat(value.replace('px', ''), 10);
        }
        else if (/%$/.test(value)) {
            var total = (direction === 'width')
                ? $(selector).innerWidth()
                : $(selector).innerHeight();

            value = parseFloat(value.replace('%', ''), 10);
            value /= 100;

            return value * total;
        }

        return parseFloat(value, 10);
    }

    /* constructCenterFn
     *
     * Constructs an appropriate centering function
     * that includes vertical, horizontal, and callback
     * functions as applicable.
     *
     * Returns: fn
     */
	function constructCenterFn(horizontal, vertical, callback, direction) {
        var fns = []

		if (!direction || direction === 'both') {
			fns.push(vertical);
            fns.push(horizontal);
		}
		else if (direction === 'horizontal') {
            fns.push(horizontal);
		}
		else if (direction === 'vertical') {
            fns.push(vertical);
		}

        if (callback) {
            fns.push(callback);
        }

		return compose(fns);
	}

	/* compose
	 *
	 * Compose N functions into a single function call.
	 *
	 * Required: 
	 *   [0-n] functions or arrays of functions
	 * 
	 * Returns: function
	 */
	function compose () {
		var fns = flatten(arguments);

		return function () {
			for (var i = 0; i < fns.length; i++) {
				fns[i].apply(this, arguments);
			}
		};
	}

	/* flatten
	 *
	 * Take an array that potentially contains other arrays 
	 * and return them as a single array.
	 *
	 * e.g. flatten([1, 2, [3, [4]], 5]) => [1,2,3,4,5]
	 *
	 * Required: 
	 *   [0] array
	 * 
	 * Returns: array
	 */
	function flatten (array) {
		array = array || [];

		var flat = [];

		var len = array.length;
		for (var i = 0; i < len; i++) {
			var item = array[i];

			if (typeof(item) === 'object' && Array.isArray(item)) {
				flat = flat.concat(flatten(item));
			}
			else {
				flat.push(item);
			}
		} 

		return flat;
	}
})(jQuery);

/* The MIT License (MIT)

Copyright (c) 2014 Seung Lab, MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/;/* ColorUtils.js
 *
 * A place to put generic utility functions like
 * converting between color representations.
 *
 * Authors: Mark Richardson & William Silversmith
 * Affiliation: Seung Lab, MIT 
 * Date: June, December 2013
 */

var ColorUtils = {};

(function (undefined) {
	"use strict";

	/* average
	 *
	 * Generate a color half-way betwen two input colors.
	 * Notably, this algorithm should work for rgb, hsl, and hsv.
	 *
	 * Required: 
	 *   [0] color1
	 *   [1] color2
	 *
	 * Optional: 
	 *   [2] blending: [0, 1] weighted average from color1 to color2   
	 *       Defaults to 0.5
	 *
	 * Returns: color
	 */
	ColorUtils.average = function (color1, color2, blending) {
		blending = (blending === undefined) ? 0.5 : blending;
		blending = cutoff(blending, 0, 1);

		var color = {};
		for (var key in color1) {
			if (!color1.hasOwnProperty(key)) { continue; }

			color[key] = ((1 - blending) * color1[key]) + (blending * color2[key]);
		}

		return color;
	};

	/* rotate
	 *
	 * Take an RGB color and rotate it like you could with
	 * an HSV color using the H argument. Also accepts HSV
	 * colors for the sake of a consistent interface if need be.
	 *
	 * Required: 
	 *   [0] degrees
	 *   [1] color: { r, g, b, a } or { h, s, v, a }
	 * 
	 * Returns: { r, g, b, a }
	 */
	ColorUtils.rotate = function (degrees, color) { 
		var alpha = color.a || 1;

		if (color.r !== undefined) {
			color = ColorUtils.RGBtoHSV(color.r, color.g, color.b);
		}

		color.h += degrees;

		if (color.h < 0) {
			color.h = 360 - (Math.abs(color.h) % 360);
		}

		color = ColorUtils.HSVtoRGB(color.h, color.s, color.v);
		color.a = alpha;

		return color;
	};

	/* brighten
	 *
	 * Given an RGB value, return a color
	 * brightened by the given percentage.
	 *
	 * Required:
	 *	percent: [-100, 100]
	 *  color: {r,g,b}
	 *
	 * Returns: {r,g,b} brightened
	 */
	ColorUtils.brighten = function (args) {
		args = args || {};

		var hsv = ColorUtils.toHSV(args.color);

		var delta = Math.round((args.percent / 100) * 255);
		var value = hsv.v + delta;

		hsv.v = cutoff(value, 0, 255);

		return ColorUtils.HSVtoRGB(hsv.h, hsv.s, hsv.v);
	};

	/* lighten
	 *
	 * Given an RGB value, return a color
	 * lightened by the given percentage.
	 *
	 * Required:
	 *	percent: [-100, 100]
	 *  color: {r,g,b}
	 *
	 * Returns: {r,g,b} lightened
	 */
	ColorUtils.lighten = function (args) {
		var color = args.color;
		var hsl = ColorUtils.RGBtoHSL(color.r, color.g, color.b);
		hsl.l += cutoff(args.percent / 100, 0, 1);

		return ColorUtils.HSLtoRGB(hsl.h, hsl.s, hsl.l);		
	};

	/* interpolate
	 *
	 * Performs a linear interpolation in
	 * RGB color space.
	 *
	 * Required:
	 *   start: {r,g,b}
	 *   end: {r,g,b}
	 *   percent: [0, 100]
	 *
	 * Returns: {r,g,b}
	 */
	ColorUtils.interpolate = function (args) {
		args = args || {};

		var percent = args.percent || 0;
		percent = cutoff(percent / 100, 0, 1);

		var change = function (dimension) {
			var val = args.start[dimension];
			var delta = args.end[dimension] - args.start[dimension];

			return Math.round(cutoff((val + (delta * percent)), 0, 255));
		};

		return {
			r: change('r'),
			g: change('g'),
			b: change('b'),
		};
	};

	/* toHSL
	 *
	 * Converts most color specifications to HSL.
	 *
	 * Required: 
	 *   [0] color
	 * 
	 * Returns: {h,s,l}
	 */
	ColorUtils.toHSL = function (color) {
		if (typeof(color) === 'string') {
			color = ColorUtils.hexToRGB(color);
			return ColorUtils.RGBtoHSL(color.r, color.g, color.b);
		}
		else if (color.r !== undefined) {
			return ColorUtils.RGBtoHSL(color.r, color.g, color.b);
		}
		else if (color.h !== undefined && color.l !== undefined) {
			return color;
		}
		else if (color.h !== undefined && color.v !== undefined) {
			color = ColorUtils.HSVtoRGB(color.h, color.s, color.l);
			return ColorUtils.RGBtoHSL(color.r, color.g, color.b);
		}
		else {
			throw color + " is not in a known form convertable to HSL.";
		}
	};

	/* toHSV
	 *
	 * Given an arbitrary color format
	 * e.g. hex string, {r,g,b}, {h,s,v}
	 * returns in {h,s,v} format.
	 *
	 * Required:
	 *   [0] color
	 *
	 * Returns: {h,s,v}
	 */
	ColorUtils.toHSV = function (color) {
		if (typeof(color) === 'string') {
			color = ColorUtils.hexToRGB(color);
			return ColorUtils.RGBtoHSV(color.r, color.g, color.b);
		}
		else if (color.r !== undefined) {
			return ColorUtils.RGBtoHSV(color.r, color.g, color.b);
		}
		else if (color.h !== undefined && color.v !== undefined) {
			return color;
		}
		else if (color.h !== undefined && color.l !== undefined) {
			color = ColorUtils.HSLtoRGB(color.h, color.s, color.l);
			return ColorUtils.RGBtoHSV(color.r, color.g, color.b);
		}
		else {
			throw color + " is not in a known form convertable to HSV.";
		}
	};

	/* RGBtoHSL
	 *
	 * Converts from an RGB color cube to 
	 * an HSL cylinderical representation.
	 *
	 * Required:
	 *   [0] r
	 *   [1] g
	 *   [2] b
	 *   
	 * 
	 * Returns: {h,s,l} h in [0, 360), s in [0,1], l in [0, 1] 
	 */
	ColorUtils.RGBtoHSL = function (r, g, b) {
		var hsv = ColorUtils.RGBtoHSV(r, g, b);

		var hsl = { 
			h: hsv.h,
			s: undefined, // it's different than in hsv
			l: undefined,
		};

		var min = Math.min(r, g, b); // M
		var max = Math.max(r, g, b); // m
		hsl.l = (min + max) / 2 / 255;
		hsl.s = (max - min) / 255 / (1 - Math.abs(2 * hsl.l - 1));

		return hsl;
	};

	/* HSLtoRGB
	 *
	 * Converts Hue, Saturation, Lightness (HSL) cylindrical
	 * RGB representation into cartesian RGB.
	 *
	 * Algorithm taken from: 
	 * http://en.wikipedia.org/wiki/HSL_and_HSV (Accessed Dec. 8, 2013)
	 *
	 * Required: 
	 *   [0] h: degrees 
	 *   [1] s: [0, 1]
	 *   [2] l: [0, 255]
	 * 
	 * Returns: {r,g,b}
	 */
	ColorUtils.HSLtoRGB = function (h, s, l) {
		h = h % 360;
		h = h >= 0 ? h : h + 360;
		s = cutoff(s, 0, 1);
		l = cutoff(l, 0, 1);

		var chroma = (1 - Math.abs(2 * l - 1)) * s;
		var hprime = h / 60;
		var x = chroma * (1 - Math.abs((hprime % 2) - 1));

		var rgb = { r: 0, g: 0, b: 0 };
		if (hprime === undefined) {
			return rgb;
		}
		else if (0 <= hprime  && hprime < 1) {
			rgb.r = chroma;
			rgb.g = x;
		}
		else if (1 <= hprime && hprime < 2) {
			rgb.r = x;
			rgb.g = chroma;
		}
		else if (2 <= hprime && hprime < 3) {
			rgb.g = chroma;
			rgb.b = x;
		}
		else if (3 <= hprime && hprime < 4) {
			rgb.g = x;
			rgb.b = chroma;
		}
		else if (4 <= hprime && hprime < 5) {
			rgb.r = x;
			rgb.b = chroma;
		}
		else {
			rgb.r = chroma;
			rgb.b = x;
		}

		var m = l - (chroma / 2);
		for (var component in rgb) {
			if (!rgb.hasOwnProperty(component)) { return; }

			rgb[component] = Math.round(255 * (rgb[component] + m));
			rgb[component] = cutoff(rgb[component], 0, 255);
		}

		return rgb;
	};

	/* RGBtoHSV
	 *
	 * Converts RGB to HSV (Hue, Saturation, Value). 
	 * Algorithm from: http://en.wikipedia.org/wiki/HSL_and_HSV
	 *
	 * Required:
	 *	[0-2] r, g, b
	 *
	 * Returns: { h, s, v }
	 */
	ColorUtils.RGBtoHSV = function(r, g, b) {
		var min, max, delta, h, s, v;

		min = Math.min(r, g, b); // M
		max = Math.max(r, g, b); // m

		v = max;
		delta = max - min; // C (chroma)

		if (max !== 0) {
			s = delta / max;

			// Hexagonal mapping
			if (delta === 0) {
				h = 0; // h doesn't matter in this case (fully desaturated) so pick something arbitrary
			}
			else if (r === max) {
				h = (g - b) / delta;
			} 
			else if (g === max) {
				h = 2 + (b - r) / delta;
			} 
			else {
				h = 4 + (r - g) / delta;
			}

			h *= 60;
			h = h % 360;
			h = (h < 0) ? h + 360 : h;
		} 
		else {
			s = 0;
			h = undefined;
		}

		return { h: h, s: s, v: v };
	};

	/* HSVtoRGB
	 *
	 * Converts HSV (Hue, Saturation, Value) to RGB
	 *
	 * Required:
	 *	[0-2] h, s, v
	 *
	 * Returns: { r, g, b }
	 */
	ColorUtils.HSVtoRGB = function (h, s, v) {
		var c, hPrime, x, rgb1, m;

		c = v * s;
		h = h % 360;
		hPrime = h / 60;
		x = c * (1 - Math.abs(hPrime % 2 - 1));
		rgb1 = [0, 0, 0];

		switch (Math.floor(hPrime)) {
			case 0:
				rgb1 = [c, x, 0];
				break;
			case 1:
				rgb1 = [x, c, 0];
				break;
			case 2:
				rgb1 = [0, c, x];
				break;
			case 3:
				rgb1 = [0, x, c];
				break;
			case 4:
				rgb1 = [x, 0, c];
				break;
			case 5:
				rgb1 = [c, 0, x];
				break;
			default:
				break;
		}
		m = v - c;

		return { r: rgb1[0] + m, g: rgb1[1] + m, b: rgb1[2] + m };
	};

	/* hexToRGB
	 *
	 * Given an HTML hex string like #B5DFEB,
	 * convert to an RGB representation.
	 *
	 * Required:
	 *  [0] hexstring
	 *
	 * Returns: { r, g, b }
	 */
	ColorUtils.hexToRGB = function (hexstring) {
		hexstring = hexstring.replace(/^#/, ''); // e.g. #ffffff

		var rhex = hexstring.substr(0, 2);
		var ghex = hexstring.substr(2, 2);
		var bhex = hexstring.substr(4, 2);

		return {
			r: parseInt(rhex, 16),
			g: parseInt(ghex, 16),
			b: parseInt(bhex, 16)
		};
	};

	/* rgbToHex
	 *
	 * Takes {r,g,b} or {r,g,b,a} and returns
	 * a CSS style hex string (e.g. #FF93B3)
	 *
	 * Required: {r,g,b}
	 *
	 * Returns: "#FF93B3"
	 */
	ColorUtils.rgbToHex = function (rgb) {
		var hex = "#";

		function codegen (num) {
			var str = "";
			if (num <= 9) {
				str += "0";
			}

			str += Math.round(num).toString(16);
			
			return str;
		}

		hex += codegen(rgb.r);
		hex += codegen(rgb.g);
		hex += codegen(rgb.b);

		return hex;
	};

	/* parseRGBA
	 * 
	 * Parses 'rgba(2, 3, 4, 0.5)' and 'rgb(1, 3, 4)'.
	 * If the input is rgb rather than rgba, a will
	 * default to 1 in the output. 
	 *
	 * Required:
	 *  [0] spec: The color specification
	 *
	 * Returns: { r, g, b, a }
	 */
	ColorUtils.parseRGBA = function (spec) {
		spec = spec.replace(/\s+/g, '');
		var matches = spec.match(/^rgba?\((\d+),(\d+),(\d+),?(\d+)?\)$/);
		matches.splice(0, 1); // Remove the redundant first index

		return {
			r: matches[0],
			g: matches[1],
			b: matches[2],
			a: (matches[3] || 1)
		};
	};

	/* cutoff
	 *
	 * Bound a value between a minimum and maximum value.
	 *
	 * Required: 
	 *   [0] value: The number to evaluate
	 *   [1] min: The minimum possible value
	 *   [2] max: The maximum possible value
	 * 
	 * Returns: value if value in [min,max], min if less, max if more
	 */
	function cutoff(value, min, max) {
		return Math.max(Math.min(value, max), min);
	}

})();

/* The MIT License (MIT)

Copyright (c) 2014 Seung Lab, MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/;
/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 *
 * jQuery.browser.mobile will be true if the browser is a mobile device
 *
 **/
(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);


;(function ($, undefined) {
	"use strict"; 

	var _audioclips = [];
	var next_clip = 0;

	var NUMCLIPS = 15;

	var _sharecount = 0;

	var _reward_mode = {
		init: false,
		active: false,
		button_text: 'WOW!',
		titles: ["Such Reward!", "WOW", "? ? ? ? ? ?", "What's that?!", "Such Wonder!"],
		original_title: document.title,
	};

	var _flags = {
		blink: true,
		vibrate: true,
	};

	var _share_clicked_timer = null;
	var _original_text = $('#main').text();

	var _social_index = 0;
	var _social_networks = [
		{ name: 'Facebook', data: "facebook", url: 'https://www.facebook.com/sharer.php?u=#{VERYSHARE}&t=#{TITLE}&s=#{DESCRIPTION}', img: "facebook.png" },
		{ name: 'Twitter', data: "twitter", url: 'http://twitter.com/intent/tweet?source=sharethiscom&text=#{DESCRIPTION}&url=#{VERYSHARE}', img: "twitter.png" },
		
		// Need to think about Tumblr and Reddit
		{ name: 'Tumblr', data: "tumblr", url: 'http://www.tumblr.com/share?v=3&u=#{VERYSHARE}&t=#{TITLE}&s=#{DESCRIPTION}', img: "tumblr.png" },
		//{ name: 'Reddit', data: "reddit", url: 'https://www.facebook.com/sharer.php?u=#{VERYSHARE}&t=#{TITLE}&s=#{DESCRIPTION}', img: "reddit.png" },
		
		{ name: 'Pinterest', data: "pinterest", url: 'http://pinterest.com/pin/create/button/?url=#{VERYSHARE}&media=http://#{VERYSHARE}/#{MEDIA}&description=#{DESCRIPTION}', img: "pinterest.png" },
		{ name: 'Google Plus', data: "googleplus", url: 'https://plus.google.com/share?url=#{VERYSHARE}', img: "googleplus.png" },
		{ name: 'Email', data: "email", url: 'mailto:myfriends@example.com?subject=#{TITLE}&body=#{DESCRIPTION}', img: "email.png" },
	];

	var _standard_phrases = [
		'such WOW!', 'WOW!', 'wow', 'such share',
		'much viral', 'such amaze', 'very share',
		'such wonder!', 'such legit', 'many friend',
		'die squirrel', 'such inspire', 'much inspire',
		'such surprise', 'very excite', 'such experiment',
		'many happy', 'many clicks'	
	];

	$(document).ready(function() {
		shareButtonConfiguration();
		configureAudio();

		$('#youshared').alwaysCenterIn(window, {
			direction: 'horizontal',
		});

		if ($.browser.mobile) {
			document.body.setAttribute("orient", "profile");
		}
	});

	function configureAudio () {
		var choices = range(1, NUMCLIPS);

		for (var i = 0; i < 7; i++) {
			var random_index = random_integer(choices.length - 1);
			var clip_id = choices[random_index];
			choices.splice(random_index, 1);

			clip_id = clip_id.toFixed(0);

			var clip = new Audio("/audio/veryshare-" + clip_id + ".ogg");
			clip.preload = true;

			// Fix for apple not preloading
			if ($.browser.iproduct) {
				_audioclips.push(clip);
			}
			else {
				$(clip).one('canplaythrough', (function (bound_clip) {
					return function () {
						_audioclips.push(bound_clip);
					};
				}(clip)));
			}
		}

		$('#share')
			.on('click', function () {
				playStupidSound();
				powerShare(rewardModeStepTwo);
				appearDogeWord(_standard_phrases);
			})
			.one('click', function () {
				_share_clicked_timer = clearInterval(_share_clicked_timer);
				_flags.blink = false;
				$('#main').fadeChangeText('GO FAST!');
			})
			.mousedown(function () {
				// Pulsate animation conflicts with activate/deactivate
				// animations on the same element
				if (!$.browser.mobile) {
					$(this).removeClass('pulsate');
				}
			});

		var realtimecounter = $('<div>')
			.text("0")
			.addClass('real-time-counter');

		$('body').append(realtimecounter);

		realtimecounter
			.fadeIn(200)
			.queue(function () {
				$(this).alwaysCenterIn(window, { direction: "horizontal" });
				$(this).dequeue();
			});
	}

	function rewardModeStepThree () {
		var img = $("<img>")
				.addClass('reward-1')
				.attr('src', DOGE_IMAGE_SRC);

		$('#youare').hide();

		$('#share')
			.removeClass('fadeToSun fadeToGreen green')
			.addClass('reward')
			.css('background-image', 'url(' + DOGE_IMAGE_SRC + ')')
			.off('click').on('click', function () {
				if (!$.browser.mobile) {
					$('#share').addClass('pulsate');
				}

				shareOnSelectedNetwork({
					title: "Many share. Such love.",
					description: "Such WOW! There's so much sharing going on at http://veryshare.us",
					media: "/images/veryshare.png",
				});
			})
			.centerIn();

		$('#main')
			.text(_original_text)
			.centerIn()
			.addClass('reward');

		$('#social').show();
		$('#next').show();
		$('.real-time-counter').hide();

		$.blotIn.off(function () {
			_flags.vibrate = true;
			_flags.blink = false;

			$('#share').removeClass('fadeToSun fadeToGreen green')

			$.post('/1.0/reward-seen');
		});

		var timestr = ' tiem(s)';

		$('#youshared')
			.alwaysCenterIn(window, { direction: 'horizontal' })
			.fadeIn(200, function () {
				$(this).centerIn(window, { direction: 'horizontal' });
			})
			.text("You powershared " + powersharecounter + timestr + "!")
			.click(function () {
				shareOnSelectedNetwork({
					title: "Wow!!! POWERSHARE.",
					description: "I POWERSHARED " + powersharecounter + timestr +  " on Very Share! Think you can beat me? http://veryshare.us",
					media: "/images/veryshare.png",
				}) 
			});

		$('#rewardtext')
			.html("It was me all along!<br>Thanks for sharing fellow shibe, it's for my health! <span class='heart'>&hearts;</span>")
			.alwaysCenterIn(window, { direction: 'horizontal' })
			.fadeIn(200, function () {
				$(this).centerIn(window, { direction: 'horizontal' })
			});

		$('#again')
			.alwaysCenterIn(window, { direction: 'horizontal' })
			.fadeIn(200, function () {
				$(this).centerIn(window, { direction: 'horizontal' })
			})
			.click(function () {
				location.reload();
			});

		setInterval(function () {
			appearDogeWord(DOGE_IMAGE_WORDS);
		}, 3000);
	}

	function rewardModeStepTwo() {
		$('#share')
			.addClass('green reward')
			.removeClass('fadeToRed fadeToGreen')
			.off('click');
		
		if (!$.browser.mobile) {
			$('#share').addClass('pulsate');
		}

		_flags.blink = false;
		_flags.vibrate = false;

		$('#main').fadeChangeText('So Share!');
				
		playStupidSound();
		$.blotIn(rewardModeStepThree);
	}

	var powermodetimer = null;
	var powermode = false;
	var powersharecounter = 0;

	function powerShare (fn) {
		if (powermodetimer) {
			powermodetimer = clearTimeout(powermodetimer);
		}

		powersharecounter++;

		var fontsize = 0.9 + (powersharecounter / 25);
		fontsize = cutoff(fontsize, 0.9, 2.5);

		var countercolor = ColorUtils.interpolate({
			start: ColorUtils.hexToRGB("#BF1600"),
			end: ColorUtils.hexToRGB("#00FFB8"),
			percent: (powersharecounter / 25 * 100),
		});

		$('.real-time-counter')
			.text(powersharecounter)
			.css('font-size', fontsize + "em")
			.css('color', ColorUtils.rgbToHex(countercolor))
			.centerIn(window, { direction: 'horizontal' });

		if (powersharecounter === 25
			&& !$.browser.mobile) {

			// This is to compute a circular orbit 
			// based on finding the relative center of the page from the
			// number

			var reorbit = function () {
				var cy = $(window).innerHeight() / 2;
				var dy = parseInt($('.real-time-counter').css('bottom').replace('px', ''), 10);
				var total = cy - dy - $('.real-time-counter').outerHeight(false);

				$('.real-time-counter')
					.css('-webkit-transform-origin', '50% -' + total + 'px')
					.css('transform-origin', '50% -' + total + 'px');
			};

			$('.real-time-counter').addClass('orbit');
			reorbit();
			$(window).on('resize', function () {
				reorbit();
			});	
		}

		if (!powermode) {
			$('#share')
				.removeClass('fadeToRed')
				.cssAnimation('fadeToGreen', 'green');
			powermode = true;
		}

		powermodetimer = setTimeout(function () {
			powermodetimer = null;
			powermode = false;

			$('#share')
				.removeClass('green fadeToRed')
				.css('border-color', '')
				.css('background-color', '');
			
			if (!$.browser.mobile) {
				$('#share').addClass('pulsate');
			}

			$.post('/1.0/power-share', { powershares: powersharecounter });

			if (fn) {
				fn();
			}
		}, 3000);
	}

	function shareOnSelectedNetwork (args) {
		args = args || {};

		var socialnetwork = _social_networks[_social_index];
		
		var url = socialnetwork.url.format_url({
			VERYSHARE: HOST,
			TITLE: args.title,
			DESCRIPTION: args.description,
			MEDIA: args.media,
		});

		var payload = {};
		payload[socialnetwork.data] = true;
		$.post('/1.0/shared', payload);

		// Too dangerous for prototype phase

		var win = window.open(url, '_blank');
		win.focus();
	}

	function advanceSelectedNetwork () {
		_social_index = (_social_index + 1) % _social_networks.length;
		var next_network = _social_networks[_social_index];

		$('#social img')
			.attr('src', '/images/' + next_network.img)
			.attr('title', next_network.name)
			.attr('alt', next_network.name);

		$('#social').cssAnimation('social-switch-network');
	}

	function playStupidSound () {
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
	}

	function shareButtonConfiguration () {
		
		$('#container').css('height', $(window).innerHeight());
		$(window).on('resize', function () {
			$('#container').css('height', $(window).innerHeight());
		});

		$('#share').alwaysCenterIn();

		$('#next').alwaysCenterIn(window, {
			direction: 'horizontal'
		});

		if (!$.browser.mobile) {
			$('#share').addClass('pulsate');
		}

		/* This complicated timing is necessary to ensure
		   that the button firstly: correctly centered on page load,
		   centered on page resize, and that the shake doesn't
		   perturb it too much after returning from another tab. */
		setTimeout(function () {
			$('#share')
				.centerIn()
				.fadeIn(1000, function () {
					$('#main').alwaysCenterIn();
				});

			$('#social').alwaysCenterIn('#share', { direction: 'horizontal' });
			$('#main').centerIn();
		}, 300);

		buttonSize();
		$(window).on('resize.buttonSize', buttonSize);
		
		setTimeout(function () { 
			shakaroo($('#share')); 
		}, 500);

		setInterval(function() {
			if (!($('#share').is(':hover'))
				&& _flags.vibrate) {

				shakaroo($('#share'));
			}
		}, Math.round((Math.random() * 5000) + 4500));

		$('#next')
			.mouseover(function () {
				$('#social').addClass('hover');
			})
			.mouseout(function () {
				$('#social').removeClass('hover');
			})
			.click(advanceSelectedNetwork);

		clickMeBlinkDisplay({ 
			initial_delay: 3000
		});		
	}

	function buttonSize() {
		var share_min_size = 200;

		var window_min_side = Math.min($(window).innerHeight(), $(window).innerWidth());
		var share_diameter = Math.max(window_min_side * 0.4, share_min_size);

		var bordersize = Math.max(share_diameter * 0.08, 18);

		$('#share')
			.css('width', share_diameter)
			.css('height', share_diameter)
			.css('border-width', bordersize + 'px');

		var fontsize = 2.5;
		fontsize *= share_diameter / share_min_size;

		$('#main').css('font-size', fontsize + "em");

		var social_min_size = 35;
		var social_diameter = Math.max(share_diameter * 0.175, social_min_size);

		$('#social')
			.css('width', social_diameter)
			.css('height', social_diameter);
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
	 * Returns: void
	 */
	function clickMeBlinkDisplay (args) {
		args = args || {};
		var initial_delay = args.initial_delay || 0;
		var repeat_delay = args.releat_delay || 7000;

		var switcher = function () {
			if (!_flags.blink) {
				return;
			}

			var randomtxt = ['Share Me!'];
			if (_reward_mode.init) {
				randomtxt = ['? ? ?', "Mystery?", "What?"];
			}

			var text = random_choice(randomtxt);

			$('#main').fadeChangeText(text, 1250, function () {
				if (!_flags.blink) {
					return;
				}

				var txt = _reward_mode.init 
					? _reward_mode.button_text 
					: _original_text;

				$('#main').fadeChangeText(txt);
			});
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
		
		if (_flags.vibrate) {
			$(element).effect('shake', {
				times: 7, 
				distance: 3,
				direction: direction,
				complete: function () {
					element.centerIn()
				}
			}, 10);
		}
	}

	function cutoff (value, low, high) {
		return Math.max(Math.min(value, high), low);
	}

	function random_choice (array) {
		var index = random_integer(array.length);
		return array[index];
	};

	function random_integer (max) {
		return Math.floor(Math.random() * max);
	}

	function round (value, lower, upper) {
		if (Math.abs(upper - value) > Math.abs(value - lower)) {
			return lower;
		}

		return upper;
	}

	function range (from, to, incr) {
		var rng = [];

		incr = incr || 1;

		for (var i = from; i <= to; i += incr) {
			rng.push(i);
		}

		return rng;
	}

	function appearDogeWord (phrases) {
		var item = $('<div>')
			.addClass('dogeitem')
			.text(random_choice(phrases));

		var win_h = $(window).innerHeight();
		var win_w = $(window).innerWidth()

		var h = Math.floor(win_h * Math.random());
		var w = Math.floor(win_w * Math.random());

		h = cutoff(h, win_h * 0.1, win_h * 0.85);
		w = cutoff(w, win_w * 0.1, win_w * 0.75);

		item.css('top', h).css('left', w);

		var fontsize = 0.5 + (2 * Math.random());
		item.css('font-size', fontsize.toFixed(1) + "em");

		var hexcolor = Math.floor(Math.pow(255, 3) * Math.random()).toString(16);
		item.css('color', '#' + hexcolor);

		$('body').append(item);

		item.delay(1500).fadeOut(1000, function () {
			$(this).remove();
		});
	}

	String.prototype.format_url = function (fmt) {
		Object.keys(fmt).forEach(function (key) {
			fmt[key] = encodeURIComponent(fmt[key]);
		});

		return this.format(fmt);
	};

	String.prototype.format = function (fmt) {
		var str = this;
		Object.keys(fmt).forEach(function (key) {
			str = str.replace(new RegExp('#\{' + key + '\}', 'g'), fmt[key])
		});

		return str;
	};

	$.fn.cssAnimation = function (animation_class, final_state_class) {
		$(this)
			.addClass(animation_class)
			.animationend(function () {
				$(this)
					.addClass(final_state_class)
					.removeClass(animation_class);
			});

		return this;
	};

	$.fn.animationend = function (fn) {
		return $(this).one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', fn);
	};

	$.fn.fadeChangeText = function (text, cb_wait, callback) {
		var timedcb;
		if (callback) {
			timedcb = function () {
				setTimeout(callback, cb_wait);
			};
		}
		
		$(this).fadeOut(200, function () {
			$(this)
				.text(text)
				.centerIn()
				.fadeIn(200, timedcb);
		});
	};

	$.fn.delayedCenterIn = function () {
		var that = $(this);
		setTimeout(function () {
			that.centerIn();
		}, 10);

		return this;
	};

	$.browser = $.browser || {};
	$.browser.iproduct = /ipad|iphone/i.test(navigator.userAgent);

})(jQuery);

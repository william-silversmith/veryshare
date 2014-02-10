/* ColorUtils.js
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
*/
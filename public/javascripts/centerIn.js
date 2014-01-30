;(function($, undefined) {

	/* centerIn
	 *
	 * Centers the element with respect to
	 * the first element of the given selector
	 * both horizontally and vertically.
	 *
	 * Required:
	 *	 [0] selector: The element to center within
	 *
	 * Options:
	 *	 direction: 'horizontal', 'vertical', 'both' (default)
	 *	 top: Additional offset in px
	 *	 left: Additional offset in px
	 *
	 * Returns: void
	 */
	$.fn.centerIn = function (selector, options) {
		var elements = this;
		options = options || {};

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
		};

		var horizontal = function (element) {
			var left = Math.round((selector.innerWidth() - element.outerWidth(false)) / 2);
			left += extraleft;
			element.css('left', left + "px");
		};

		var vertical = function (element) {
			var top = Math.round((selector.innerHeight() - element.outerHeight(false)) / 2);
			top += extratop;
			element.css('top', top + "px");
		};

		var centerfn = composeFunctions(horizontal, vertical, direction);

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

		var centeringfn = function () {
			selector.centerIn.apply(selector, args);
		};

		$(window).on('resize.centerIn', centeringfn);
		$(window).on('focus.centerIn', function () {
			setTimeout(centeringfn, 500);
		});
	 };

	/* Defaults */

	$.fn.centerIn.defaults = {
		direction: 'both'
	};

	function composeFunctions(horizontal, vertical, direction) {
		if (!direction || direction === 'both') {
			return function (element) { 
				vertical(element);
				horizontal(element);
			};
		}
		else if (direction === 'horizontal') {
			return function (element) { 
				horizontal(element) 
			};
		}
		else if (direction === 'vertical') {
			return function (element) {
				vertical(element);
			};
		}

		return function () {};
	}
})(jQuery);
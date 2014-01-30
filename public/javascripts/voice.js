(function ($, undefined) {

	$(window).resize(pagesize);

	$(document).ready(function () {
		pagesize();

		$('.page').each(function (index, element) {
			$(element).find('.content').first().alwaysCenterIn(element);
		});
	});

	function pagesize () {
		$('div.page').css('height', $(window).innerHeight());
	}

})(jQuery);


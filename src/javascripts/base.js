/*global _gaq, jQuery*/

(function ($) {
	'use strict';

	function switchTitle() {
		var $descriptions = $('.intro span');

		var randomPosition = Math.floor(Math.random() * $descriptions.length);

		$('.intro--active').removeClass();

		$descriptions.eq(randomPosition).addClass('intro--active');
	}

	setInterval(switchTitle, 5000);

	$('.links').on('click', 'li', function () {
		_gaq.push(['_trackEvent', 'outgoing', $(this).attr('class')]);
	});

})(jQuery);

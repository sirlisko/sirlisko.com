/*global _gaq, jQuery*/

(function ($) {
	'use strict';
	function switchTitle() {
		var randomNumber = Math.floor(Math.random() * 7);
		var title = $($('.title')[randomNumber]);
		title.fadeIn(2000);
		title.delay(3000).fadeOut(2000, switchTitle);
	}

	switchTitle();

	$(document).mousemove(function (e) {
		var ghost = $('.ghost');
		var offset = ghost.offset();
		if (e.pageX > offset.left) {
			ghost.removeClass('ghost-b');
		} else {
			ghost.addClass('ghost-b');
		}

		ghost.stop();

		ghost.animate({
			left: e.pageX - 55,
			bottom: window.innerHeight - (e.pageY + 55)
		}, 5000);
	});

	$('.ghost').mouseover(function () {
		var heart = $('.heart');
		if (heart.length > 1) {
			$(heart[0]).remove();
		} else {
			$(heart[0]).remove();
			$('.life').html(' - game over - ');
			_gaq.push(['_trackEvent', 'goodies', 'game over', 'Finished Ghost Game']);
		}
	});

	$('.links').on('click', 'li', function () {
		_gaq.push(['_trackEvent', 'outgoing', $(this).attr('class')]);
	});

})(jQuery);

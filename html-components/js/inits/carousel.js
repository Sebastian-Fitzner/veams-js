require(['main'], function() {
	require(['jquery', 'ui.carousel'], function($, Carousel) {
		$('[data-js-module="carousel"]').each(function() {
			new Carousel({
				el: $(this),
				options: $(this).data('js-options')
			});
		});
	});
});

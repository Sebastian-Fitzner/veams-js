require(['main'], function() {
	require(['jquery', 'SelectFx'], function($, SelectFx) {
		$('[data-js-module="form"] select').each(function() {
			new SelectFx({
				el: $(this),
				options: $(this).data('js-options')
			});
		});
	});
});

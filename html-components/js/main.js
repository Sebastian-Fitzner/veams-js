require(['config'], function() {
	require([
		'backbone',
		'jquery',
		'helpers',
		'App',
		'modules/equal-row-height/equal-row-heights',
		'modules/navigation/navigation',
		'modules/navigation/toggler',
		'respimage'
	], function(Backbone, $, Helpers, App, EqualRows, Navigation, Toggler) {
		"use strict";

		// Trigger global resize event
		window.onresize = function() {
			App.Vent.trigger('resize');
		};

		// Initialize EqualRows
		$('[data-js-module="equal"]').each(function() {
			new EqualRows({
				el: $(this),
				options: $(this).data('js-options')
			}).render();
		});

		// Initialize navigation and toggle button
		var toggleSearch = new Toggler();

		toggleSearch.init({
			toggleEl: $('[data-js-module="nav-search"]'),
			toggleTarget1: $('[data-js-module="search"]'),
			clickedClass: 'js-is-clicked',
			toggleSpeed: 400,
			toggleSearch: true
		});

		// Initialize navigation and toggle button
		new Navigation({
			toggleEl: $('[data-js-module="nav-toggler"]'),
			toggleTarget1: $('[data-js-module="nav-main"]'),
			toggleTarget2: $('[data-js-module="nav-sub"]')
		});

	});
});

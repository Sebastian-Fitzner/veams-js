require(['config'], function () {
	require([
		'backbone',
		'jquery',
		'helpers',
		'App',
		'modules/equal-row-height/equal-row-heights',
		'ui.button',
		'ui.carousel',
		'ui.toggle',
		'modules/sticky/sticky',
		'ui.overlay-init',
		'respimage'
	], function (Backbone, $, Helpers, App, EqualRows, Button, Carousel, Toggle, Sticky) {
		"use strict";

		var $head = $('head');
		var currentMedia = $head.css('font-family');

		App.currentMedia = currentMedia;

		// Trigger global resize event
		window.onresize = function () {
			App.currentMedia = $head.css('font-family');

			App.Vent.trigger('resize');

			if (currentMedia !== App.currentMedia) {
				App.Vent.trigger({
					type: 'mediachange',
					currentMedia: currentMedia
				});
			}
		};

		/**
		 * Initialize EqualRows
		 */
		$('[data-js-module="equal"]').each(function () {
			new EqualRows({
				el: $(this),
				options: $(this).data('js-options')
			}).render();
		});

		/**
		 * Initialize Button
		 */
		$('[data-js-module="button"]').each(function () {
			var options = $(this).data('js-options');
			var button = new Button({
				el: $(this),
				options: options
			});

			button.clickHandler = function () {
				App.Vent.trigger(options.globalEvent, {
					el: $(this),
					options: options
				});
			};

			button.render();
		});

		/**
		 * Initialize Toggle
		 */
		$('[data-js-module="toggle"]').each(function () {
			new Toggle({
				el: $(this),
				options: $(this).data('js-options')
			});
		});

		/**
		 * Initialize Carousel
		 */
		$('[data-js-module="carousel"]').each(function () {
			new Carousel({
				el: $(this),
				options: $(this).data('js-options')
			});
		});

		/**
		 * Initialize Sticky
		 */
		$('[data-js-module="sticky"]').each(function () {
			var sticky = new Sticky({
				el: this,
				options: $(this).data('js-options')
			});

			sticky.init();
		});
	});
});

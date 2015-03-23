require.config({
	paths: {
		'backbone': '../bower-components/backbone/backbone',
		'text': '../bower-components/requirejs-text/text',
		'touchSwipe': '../bower-components/jquery-touchswipe/jquery.touchSwipe',
		'respimage': '../bower-components/respimage/respimage',
		'jquery': '../bower-components/jquery/dist/jquery',
		'documentRegisterElement': '../bower-components/document-register-element/build/document-register-element.max',
		'helpers': 'utils/helpers',
		'App': 'app',
		'ui.button': 'modules/button/ui-button',
		'ui.button-init': 'modules/button/init',
		'ui.overlay': 'modules/overlay/ui-overlay',
		'ui.overlay-init': 'modules/overlay/init',
		'ui.carousel': 'modules/carousel/ui-carousel',
		'ui.carousel-init': 'modules/carousel/init',
		'ui.toggle': 'modules/toggle/ui-toggle',
		'ui.toggle-init': 'modules/toggle/init',
		'sticky': 'modules/sticky/sticky',
		'equalRowHeight': 'modules/equal-row-height/equal-row-heights'
	},
	shim: {
		'helpers': {
			deps: ['backbone'],
			exports: 'Helpers'
		},
		'backbone': {
			deps: ['../bower-components/underscore/underscore', 'jquery'],
			exports: 'Backbone'
		},
		'touchSwipe': {
			exports: 'TouchSwipe'
		},
		'respimage': {
			exports: 'respimage'
		},
		'App': {
			deps: ['backbone', 'jquery', 'documentRegisterElement'],
			exports: 'App'
		}
	}
});

require([
		'App',
		'backbone',
		'jquery',
		'helpers',
		'equalRowHeight',
		'respimage',
		'ui.button-init',
		'ui.overlay-init',
		'ui.toggle-init',
		'ui.carousel-init'
	],
	function (App, Backbone, $, Helpers, Equals) {
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
		 * Equal Row Heights
		 */
		$('[data-js-module="equal"]').each(function () {
			new Equals({
				el: $(this),
				options: $(this).data('js-options')
			}).render();
		});

		/**
		 * Sticky Header
		 */
		$('[data-js-module="sticky"]').each(function () {
			var sticky = new Sticky({
				el: this,
				options: $(this).data('js-options')
			});

			sticky.init();
		});

	});

require.config({
	paths: {
		'backbone': '../bower-components/backbone/backbone',
		'text': '../bower-components/requirejs-text/text',
		'touchSwipe': '../bower-components/jquery-touchswipe/jquery.touchSwipe',
		'respimage': '../bower-components/respimage/respimage',
		'jquery': '../bower-components/jquery/dist/jquery',
		'documentRegisterElement': 'vendor/document-register-element',
		'helpers': 'utils/helpers',
		'App': 'app',
		'ui.button': 'modules/button/ui-button',
		'ui.button-init': 'modules/button/init',
		'ui.overlay': 'modules/overlay/ui-overlay',
		'ui.overlay-init': 'modules/overlay/init',
		'ui.carousel': 'modules/carousel/ui-carousel',
		'ui.carousel-init': 'modules/carousel/init',
		'ui.tabtree': 'modules/tabtree/ui-tabtree',
		'ui.tabtree-init': 'modules/tabtree/init',
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
		'ui.carousel-init'
	],
	function(App, Backbone, $, Helpers, Equals) {
		"use strict";

		window.onresize = function() {
			App.Vent.trigger('resize');
		};

		$('[data-js-module="equal"]').each(function() {
			new Equals({
				el: $(this),
				options: $(this).data('js-options')
			}).render();
		});

	});

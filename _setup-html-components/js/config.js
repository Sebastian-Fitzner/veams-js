require.config({
	paths: {
		'underscore': '../bower-components/underscore/underscore',
		'backbone': '../bower-components/backbone/backbone',
		'text': '../bower-components/requirejs-text/text',
		'touchSwipe': '../bower-components/jquery-touchswipe/jquery.touchSwipe',
		'respimage': '../bower-components/respimage/respimage',
		'SelectFx': 'modules/select/ui-select',
		'jquery': '../bower-components/jquery/dist/jquery',
		'helpers': 'utils/helpers',
		'App': 'app',
		'ui.button': 'modules/button/ui-button',
		'ui.overlay': 'modules/overlay/ui-overlay',
		'ui.carousel': 'modules/carousel/ui-carousel',
		'ui.toggle': 'modules/toggle/ui-toggle',
		'sticky': 'modules/sticky/sticky',
		'equalRowHeight': 'modules/equal-row-height/equal-row-heights'
	},
	waitSeconds: 0,
	shim: {
		'helpers': {
			deps: ['backbone'],
			exports: 'Helpers'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'touchSwipe': {
			exports: 'TouchSwipe'
		},
		'respimage': {
			exports: 'respimage'
		},
		'App': {
			deps: ['backbone', 'jquery'],
			exports: 'App'
		}
	}
});

require.config({
	paths: {
		'underscore': '../bower-components/underscore/underscore',
		'backbone': '../bower-components/backbone/backbone',
		'text': '../bower-components/requirejs-text/text',
		'touchSwipe': '../bower-components/jquery-touchswipe/jquery.touchSwipe',
		'respimage': '../bower-components/respimage/respimage',
		'SelectFx': 'modules/select/ui-select',
		'jquery': '../bower-components/jquery/dist/jquery',
		'App': 'app',
		'helpers': 'utils/helpers',
		'ui.carousel': 'modules/carousel/ui-carousel'
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

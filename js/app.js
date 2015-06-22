import Helpers from './utils/helpers';
var $ = require('jquery');
var Exo = require('exoskeleton');
// require('backbone.touch');

export default (function () {
	'use strict';

	// Save a reference to the global object
	var root = window;
	root.Backbone = {};
	root.Backbone.$ = $;

	// @borrow objects
	var App = root.App = Helpers.extend(window.App || {}, {
		Vent: Helpers.extend({}, Exoskeleton.Events),
		ui: {}
	});

	// Add globals
	App.Exoskeleton = Exoskeleton;
	App.$ = $;

	/**
	 * Create custom view with own properties and
	 * take this view in our modules
	 * register only one reference to our global library Exoskeleton
	 */
	App.ComponentView = function (options) {
		Exoskeleton.View.call(this, options);
	};

	Helpers.extend(App.ComponentView.prototype, Exoskeleton.View.prototype, {
		// base functions will be implemented here
	});

	App.ComponentView.extend = Exoskeleton.View.extend;
	/**
	 * Add our Mixin to our Exoskeleton.View object.
	 */
	App.ComponentView.mixin = Helpers.viewMixin;

	// Feature detection
	App.support = App.support || {};
	App.support.touch = Helpers.isTouch();
	App.clickHandler = Helpers.clickHandler();

	// Versioning
	App.version = "0.1.1-4";

	// Media Query
	var head = document.querySelectorAll('head');
	App.currentMedia = window.getComputedStyle(head[0], null).getPropertyValue('font-family');

	// devmode logging
	if (document.location.search.indexOf('devmode') < 0 && document.querySelectorAll('html')[0].className.indexOf('ie9') < 0) {
		// hide all warnings and logs if not in devmode
		console.log = function () {
		};
		console.warn = function () {
		};
	} else {
		App.devmode = true;
	}

	// Trigger global resize event
	window.onresize = function (e) {
		var currentMedia = window.getComputedStyle(head[0], null).getPropertyValue('font-family');

		if (currentMedia !== App.currentMedia) {
			var oldMedia = App.currentMedia;

			App.currentMedia = currentMedia;
			console.log('App.currentMedia: ', App.currentMedia);

			App.Vent.trigger('mediachange', {
				type: 'mediachange',
				currentMedia: currentMedia,
				oldMedia: oldMedia
			});
		}

		App.Vent.trigger('resize', e);
	};

	document.onscroll = function (e) {
		App.Vent.trigger('scroll', e);
	};

	return App;

}).call(this);
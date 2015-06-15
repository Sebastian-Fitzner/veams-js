// Links:
// http://www.html5rocks.com/en/tutorials/webcomponents/customelements/
// https://developer.mozilla.org/en-US/docs/DOM/DOM_Reference#HTML_interfaces
var Helpers = require('./utils/helpers');
var $ = require('jquery');
var Exo = require('exoskeleton');
// require('backbone.touch');

module.exports = (function () {
	'use strict';

	// Save a reference to the global object
	var root = window;

	// @borrow objects
	var App = root.App = Helpers.extend(window.App || {}, {
		Vent: Helpers.extend({}, Exo.Events),
		ui: {}
	});

	// Add globals
	App.Exo = Exo;
	App.$ = $;

	/**
	 * Create custom view with own properties and
	 * take this view in our modules
	 * register only one reference to our global library Exoskeleton
	 */
	App.ComponentView = function (options) {
		Exo.View.call(this, options);
	};

	Helpers.extend(App.ComponentView.prototype, Exo.View.prototype, {
		// base functions will be implemented here
	});

	App.ComponentView.extend = Exo.View.extend;
	/**
	 * Add our Mixin to our Backbone.View object.
	 */
	App.ComponentView.mixin = Helpers.viewMixin;

	// Feature detection
	App.support = App.support || {};
	App.support.touch = Helpers.isTouch();
	App.clickHandler = Helpers.clickHandler();

	// Versioning
	App.version = "0.0.1";

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

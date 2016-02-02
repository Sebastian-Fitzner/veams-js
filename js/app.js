import Helpers from './utils/helpers';
import EVENTS from './utils/events';

const $ = require('jquery');
const Exoskeleton = require('exoskeleton');

require('respimage');

export default (function () {
	'use strict';

	// ----------------------------------
	// GLOBAL NAMESPACE
	// ----------------------------------

	// Save a reference to the global object
	let root = window;
	root.Backbone = {};
	root.Backbone.$ = $;

	// @borrow objects
	let App = root.App = Helpers.extend(window.App || {}, {
		Vent: Helpers.extend({}, Exoskeleton.Events)
	});

	// Add globals
	App.Exoskeleton = Exoskeleton;
	App.$ = $;
	App.EVENTS = EVENTS;

	/**
	 * Create custom view with own properties and
	 * take this view in our modules
	 * register only one reference to our global library Exoskeleton
	 */
	App.ComponentView = function (options) {
		Exoskeleton.View.call(this, options);
	};
	App.ComponentModel = function (options) {
		Exoskeleton.Model.call(this, options);
	};
	App.ComponentCollection = function (options) {
		Exoskeleton.Collection.call(this, options);
	};

	Helpers.extend(App.ComponentView.prototype, Exoskeleton.View.prototype, {});
	Helpers.extend(App.ComponentModel.prototype, Exoskeleton.Model.prototype, {});
	Helpers.extend(App.ComponentCollection.prototype, Exoskeleton.Collection.prototype, {});

	App.ComponentView.extend = Exoskeleton.View.extend;
	App.ComponentModel.extend = Exoskeleton.Model.extend;
	App.ComponentCollection.extend = Exoskeleton.Collection.extend;

	/**
	 * Add our Mixin to our View object.
	 */
	App.ComponentView.classMixin = Helpers.classMixin;

	// Feature detection
	App.support = App.support || {};
	App.support.touch = Helpers.isTouch();
	App.clickHandler = Helpers.clickHandler();

	// Versioning
	App.version = "0.0.1";

	// Media Query
	let head = document.querySelectorAll('head');
	App.currentMedia = window.getComputedStyle(head[0], null).getPropertyValue('font-family');

	// Screen Size
	App.screenSize = {
		width: root.innerWidth,
		height: root.innerHeight
	};

	// ----------------------------------
	// CHECKING
	// ----------------------------------

	// disable devmode logging if not on ie9 and parameter "devmode" not present
	if (document.querySelectorAll('html')[0].className.indexOf('ie9') < 0) {
		if (document.location.search.indexOf('devmode') < 0) {
			// hide all warnings and logs if not in devmode
			console.log = console.warn = function () {
			};
		} else {
			App.devmode = true;
		}
	}
	else {
		// IE9 FIX: in ie9 window.console seems to be undefined until you open dev tools
		if (!window.console) {
			window.console = {};
			console.log = console.warn = function () {
			};
		}
	}

	// ----------------------------------
	// GLOBAL EVENTS
	// ----------------------------------

	/**
	 * Triggers
	 */

	// Trigger global resize event
	window.onresize = function (e) {
		let currentMedia = window.getComputedStyle(head[0], null).getPropertyValue('font-family');
		let width = window.innerWidth;

		if (currentMedia !== App.currentMedia) {
			let oldMedia = App.currentMedia;

			App.currentMedia = currentMedia;
			console.log('App.currentMedia: ', App.currentMedia);

			App.Vent.trigger(App.EVENTS.mediachange, {
				type: App.EVENTS.mediachange,
				currentMedia: currentMedia,
				oldMedia: oldMedia
			});
		}

		if (width != App.screenSize.width) {
			App.screenSize.width = width;
			App.Vent.trigger(App.EVENTS.resize, e);
		}
	};

	document.onscroll = function (e) {
		App.Vent.trigger(App.EVENTS.scroll, e);
	};

	return App;

}).call(this);
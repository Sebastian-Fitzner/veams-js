import Helpers from './utils/helpers';
import EVENTS from 'events';
import { default as VeamsQuery } from 'veams-query';
require('picturefill');
require('lazysizes');

const $ = VeamsQuery;
const Exoskeleton = require('exoskeleton');

Exoskeleton.View = require('backbone.nativeview');
Exoskeleton.ajax = require('backbone.nativeajax');

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
	App.Helpers = Helpers;

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

	// Global module registry
	App.modules = {};

	// Add module to global registry
	App.registerModule = function (module, el) {
		if (!App.modules[module.name]) {
			App.modules[module.name] = module;
			App.modules[module.name].nodes = [el];
		}
		else {
			App.modules[module.name].nodes.push(el);
		}

		App.Vent.trigger(App.EVENTS.moduleRegistered, {
			module: module,
			el: el
		});
	};

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


	if (document.location.search.indexOf('devmode') > -1) {
		App.devmode = true;
	}

	if (document.location.search.indexOf('logger') > -1) {
		App.logger = true;
	}

	// hide all warnings and logs if not in devmode
	if (!App.devmode) {
		console.log = console.warn = function () {
		};
	}

	// add console output element (triggered by parameter 'devmode' and 'logger' in url)
	if (App.devmode && App.logger) {
		let logger = document.createElement('pre');

		logger.setAttribute('id', 'logger');
		document.body.appendChild(logger);

		console.write = function () {
			for (let i = 0; i < arguments.length; i++) {
				if (typeof arguments[i] == 'object') {
					logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
				} else {
					logger.innerHTML += arguments[i] + '<br />';
				}
			}

			logger.innerHTML += '<br />';
			logger.scrollTop = logger.scrollHeight;
		};

		console.error = function () {
			logger.innerHTML += '[Error]<br />';
			console.write.apply(this, arguments);
		};

		console.warn = function () {
			logger.innerHTML += '[Warn]<br />';
			console.write.apply(this, arguments);
		};

		console.log = function () {
			logger.innerHTML += '[Log]<br />';
			console.write.apply(this, arguments);
		};
	}


	// ----------------------------------
	// GLOBAL EVENTS
	// ----------------------------------

	/**
	 * Triggers
	 */

	// Trigger global resize event
	window.onresize = Helpers.throttle(function (e) {
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
	}, 300);


	document.onscroll = Helpers.throttle(function (e) {
		App.Vent.trigger(App.EVENTS.scroll, e);
	}, 200);

	return App;

}).call(this);
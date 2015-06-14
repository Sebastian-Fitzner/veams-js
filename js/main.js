// Main Requirements
var $ = require('jquery');
var App = require('./app');
var Helpers = require('./utils/helpers');
require('respimage');
require('document-register-element');

// Modules
var Button = require('./modules/button/button-init');
var EqualRows = require('./modules/equal-row-height/equal-row-heights');
var Form = require('./modules/form/form');

"use strict";

document.addEventListener("DOMContentLoaded", function () {

	console.log('App initialized with version: ', App.version);

	/**
	 * Init Buttons
	 */
	Helpers.loadModules({
		el: '[data-js-module="button"]',
		Module: Button
	});

	/**
	 * Init Forms
	 */
	Helpers.loadModules({
		el: '[data-js-module~="form"]',
		Module: Form
	});

	/**
	 * Init Equal Rows
	 */
	Helpers.loadModules({
		el: '[data-js-module~="equal"]',
		Module: EqualRows,
		render: false,
		cb: function (module, options) {
			if (options && options.delayInit) {
				$(window).load(function () {
					module._reinit(module);
				});
			}
		}
	});
});

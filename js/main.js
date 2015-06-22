// Main Requirements
import App from './app';
import Helpers from './utils/helpers';

require('respimage');
require('document-register-element');

var $ = App.$;

// ES6 Modules
import EqualRows from './modules/equal-row-height/equal-row-heights';
import Toggle from './modules/toggle/ui-toggle';
import ButtonInit from './modules/button/button-init';
import Form from './modules/form/form';


"use strict";

document.addEventListener("DOMContentLoaded", function() {

	console.log('App initialized with version: ', App.version);

	/**
	 * Init Buttons
	 */
	Helpers.loadModule({
		el: '[data-js-module="button"]',
		Module: ButtonInit
	});

	/**
	 * Init Toggle
	 */
	Helpers.loadModule({
		el: '[data-js-module="toggle"]',
		Module: Toggle
	});

	/**
	 * Init Forms
	 */
	Helpers.loadModule({
		el: '[data-js-module~="form"]',
		Module: Form
	});

	/**
	 * Init Equal Rows
	 */
	Helpers.loadModule({
		el: '[data-js-module~="equal"]',
		Module: EqualRows,
		render: false,
		cb: function(module, options) {
			if (options && options.delayInit) {
				$(window).load(function() {
					module._reinit(module);
				});
			}
		}
	});
});
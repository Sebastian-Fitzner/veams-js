// Main Requirements
import App from './app';
import Helpers from './utils/helpers';

require('respimage');
require('document-register-element');

var $ = App.$;

// ES6 Modules
import ButtonInit from './modules/button/button-init';
import Toggle from './modules/toggle/ui-toggle';
import Form from './modules/form/form';
import EqualRows from './modules/equal-row-height/equal-row-heights';


"use strict";

class Core {
	constructor() {
		this.initialize();
	}

	initialize() {
		console.log('App initialized with version: ', App.version);

		/**
		 * Detect Touch
		 */
		if (!App.support.touch) {
			$('html').addClass('no-touch');
		}


		/**
		 * Global Events
		 */
		App.Vent.on('dom:redirect', (obj) => {
			if (!obj && !obj.url) throw new Error('Object is not defined. Please provide an url in your object!');

			// Redirect to page
			window.location.href = String(obj.url);
		});
	}

	render(context) {
		/**
		 * Init Buttons
		 */
		Helpers.loadModule({
			el: '[data-js-module="button"]',
			Module: ButtonInit,
			context: context
		});
		
		/**
		 * Init Toggle
		 */
		Helpers.loadModule({
			el: '[data-js-module="toggle"]',
			Module: Toggle,
			render: false,
			context: context
		});

		/**
		 * Init Forms
		 */
		Helpers.loadModule({
			el: '[data-js-module~="form"]',
			Module: Form,
			context: context
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
			},
			context: context
		});
	}
}

document.addEventListener("DOMContentLoaded", function() {
	var core = new Core();

	// render app
	core.render();

	// Re-Initialize Modules
	App.Vent.on('DOMchanged', (context) => {
		Helpers.querySelectorArray({
			el: context
		}).forEach((itemContext) => {
			core.render(itemContext);
		});
	});

});

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
// Main Requirements
import App from './app';
import Helpers from './utils/helpers';

// ES6 Modules
import Button from './modules/button/button';
import Toggle from './modules/toggle/ui-toggle';
import EqualRows from './modules/equal-row-height/equal-row-heights';
import Form from './modules/form/form';
import FormAjax from './modules/form/form-ajax';

// Vars
const $ = App.$;

"use strict";

// Main Functionality
class Core {
	constructor() {
		this.initialize();
	}

	/**
	 * Initialize our core functionality
	 * This function will only be executed once.
	 */
	initialize() {
		console.log('App initialized with version: ', App.version);

		/**
		 * Detect Touch
		 */
		if (!App.support.touch) {
			$('html').addClass('no-touch');
		} else {
			$('html').addClass('touch');
		}
	}

	render(context) {
		/**
		 * Init Buttons
		 */
		Helpers.loadModule({
			el: '[data-js-module="button"]',
			module: Button,
			context: context
		});
		
		/**
		 * Init Toggle
		 */
		Helpers.loadModule({
			el: '[data-js-module="toggle"]',
			module: Toggle,
			render: false,
			context: context
		});

		/**
		 * Init Forms
		 */
		Helpers.loadModule({
			el: '[data-js-module~="form"]',
			module: Form,
			context: context
		});

		/**
		 * Init AjaxForm
		 */
		Helpers.loadModule({
			el: '[data-js-module~="form-ajax"]',
			module: FormAjax,
			render: false,
			context: context
		});

		/**
		 * Init Equal Rows
		 */
		Helpers.loadModule({
			el: '[data-js-module~="equal"]',
			module: EqualRows,
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

	/**
	 * Render modules
	 */
	core.render();

	/**
	 * Initialize modules which are loaded after initial load
	 * via custom event 'DOMchanged'
	 */
	App.Vent.on(App.EVENTS.DOMchanged, (context) => {
		Helpers.querySelectorArray(context).forEach((itemContext) => {
			console.log('Dom has changed. Initialising new modules in: ', itemContext);
			core.render(itemContext);
		});
	});
});
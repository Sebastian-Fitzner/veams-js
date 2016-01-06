// Main Requirements
import App from './core';
import Helpers from './utils/helpers';

// ES6 Modules
import EqualRows from './modules/equal-row-height/equal-row-heights';
import FormAjax from './modules/form/form-ajax';

// Vars
const $ = App.$;

'use strict';

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

		// Redirect
		App.Vent.on(App.EVENTS.DOMredirect, (obj) => {
			if (!obj && !obj.url) throw new Error('Object is not defined. Please provide an url in your object!');

			// Redirect to page
			window.location.href = String(obj.url);
		});
	}

	preRender() {
		Helpers.saveDOM();
	}

	render(context) {

		/**
		 * Init AjaxForm
		 */
		Helpers.loadModule({
			domName: 'form-ajax',
			module: FormAjax,
			render: false,
			context: context
		});

		/**
		 * Init Equal Rows
		 */
		Helpers.loadModule({
			domName: 'equal',
			module: EqualRows,
			render: false,
			cb: function (module, options) {
				if (options && options.delayInit) {
					$(window).load(function () {
						module._reinit(module);
					});
				}
			},
			context: context
		});
	}
}

document.addEventListener("DOMContentLoaded", function () {
	let core = new Core();

	/**
	 * Render modules
	 */
	core.preRender();
	core.render(document);

	/**
	 * Initialize modules which are loaded after initial load
	 * via custom event 'DOMchanged'
	 */
	App.Vent.on(App.EVENTS.DOMchanged, (context) => {
		console.log('Dom has changed. Initialising new modules in: ', context);
		core.preRender();
		core.render(context);
	});
});
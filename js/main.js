// Main Requirements
import App from './app';
import Helpers from './utils/helpers';

// ES6 Modules

// @INSERTPOINT :: @ref: js-import

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

		// @INSERTPOINT :: @ref: js-init-once-v3

	}

	preRender() {
		Helpers.saveDOM();
	}

	render(context) {
		// @INSERTPOINT :: @ref: js-init-v3

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
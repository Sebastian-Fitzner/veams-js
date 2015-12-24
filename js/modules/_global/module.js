import Helpers from '../../utils/helpers';
import App from '../../app';

const $ = App.$;

class AppModule {

	/**
	 * Contructor
	 *
	 * to save standard elements like el and options and
	 * exeute initialize as default method
	 */
	constructor(obj = {}, options = {}) {
		this.el = obj.el;
		this.$el = $(obj.el);
		this.options = options;

		this._options = obj.options;
		this.initialize();
	}

	// GETTER AND SETTER

	/**
	 * Return options
	 */
	get _options() {
		return this.options;
	}

	/**
	 * Save options by merging default options with passed options
	 */
	set _options(options) {
		this.options = Helpers.defaults(options || {}, this.options);
	}

	// STANDARD METHODS

	/**
	 * Initialize your module class,
	 * save some references,
	 * optionally scaffold some templates and
	 * bind your events
	 */
	initialize() {
		this.preRender();
		this.bindEvents();
	}

	/**
	 * Bind global and local events
	 */
	bindEvents() {
	}

	/**
	 * Pre-Render templates
	 * which can be used to render content into it
	 */
	preRender() {
	}

	/**
	 * Render your module
	 */
	render() {
	}
}

/**
 * Add mixin functionality to extend module class
 */
AppModule.classMixin = Helpers.classMixin;

export default AppModule;
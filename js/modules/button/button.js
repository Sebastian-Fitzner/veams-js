/**
 * Represents a button with custom click handlers.
 * @module button
 *
 * @author Sebastian Fitzner
 */

import Helpers from '../../utils/helpers';
import App from '../../app';
var $ = App.$;

var ButtonView = App.ComponentView.extend({

	/**
	 * Options for the view
	 */
	options: {
		activeClass: 'is-active',
		context: false,
		singleOpen: false
	},

	events: {
		click: 'onClick'
	},

	/**
	 * Initialize the view and merge options
	 *
	 * @param {obj} obj - contains options as JSON which will be merged with predefined options
	 */
	initialize: function (obj) {
		this.options = Helpers.defaults(obj.options || {}, this.options); // get/set default options

		this._bindEvents();
	},

	/**
	 * Bind events
	 *
	 * Listen to open and close events
	 */
	_bindEvents: function () {
		this.listenTo(App.Vent, 'button:close', this.close);
		this.listenTo(App.Vent, 'button:open', this.open);
	},

	/**
	 * Handle classes
	 *
	 * Trigger events so that each button can listen to that and react by option singleOpen
	 */
	handleClasses: function () {
		this.$el.is('.' + this.options.activeClass) ? App.Vent.trigger('button:close', {
			'el': this.$el
		}) : App.Vent.trigger('button:open', {
			'el': this.$el
		});
	},

	/**
	 * Close method
	 *
	 * When the node is equal the object we remove the active class
	 *
	 * @param {obj} obj - the event object with our element
	 * @param {obj} obj.el - element
	 */
	close: function (obj) {
		if (Helpers.checkNodeEquality(this.$el[0], obj.el[0])) {
			this.$el.removeClass(this.options.activeClass);
			if (this.options.context) this.$el.closest(this.options.context).removeClass(this.options.activeClass);
		}
	},

	/**
	 * Open method
	 *
	 * When the node is equal the object we add the active class
	 * When furthermore the options singleOpen is defined,
	 * we remove all active classes on elements in the same context
	 *
	 * @param {obj} obj - the event object with our element
	 * @param {obj} obj.el - element
	 */
	open: function (obj) {
		if (Helpers.checkNodeEquality(this.$el[0], obj.el[0])) {
			this.$el.addClass(this.options.activeClass);
			if (this.options.context) this.$el.closest(this.options.context).addClass(this.options.activeClass);
		} else {
			if (Helpers.checkElementInContext(obj.el, this.options.context) && this.options.singleOpen === "true") {
				this.$el.removeClass(this.options.activeClass);
			}
		}
	},

	/**
	 * Click event method
	 *
	 * This method should be overriden when you want to use the button view
	 * @see button-init.js
	 *
	 * @param {event} evt - event object
	 */
	onClick: function (evt) {
		evt.preventDefault();

		if (typeof this.clickHandler === 'function') {
			this.clickHandler.apply(this, arguments);
			this.handleClasses();
		} else {
			console.log('You need to inherit from ' + this + ' and override the onClick method or pass a function to ' + this + '.clickHandler !');
		}
	},

	// Renders the view's template to the UI
	render: function () {
		// Maintains chainability
		return this;
	}

});

export default ButtonView;
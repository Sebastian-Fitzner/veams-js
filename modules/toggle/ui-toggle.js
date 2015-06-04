/**
 * @module toggle
 *
 * @author Sebastian Fitzner
 */

var $ = require('jquery');
var App = require('../../app');
var Helpers = require('../../utils/helpers');
var ImageLoader = require('../../utils/mixins/imageLoader');

var Toggle = App.ComponentView.extend({
	options: {
		open: false, // mobile, tablet, desktop-small, desktop
		activeClass: 'is-visible',
		useMaxHeight: false, // number => 10000
		singleOpen: false,
		togglePush: false // data-js-ref="toggle-push"
	},
	// View constructor
	initialize: function (obj) {
		this.options = _.defaults(obj.options || {}, this.options);
		this.elId = this.$el.attr('id');
		this.heightProp = this.options.useMaxHeight !== false ? 'max-height' : 'height';

		if (!this.options.useMaxHeight) {
			this.elClone = this._cloneIt();
			this.elHeight = this.elClone.outerHeight(true);
			this.elClone.remove();
		} else {
			this.elHeight = this.options.useMaxHeight;
		}

		this.$el.removeClass('is-unresolved').css(this.heightProp, 0);

		if (this.options.togglePush) {
			this.pushEl = this.$el.closest('[data-js-ref="toggle-push"]');

			if (!this.pushEl.length) {
				this.pushEl = this.$el.parent();
			}
		}

		this._bindEvents();
	},

	_cloneIt: function () {
		var styles = 'position: absolute, display: block, left: -9999px';
		var width = this.$el.outerWidth(true);

		return this.$el.clone().attr('style', styles).css('width', width).appendTo('body');
	},

	_checkOpening: function () {
		var falsy = false;
		_.each(this.options.open, function (el) {
			if (el === App.currentMedia) {
				falsy = true;
			}
		});

		if (falsy !== false) {
			this.openElement();
		} else {
			this.closeElement();
		}
	},

	_bindEvents: function () {
		this.listenTo(App.Vent, 'toggle:toggleContent', this.toggleContent);
	},

	toggleContent: function (obj) {
		var toggleId = obj.options.id;
		this.context = obj.options.context;


		if (Helpers.checkElementInContext(this.$el, this.context) && this.options.singleOpen === true) {
			if (this._checkId(toggleId)) {
				this.$el.is('.' + this.options.activeClass) ? this.closeElement() : this.openElement();
			} else {
				this.closeElement();
			}
		} else {
			if (this._checkId(toggleId)) {
				this.$el.is('.' + this.options.activeClass) ? this.closeElement() : this.openElement();
			}
		}
	},

	_checkId: function (id) {
		if (this.elId === id) return true;
	},

	openElement: function () {
		if (this.options.togglePush) {
			this.pushEl.css('padding-bottom', this.elHeight);
		}

		this.$el.addClass(this.options.activeClass).css(this.heightProp, this.elHeight);
	},

	closeElement: function () {
		this.$el.removeClass(this.options.activeClass).css(this.heightProp, 0);

		if (this.options.togglePush) {
			this.pushEl.css('padding-bottom', 0);
		}
	},

	// Renders the view's template to the UI
	render: function () {
		if (this.options.open) this._checkOpening();

		// Maintains chainability
		return this;
	}
});

/** Use mixin to extend our view with `ImageLoader` */
Toggle.mixin(ImageLoader);

// Returns the View class
module.exports = Toggle;

/**
 * A module which takes elements and set the height of the elements equal.
 * @module Equal Height
 *
 * @author Sebastian Fitzner
 */
var $ = require('jquery');
var App = require('../../app');
var ImageLoader = require('../../utils/mixins/imageLoader');
var Helpers = require('../../utils/helpers');


var EqualHeight = App.ComponentView.extend({

	options: {
		childElements: 'li',
		lastRowClass: 'is-last-row',
		addPadding: false
	},

	initialize: function(obj) {
		this.options = Helpers.defaults(obj.options || {}, this.options); // get/set default options

		this._bindEvents();
	},

	_bindEvents: function() {
		var that = this,
			timer;

		App.Vent.on('resize', function() {
			that._reinit(that, timer);
		});
	},

	_reinit: function(that, timer) {
		clearTimeout(timer);
		timer = setTimeout(that.render.bind(this), 250);
	},

	_resetStyles: function(el) {
		el.removeAttr('style');
	},

	_setLastRowClass: function(element) {
		var that = this;

		$(element).each(function() {
			$(this).addClass(that.options.lastRowClass);
		});
	},

	buildRow: function(el) {
		var that = this;
		var rows = [];
		var posArray = [];
		var firstElTopPos = $(this.options.childElements).eq(0).offset().top;

		el.each(function() {
			var el = $(this);

			that._resetStyles(el);

			if (el.offset().top === firstElTopPos) {
				posArray.push(el);
			} else {
				rows.push(posArray);
				posArray = [];
				posArray.push(el);
				firstElTopPos = el.offset().top;
			}

		});

		rows.push(posArray);
		this.defineRowHeight(rows);
	},

	defineRowHeight: function(rows) {
		var that = this,
			i = 0,
			padding = ~~this.options.addPadding;

		for (i; i < rows.length; i++) {
			var height = that.getRowHeight(rows[i]);

			that.setHeight(rows[i], height, padding);

			if (i > 0 && i === rows.length - 1) {
				that._setLastRowClass(rows[i]);
			}
		}
	},

	getRowHeight: function(elements) {
		var height = 0;

		$(elements).each(function() {
			height = $(this).outerHeight() > height ? $(this).outerHeight() : height;
		});

		return height;
	},

	setHeight: function(elements, height, padding) {
		var addPadding = padding || 0;

		$(elements).each(function() {
			$(this).css({
				'height': height + addPadding
			});
		});
	},

	// Renders the view's template to the UI
	render: function() {
		var listEl = $(this.options.childElements, this.$el);

		this.buildRow(listEl);
		// Maintains chainability
		return this;
	}

});

EqualHeight.mixin(ImageLoader);

// Returns the View class
module.exports = EqualHeight;

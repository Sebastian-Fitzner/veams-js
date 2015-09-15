/**
 * @module typeAheadView
 *
 * @author Andy Gutsche
 */

var Helpers = require('../../../utils/helpers');
var App = require('../../../app');
var $ = App.$;
var Handlebars = require('handlebars/runtime')['default'];
var Template = require('../../../templates/templates')(Handlebars);
var TypeAheadCollection = require('../collections/typeAheadCollection');
var TypeAheadItemView = require('./typeAheadItemView');


var typeAheadView = App.ComponentView.extend({

	// Options
	options: {
		url: false, //ajax url
		inputField: '[data-js-atom="input-field"]', // input
		list: '[data-js-atom="type-ahead-list"]', // item list
		typeAheadItem: '[data-js-atom="type-ahead-item"]', // single item
		appendTarget: false, // append the type-ahead box to appendTarget
		template: 'CTYPEAHEAD', // dsgv template name
		typeAheadModifierClass: 'search', // modifier class
		typeAheadClass: false, //state modifier class
		form: false, // form element
		threshold: 4 // start type-ahead threshold, default 4 characters
	},

	events: {
		"click [data-js-atom='delete-btn']": "resetInput",
		"keyup [data-js-atom='input-field']": "fetchData",
		"blur [data-js-atom='input-field']": "removeTypeAhead"
	},

	// View constructorf
	initialize: function (obj) {
		this.options = Helpers.defaults(obj.options || {}, this.options);
		this.inputField = $(this.options.inputField, this.$el);
		this.form = this.options.form ? $(this.options.form, this.$el) : this.$el;
		this.appendTarget = this.options.appendTarget ? $(this.options.appendTarget, this.$el) : $(document.body);
		this.template = Template[this.options.template];
		this.url = this.options.url;
		this.threshold = this.options.threshold;

		this.bindEvents();
	},

	bindEvents: function () {
		App.Vent.on('type-ahead:search', this.search, this);
		App.Vent.on(App.Events.resize, this.calculateWidthAndPos, this);
	},

	fetchData: function () {
		var _this = this;

		if (_this.inputField.val().length >= this.threshold) {
			_this.collection = new TypeAheadCollection();

			_this.collection.fetch({
				url: _this.url,
				complete: function () {
					_this.render();
				}
			});
		} else {
			_this.removeTypeAhead(true);
		}
	},

	resetInput: function () {
		this.inputField.val('');
		this.removeTypeAhead(true);
	},

	search: function (e) {
		this.inputField.val(e.keyword);
		this.form.submit();
	},

	removeTypeAhead: function (e) {
		var _this = this;
		var timeout = typeof e === 'boolean' && e ? 0 : 200;

		clearTimeout(_this.timeout);

		_this.timeout = setTimeout(function () {
			if (_this.typeAheadEl && _this.typeAheadEl.length) {
				_this.typeAheadEl.remove();
				_this.typeAheadEl = null;
			}
		}, timeout);
	},

	calculateWidthAndPos: function (e) {
		var inputOffset = this.inputField.offset();

		if (!this.typeAheadEl || !this.typeAheadEl.length) {
			return;
		}

		if (e && !App.support.touch) {
			this.removeTypeAhead(true);
		}

		this.typeAheadEl.css({
			width: this.inputField.outerWidth(),
			top: inputOffset.top + this.inputField.outerHeight(),
			left: inputOffset.left
		});
	},

	renderItem: function (model) {
		var typeAheadItem = new TypeAheadItemView({
			model: model
		});

		this.typeAheadEl.find(this.options.list).append(typeAheadItem.render().el);
	},

	// Renders the view's template to the UI
	render: function () {
		var data;

		data = {
			typeAheadModifierClass: this.options.typeAheadModifierClass,
			typeAheadClass: this.options.typeAheadClass
		};

		if (this.typeAheadEl && this.typeAheadEl.length) {
			this.typeAheadEl.find(this.options.list).empty();
		} else {
			this.typeAheadEl = $(this.template(data));
			this.calculateWidthAndPos();
			this.typeAheadEl.appendTo(this.appendTarget);
		}

		this.collection.each(this.renderItem, this);

		// Maintains chainability
		return this;
	}

});
// Returns the View class
module.exports = typeAheadView;

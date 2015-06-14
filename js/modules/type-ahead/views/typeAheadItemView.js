/**
 * @module typeAheadItemView
 *
 * @author Andy Gutsche
 */

var Helpers = require('../../../utils/helpers');
var App = require('../../../app');
var $ = App.$;
var Handlebars = require('handlebars/runtime')['default'];
var Template = require('../../../templates/templates')(Handlebars);


var typeAheadItemView = App.ComponentView.extend({
	tagName: 'li',
	className: function () {
		var markerClassName = 'type-ahead__item';

		return markerClassName;
	},

	// Options
	options: {
		template: 'CTYPEAHEAD__ITEM'
	},

	events: {
		"click [data-js-atom='item-link']": "triggerSearch"
	},

	// View constructor
	initialize: function (obj) {
		this.options = Helpers.defaults(obj.options || {}, this.options);
		this.template = Template[this.options.template];
	},

	triggerSearch: function (e) {
		e.preventDefault();

		App.Vent.trigger('type-ahead:search', {
			'el': this.$el,
			'keyword': $(e.currentTarget).text()
		});
	},

	// Renders the view's template to the UI
	render: function () {
		this.$el.html(this.template(this.model.toJSON()));

		// Maintains chainability
		return this;
	}

});
// Returns the View class
module.exports = typeAheadItemView;

//     Links:
//     http://www.html5rocks.com/en/tutorials/webcomponents/customelements/
//     https://developer.mozilla.org/en-US/docs/DOM/DOM_Reference#HTML_interfaces

(function() {

	'use strict';

	// Initial Setup
	// -------------

	// Save a reference to the global object
	var root = this;

	// check for dependencies
	if (!root._) {
		throw new Error('In order to work with app.js you need to include underscore or lodash underscore!');
	}

	if (!root.Backbone) {
		throw new Error('In order to work with app.js you need to include backbone.js!');
	}

	// @borrows object Backbone.Events
	// The top-level namespace. All public ui classes and modules will
	// be attached to FHKL.ui.
	var App = root.App = {
		Vent: _.extend({}, Backbone.Events),
		ui: {}
	};


	return App;

}).call(this);

var App = require('../../app');
var $ = App.$;
var Handlebars = require('handlebars/runtime')['default'];
var Template = require('../../templates/templates')(Handlebars);
var Overlay = require('./ui-overlay');

"use strict";
var ui = App.ui;
var tagName = 'ui-overlay';
var isAttached = false;
var overlayOpen = false;
var overlayContent;
var view;
var overlayMarkup = Template['MOVERLAY'];

ui.OverlayInit = Object.create(HTMLElement.prototype);

function overlayExists() {
	return !!(document.querySelector(tagName));
}

function overlayCheck() {
	if (!overlayExists()) {
		$('body').append(overlayMarkup());
	}
}

App.Vent.on('overlay:populate', function(whichOverlayContent, open) {
	overlayContent = whichOverlayContent;
	overlayOpen = open;
	overlayCheck();

	if (isAttached && view) {
		view.render(whichOverlayContent, open);
	}
});

ui.OverlayInit.options = {};

ui.OverlayInit.View = null;

ui.OverlayInit.createdCallback = function() {};

ui.OverlayInit.attachedCallback = function() {
	view = new Overlay({
		el: this
	});

	view.render(overlayContent, overlayOpen);
	isAttached = true;
};

ui.OverlayInit.detachedCallback = function() {
	if (!this.View) return;

	this.View.remove();
};

ui.OverlayInit.attributeChangedCallback = function(name, previousValue, value) {
	// implement code for handling attribute changes
};

document.registerElement(tagName, {
	prototype: ui.OverlayInit
});

module.exports = ui.OverlayInit;

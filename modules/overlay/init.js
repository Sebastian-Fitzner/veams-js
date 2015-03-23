efine('ui.overlay-init', ['App', 'ui.overlay', 'text!modules/overlay/templates/ui-overlay.html'], function(App, Overlay, template) {
	"use strict";
	var ui = App.ui;
	var tagName = 'ui-overlay';
	var isAttached = false;
	var overlayOpen = false;
	var overlayContent;
	var view;
	var overlayMarkup = _.template(template);

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

	ui.OverlayInit.createdCallback = function() {
		view = new Overlay({
			el: this
		});
	};

	ui.OverlayInit.attachedCallback = function() {
		// view.render(overlayContent, overlayOpen);
		isAttached = true;
	};

	ui.OverlayInit.detachedCallback = function() {
		this.View.remove();
	};

	ui.OverlayInit.attributeChangedCallback = function(name, previousValue, value) {
		// implement code for handling attribute changes
	};

	document.registerElement(tagName, {
		prototype: ui.OverlayInit
	});

	return ui.OverlayInit;

});

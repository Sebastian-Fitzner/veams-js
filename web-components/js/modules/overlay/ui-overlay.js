define('ui.overlay', [
		'jquery',
		'backbone',
		'App',
		'text!modules/overlay/overlay-content.html'
	],
	function($, Backbone, App, template) {

		App.ui.Overlay = Backbone.View.extend({
			// Set standard options
			options: {
				isDebug: false,
				openClass: 'is-visible',
				content: '',
				url: '',
				type: 'figure', // figure, ajax, content
				caption: '',
				author: ''
			},
			isOpen: false,
			template: _.template(template),

			events: {
				'click [data-js-atom="overlay-close"]': 'onClick'
			},

			initialize: function(obj) {
				this.options = _.defaults(obj.options || {}, this.options); // get/set default options
			},

			onClick: function(evt) {
				evt.preventDefault();

				if (typeof this.clickHandler !== 'function') {
					this.clickHandler = this.close;
				}

				this.clickHandler.apply(this, arguments);
			},

			close: function() {
				this.$el.removeClass(this.options.openClass);
				if (this.overlayContentWrapper) {
					this.overlayContentWrapper.removeClass(this.options.openClass);
					this._resetStyles();
				}
				this.isOpen = false;
			},

			open: function() {
				this.$el.addClass(this.options.openClass);
				this.isOpen = true;
			},

			_getDimensionsAndShow: function() {
				var that = this;
				this.open();
				// get image dimensions to center wrapper
				setTimeout(function() {
					that._setDimension();
					that._fadeIn();
				}, 250);
			},

			_resetStyles: function() {
				this.overlayContentWrapper.removeAttr('style');
			},

			_setDimension: function() {
				var screenWidth = $(window).width(),
					width = this.$el.width() > screenWidth ? screenWidth : this.$el.width(),
					height = this.$el.height(),
					top = window.pageYOffset;


				this.overlayContentWrapper.css({
					'left': (screenWidth - width) / 2,
					'top': top,
					'width': width,
					'height': height
				});
			},

			_fadeIn: function() {
				var that = this;
				this.overlayContentWrapper.addClass(that.options.openClass);
			},

			render: function(obj, isOpen) {
				this.content = _.defaults(obj.options || {}, this.options);
				this.isOpen = typeof isOpen === 'boolean' ? isOpen : this.isOpen;
				this[this.isOpen ? 'open' : 'close']();

				this.overlayContentWrapper = this.$el.find('.overlay__wrapper');

				if (!this.content || !this.overlayContentWrapper.length) {
					return this;
				}

				this.overlayContentWrapper.html(this.template(this.content));

				this._resetStyles();
				this._getDimensionsAndShow();

				return this;
			}
		});
		// Returns the View class
		return App.ui.Overlay;
	}
);

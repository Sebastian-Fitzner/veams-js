define('ui.overlay', [
		'jquery',
		'backbone',
		'App',
		'text!modules/overlay/templates/overlay-content.html',
		'text!modules/overlay/templates/overlay-gallery.html'
	],
	function($, Backbone, App, tplContent, tplGallery) {

		App.ui.Overlay = Backbone.View.extend({
			// Set standard options
			options: {
				isDebug: false,
				openClass: 'is-visible',
				content: '',
				url: '',
				type: 'figure', // figure, ajax, content, gallery
				caption: '',
				author: ''
			},
			isOpen: false,

			events: {
				'click [data-js-atom="overlay-close"]': 'onClick'
			},

			initialize: function(obj) {
				this.options = _.defaults(obj.options || {}, this.options); // get/set default options
				this.tplContent = _.template(tplContent);
				this.tplGallery = _.template(tplGallery);
			},

			onClick: function(evt) {
				evt.preventDefault();
				this.close();
			},

			close: function() {
				$('body').removeClass('isnt-scrollable');
				this.$el.removeClass(this.options.openClass);
				if (this.overlayContentWrapper) {
					this.overlayContentWrapper.removeClass(this.options.openClass);
					this._resetStyles();
				}
				this.isOpen = false;
			},

			open: function() {
				$('body').addClass('isnt-scrollable');
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
				this.$el.removeAttr('style');
			},

			_setDimension: function() {
				var screenWidth = $(window).width(),
					width = this.$el.width() > screenWidth ? screenWidth : this.$el.width(),
					height = $(window).height();


				this.$el.css({
					'width': width,
					'height': height
				});
			},

			_fadeIn: function() {
				var that = this;
				this.overlayContentWrapper.addClass(that.options.openClass);
			},

			render: function(obj, isOpen) {
				this.options = _.defaults(obj.options || {}, this.options);
				this.isOpen = typeof isOpen === 'boolean' ? isOpen : this.isOpen;
				this[this.isOpen ? 'open' : 'close']();
				this.overlayContentWrapper = this.$el.find('.overlay__wrapper');

				if (!this.options || !this.overlayContentWrapper.length) {
					return this;
				}

				this.$el.removeClass();
				this._renderType(obj);

				this._resetStyles();
				this._getDimensionsAndShow();

				return this;
			},

			_renderType: function(obj) {
				switch (this.options.type) {
					case 'gallery':
						this.$el.addClass('m-overlay--gallery');
						this._buildGallery(obj.el[0]);
						this.overlayContentWrapper.html(this.tplGallery(this.buttons));
						break;
					case 'figure':
						this.$el.addClass('m-overlay--figure');
						this.overlayContentWrapper.html(this.tplContent(this.options));
						break;
					default:
						this.$el.addClass('m-overlay');
						this.overlayContentWrapper.html(this.tplContent(this.options));
				}
			},

			_buildGallery: function(button) {
				this.context = $(button).closest(this.options.context);
				this.buttons = this.context.find('ui-button');
				var index = _.indexOf(this.buttons, button);

				if (index !== 0) {
					setTimeout(function() {
						App.Vent.trigger('CarouselView:changeSlide', {
							slideIndex: index + 1,
							direction: "next"
						})
					}, 150);
				}

			}
		});
		// Returns the View class
		return App.ui.Overlay;
	}
);

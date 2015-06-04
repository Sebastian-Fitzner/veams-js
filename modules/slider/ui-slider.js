var $ = require('jquery');
var App = require('../../app');
var Helpers = require('../../utils/helpers');
require('touchswipe')($);

App.ui.Slider = App.ComponentView.extend({

	options: {
		activeClass: 'is-active',
		hiddenClass: 'is-hidden',
		prev: '[data-js-atom="slider-prev"]',
		next: '[data-js-atom="slider-next"]',
		thumbs: '[data-js-atom="slider-item"]',
		ribbon: '[data-js-atom="slider-ribbon"]',
		wrapper: '[data-js-atom="slider-wrapper"]',
		startAtIndex: 1,
		visibleItems: {
			'desktop-l': 2,
			'desktop': 2,
			'tablet-l': 2,
			'tablet-p': 1,
			'mobile-l': 1,
			'mobile-p': 1,
			'mobile-s': 1
		}
	},

	// View Event Handlers
	events: {
		'click [data-js-atom="slider-next"]': 'showNextElement',
		'click [data-js-atom="slider-item"]': 'navigateToElement',
		'click [data-js-atom="slider-prev"]': 'showPrevElement'
	},

	// View constructor
	initialize: function(obj) {
		this.options = Helpers.defaults(obj.options || {}, this.options);

		this.index = 0;
		this.slideIndex = 0;
		this.prev = this.$el.find(this.options.prev);
		this.next = this.$el.find(this.options.next);
		this.thumbs = this.$el.find(this.options.thumbs);
		this.wrapper = this.$el.find(this.options.wrapper);
		this.ribbon = this.$el.find(this.options.ribbon);
		this.startAtIndex = ~~this.options.startAtIndex;

		this._bindEvents();
		this.$el.removeClass('state-unresolved');
	},

	navigateToElement: function(e) {
		var _this = this;

		if ($(e.currentTarget).hasClass(this.options.activeClass)) return;

	},

	showNextElement: function(e) {
		if (e) {
			e.preventDefault();
		}

		this.gotoThumb(this.index + this.numVisible);
	},

	showPrevElement: function(e) {
		if (e) {
			e.preventDefault();
		}

		this.gotoThumb(this.index - this.numVisible);
	},

	/**
	 * Return the direction `next` or `prev`.
	 *
	 * @param {number} index - Index of the pagination element.
	 */
	getDirection: function(index) {
		return index > this.slideIndex ? "next" : "prev";
	},

	_bindEvents: function() {
		var _this = this;

		this.listenTo(App.Vent, 'resize', setTimeout(function() {
			_this._initThumbSlider();
			_this.getAndSetDimensions();
			_this.gotoThumb(_this.index);
		}), 300);
	},

	bindSwipes: function() {
		var _this = this;

		if (this.thumbs.length > this.numVisible) {
			this.$el.swipe({
				swipeLeft: function(event, direction, distance, duration, fingerCount) {
					_this.gotoThumb(_this.index + _this.numVisible);
				},
				swipeRight: function(event, direction, distance, duration, fingerCount) {
					_this.gotoThumb(_this.index - _this.numVisible);
				},
				threshold: 75,
				excludedElements: 'input, select, textarea, .js-no-swipe'
			});
		}
	},

	gotoThumb: function(i) {
		var maxIndex = this.thumbs.length - this.numVisible;

		if (i <= 0) {
			i = 0;
			this.prev.addClass(this.options.hiddenClass);
		} else {
			if (this.prev.is('.' + this.options.hiddenClass)) {
				this.prev.removeClass(this.options.hiddenClass);
			}
		}

		if (i >= maxIndex) {
			i = maxIndex;
			this.next.addClass(this.options.hiddenClass);
		} else {
			if (this.next.is('.' + this.options.hiddenClass)) {
				this.next.removeClass(this.options.hiddenClass);
			}
		}

		this.ribbon.css('left', -i * (this.thumbWidth + this.margin * 2));
		this.index = i;

		this.thumbs.removeClass(this.options.activeClass);
		this.thumbs.eq(i).addClass(this.options.activeClass);
		this.thumbs.eq(i + 1).addClass(this.options.activeClass);
	},

	/**
	 * Get and set dimensions for our project progress.
	 */
	getAndSetDimensions: function() {
		this.width = this.$el.outerWidth();
		this.margin = parseInt(this.thumbs.eq(0).css('margin-right'), 10);
		this.thumbWidth = this.width / this.numVisible - this.margin;
		this.wrapper.css('width', this.width);
		this.thumbs.css('width', this.thumbWidth);

		this.thumbHeight = this.getSlideHeight(); // get max height of slides
		this.setSlideHeight(this.thumbHeight); // set height to each slide element

		this.ribbon.css({
			'position': 'absolute',
			'width': this.getRibbonWidth()
		});

	},

	/**
	 * Get ribbon width.
	 */
	getRibbonWidth: function() {
		var width;

		if (this.thumbs.length <= this.numVisible) {
			width = this.thumbs.length * (this.thumbWidth + this.margin * 2);
		} else {
			width = this.thumbs.length * (this.thumbWidth + this.margin * 2);
		}

		return width;
	},

	/**
	 * Return height of the largest slide.
	 */
	getSlideHeight: function() {
		var height = 0;

		this.thumbs.each(function(i) {
			height = $(this).outerHeight(true) > height ? $(this).outerHeight(true) : height;
		});

		return height;
	},

	/**
	 * Set height for slides wrapper and each slide.
	 * @param {number} height - Height value
	 */
	setSlideHeight: function(height) {
		this.ribbon.css({
			'height': height
		});
		this.wrapper.css({
			'height': height
		});
	},

	_initThumbSlider: function() {
		if (this.thumbs.length === 0) {
			this.$el.hide();
			return;
		}

		this.$el.css('max-width', 'none');
		this.numVisible = this.options.visibleItems[App.currentMedia];
	},

	// Renders the view's template to the UI
	render: function() {
		this._initThumbSlider();
		this.getAndSetDimensions();
		this.bindSwipes();
		this.gotoThumb(this.startAtIndex);

		// Maintains chainability
		return this;
	}
});

// Returns the View class
module.exports = App.ui.Slider;

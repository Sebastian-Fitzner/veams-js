// Needs some love to support a more gentle way to handle visible items
/**
 * Represents a responsive slider as custom element.
 * @module slider
 *
 * @author Sebastian Fitzner
 */

import App from '../../app';
import Helpers from '../../utils/helpers';
var $ = App.$;
require('touchswipe')($);

class Slider extends App.ComponentView {
	/**
	 * Options for the view
	 */
	get _options() {
		return {
			activeClass: 'is-active',
			hiddenClass: 'is-hidden',
			actions: '[data-js-atom="slider-actions"]', // Previous Button
			prev: '[data-js-atom="slider-prev"]', // Previous Button
			next: '[data-js-atom="slider-next"]', // Next Button
			items: '[data-js-atom="slider-item"]', // Slide Items
			pagination: '[data-js-atom="slider-pagination"]', // Pagination
			paginationList: '[data-js-atom="slider-pagination-list"]', // Pagination List
			paginationItemClass: '.slider__pagination-list-item', // Define your class which we use in our mini tmpl
			ribbon: '[data-js-atom="slider-ribbon"]',
			wrapper: '[data-js-atom="slider-wrapper"]',
			startAtIndex: 0,
			visibleItems: {
				'desktop': 1,
				'tablet-large': 1,
				'tablet-small': 1,
				'mobile-large': 1,
				'mobile-medium': 1,
				'mobile-small': 1
			}
		}
	}

	/**
	 * Set method for options
	 */
	set _options(opts) {
		this.options = opts;
	}

	/**
	 * Events method
	 */
	get events() {
		return {
			'click [data-js-atom="slider-next"]': 'showNextElement',
			'touchstart [data-js-atom="slider-next"]': 'showNextElement',
			'click [data-js-atom="slider-prev"]': 'showPrevElement',
			'touchstart [data-js-atom="slider-prev"]': 'showPrevElement',
			'click [data-js-atom="slider-pagination-item"]': 'navigateToElement',
			'touchstart [data-js-atom="slider-pagination-item"]': 'navigateToElement'
		}
	}

	/**
	 * Custom getters and setter
	 */

	/**
	 * Get and set visible items.
	 *
	 * @param {number} visible - Number of visible items
	 */
	get _visibles() {
		return this.numVisible;
	}

	set _visibles(visible) {
		this.numVisible = visible;
	}

	/**
	 * Get and set items length for slider.
	 *
	 * @param {number} len - Number of item length
	 */
	get _itemsLength() {
		return this.itemLength;
	}

	set _itemsLength(len) {
		this.itemLength = len;
	}

	/**
	 * Get and set the index of slider.
	 *
	 * @param {number} idx - index number of slide
	 */
	get _index() {
		return this.index;
	}

	set _index(idx) {
		this.index = idx;
	}

	/**
	 * Get controls height.
	 */
	get _controlHeight() {
		return Helpers.getOuterHeight(this.prev);
	}

	/**
	 * Initialize the view and merge options
	 *
	 * @param {obj} obj - contains options as JSON which will be merged with predefined options
	 */
	initialize(obj) {
		this._options = Helpers.defaults(obj.options || {}, this._options);
		this._index = 0;

		this.slideIndex = 0;
		this.prev = this.$el.find(this.options.prev);
		this.next = this.$el.find(this.options.next);
		this.actions = this.$el.find(this.options.actions);
		this.items = this.$el.find(this.options.items);
		this.wrapper = this.$el.find(this.options.wrapper);
		this.ribbon = this.$el.find(this.options.ribbon);
		this.pagination = this.$el.find(this.options.pagination);
		this.paginationList = this.$el.find(this.options.paginationList);
		this.startAtIndex = ~~this.options.startAtIndex;

		this.bindEvents();
		this.$el.removeClass('state-unresolved');
	}

	/**
	 * Bind all events
	 */
	bindEvents() {
		App.Vent.on(App.Events.resize, this.render, this);
	}

	// Renders the view's template to the UI
	render() {
		this._visibles = this.options.visibleItems[App.currentMedia];
		this._itemsLength = this.items.length;

		this.handleVisibility();
		this.removePagination();
		this.addPagination();
		this.getAndSetDimensions();
		this.bindSwipes();
		this.goToItem(this.startAtIndex);

		// Maintains chainability
		return this;
	}

	/**
	 * When items length is 0 we hide this view.
	 */
	handleVisibility() {
		if (this._itemsLength === 0) {
			this.$el.addClass(this.options.hiddenClass);
			throw new Error('There is no item we can use in our slider :(');
		}

		this.$el.css('max-width', 'none');
	}

	/**
	 * Empty pagination.
	 */
	removePagination() {
		this.paginationList.empty();
	}

	/**
	 * Add pagination elements with a simple string template and
	 * save a pagination item reference.
	 */
	addPagination() {
		let paginationItemClass = 'slider__pagination-list-item';
		let tmpl = this.items.map(function(i) {
			return $('<li class="' + paginationItemClass + '" data-js-atom="slider-pagination-item"><strong>' + (i + 1) + '</strong></li>')[0];
		});

		this.paginationList.append(tmpl);
		this.paginationItems = $('.slider__pagination-list-item', this.$el);
	}

	/**
	 * Navigate to a specific slide.
	 *
	 * @param {object} e - Event object.
	 */
	navigateToElement(e) {
		if ($(e.currentTarget).hasClass(this.options.activeClass)) return;

		this._index = $(e.currentTarget).index();

		this.goToItem(this._index);
	}

	/**
	 * Go to the next slide.
	 *
	 * @param {object} e - Event object.
	 */
	showNextElement(e) {
		if (e) {
			e.preventDefault();
		}

		this.goToItem(this._index + this.numVisible);
	}

	/**
	 * Go to the previous slide.
	 *
	 * @param {object} e - Event object.
	 */
	showPrevElement(e) {
		if (e) {
			e.preventDefault();
		}

		this.goToItem(this._index - this.numVisible);
	}

	/**
	 * Return the direction `next` or `prev`.
	 *
	 * @param {number} index - Index of the pagination element.
	 */
	getDirection(index) {
		return index > this.slideIndex ? "next" : "prev";
	}

	/**
	 * Bind all swipe gestures.
	 */
	bindSwipes() {
		var _this = this;

		if (this.items.length > this.numVisible) {
			this.$el.swipe({
				swipeLeft: function() {
					_this.goToItem(_this.index + _this.numVisible);
				},
				swipeRight: function() {
					_this.goToItem(_this.index - _this.numVisible);
				},
				threshold: 75,
				excludedElements: '.isnt-swipeable'
			});
		}
	}

	/**
	 * Handles the method to go to a specific item.
	 * Further we handle the class
	 *
	 * @param {number} i - Index number.
	 */
	goToItem(i) {
		var maxIndex = this.items.length - this.numVisible;

		if (i < 0) {
			i = maxIndex;
		} else if (i > maxIndex) {
			i = 0;
		}

		this.ribbon.css('left', -i * (this.thumbWidth + this.margin * 2));
		this._index = i;

		this.items.removeClass(this.options.activeClass);
		this.paginationItems.removeClass(this.options.activeClass);

		this.items.eq(i).addClass(this.options.activeClass);
		this.paginationItems.eq(i).addClass(this.options.activeClass);
	}

	/**
	 * Get and set dimensions for our project progress.
	 */
	getAndSetDimensions() {
		this.width = this.$el.outerWidth();
		this.margin = parseInt(this.items.eq(0).css('margin-right'), 10);
		this.thumbWidth = this.width / this.numVisible - this.margin;
		this.wrapper.css('width', this.width);
		this.items.css('width', this.thumbWidth);

		// this.thumbHeight = this.getSlideHeight(); // get max height of slides
		// this.setSlideHeight(this.thumbHeight); // set height to each slide element

		this.ribbon.css({
			'width': this.getRibbonWidth()
		});
	}

	/**
	 * Get ribbon width.
	 */
	getRibbonWidth() {
		var width;

		if (this.items.length <= this.numVisible) {
			width = this.items.length * (this.thumbWidth + this.margin * 2);
		} else {
			width = this.items.length * (this.thumbWidth + this.margin * 2);
		}

		return width;
	}

	/**
	 * Return height of the largest slide.
	 */
	getSlideHeight() {
		var height = 0;

		this.items.each(function(i) {
			height = $(this).outerHeight(true) > height ? $(this).outerHeight(true) : height;
		});

		return height;
	}

	/**
	 * Set height for slides wrapper and each slide.
	 * @param {number} height - Height value
	 */
	setSlideHeight(height) {
		this.ribbon.css({
			'height': height
		});
		this.wrapper.css({
			'height': height
		});
	}
}

App.ui.Slider = Slider;

export default App.ui.Slider;
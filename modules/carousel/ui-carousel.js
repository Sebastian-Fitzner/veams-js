/**
 * A module representing a carousel.
 * @module Carousel
 *
 * @author Sebastian Fitzner
 */

define('ui.carousel', [
		'App',
		'jquery',
		'backbone',
		'helpers',
		'modules/carousel/ui-carousel-pagination',
		'touchSwipe',
		'utils/mixins/imageLoader'
	],
	function(App, $, Backbone, Helpers, Pagination, TouchSwipe, ImageLoader) {
		/**
		 * @alias module:Carousel
		 */
		App.ui.Carousel = Backbone.View.extend({
			/** Standard options of our class */
			options: {
				responsive: false,
				slides: '[data-js-atom="carousel-list"]',
				currentClass: 'is-current',
				unresolvedClass: 'js-unresolved',
				slideFadeClass: 'carousel__slides-visible',
				slideLeftInFX: 'carousel__slide-left-in-fx',
				slideLeftOutFX: 'carousel__slide-left-out-fx',
				slideRightInFX: 'carousel__slide-right-in-fx',
				slideRightOutFX: 'carousel__slide-right-out-fx ',
				carouselPager: '[data-js-atom="pagination"]'
			},

			/** Standard events of our constructor */
			events: {
				'click [data-js-atom="navigation-prev"]': 'showPreviousElement',
				'click [data-js-atom="navigation-next"]': 'showNextElement'
			},

			/**
			 * Initialize our view and merge our options from `data-js-options`.
			 * This method saves some important elements in `this`.
			 *
			 * @param {object} obj - Passed object with options and our element
			 */
			initialize: function(obj) {
				this.options = _.defaults(obj.options || {}, this.options); // get/set default options
				this.slides = this.$el.find(this.options.slides); // slide container
				this.slide = this.slides.children(); // slides
				this.carouselPager = this.$el.find(this.options.carouselPager);
				this.currentSlideIndex = 1; // current slide index
				this.lastSlide = 1; // last slide el
			},

			/**
			 * Initialize some carousel settings.
			 * - check responsive option and execute `_makeItResponsive`
			 * - change `this.slide` when `responsive=true`
			 * - add class `js-not-responsive` when `responsive=false`
			 * - get carousel length
			 */
			_buildCarousel: function() {
				if (this.options.responsive === true && !this.$el.find('[data-js-atom="carousel-list-group"]').length) {
					this._makeItResponsive();
					this.slide = this.slides.find('[data-js-atom="carousel-list-group"]');
				} else {
					this.$el.addClass('js-not-responsive');
				}

				this.slideLength = this.getCarouselLength(); // get slide length
			},

			/**
			 * Return carousel length.
			 */
			getCarouselLength: function() {
				return this.slide.length;
			},

			/**
			 * Group visible elements with `.carousel__list-group`.
			 */
			_makeItResponsive: function() {
				var that = this,
					itemsVisibleAtOnce;

				this.carouselWidth = this.$el.outerWidth();
				this.slidesWidth = this.slide.outerWidth();
				this.slidePanels = [];

				itemsVisibleAtOnce = Math.floor(this.carouselWidth / this.slidesWidth);

				$.each(this.slide, function(i, slide) {
					if (i % itemsVisibleAtOnce === 0) {
						that.slidePanels.push($('<div class="carousel__list-group" data-js-atom="carousel-list-group"/>').appendTo(that.slides));
					}
					$(slide).appendTo(that.slidePanels[that.slidePanels.length - 1]);
				});
			},

			/**
			 * Hide pagination when length is smaller than 2.
			 */
			_hidePaginationByOneSlide: function() {
				if (this.slideLength <= 1) {
					this.$el.addClass('js-hide-pagination');
				}
			},

			/**
			 * Get first slide and add `options.currentClass` and `options.slideNextInFX`.
			 */
			getFirstSlide: function() {
				var firstSlide = this.slide.eq(0);

				firstSlide
					.addClass(this.options.currentClass)
					.addClass(this.options.slideFadeClass);
			},

			/**
			 * Get and set dimensions for our carousel.
			 */
			getAndSetSlideDimensions: function() {
				this._deleteStyles(); // delete styles

				this.slideWidth = this.getSlideWidth(); // get max width of slides
				this.slideHeight = this.getSlideHeight(); // get max height of slides

				this.setSlideWidth(this.slideWidth); // set width to each slide element
				this.setSlideHeight(this.slideHeight); // set height to each slide element
			},

			/**
			 * Return height of the largest slide.
			 */
			getSlideHeight: function() {
				var height = 0;

				this.slide.each(function(i) {
					height = $(this).outerHeight(true) > height ? $(this).outerHeight(true) : height;
				});

				return height;
			},

			/**
			 * Return width of the carousel wrapper.
			 */
			getSlideWidth: function() {
				var width = this.carouselWidth;

				return width;
			},

			/**
			 * Set height for slides wrapper and each slide.
			 * @param {number} height - Height value
			 */
			setSlideHeight: function(height) {
				this.slides.css({
					'height': height
				});
				this.slide.css({
					'height': height
				});
			},

			/**
			 * Set width for slides wrapper and each slide.
			 * @param {number} width - Width value
			 */
			setSlideWidth: function(width) {
				this.slides.css({
					'width': width
				});

				this.slide.css({
					'width': width
				});
			},

			/**
			 * Collect all events.
			 * For swipe support we use `touchSwipe.js`.
			 * - `swipeLeft`: executes `changeSlide()` with direction `next`
			 * - `swipeRight`: executes `changeSlide()` with direction `prev`
			 *
			 * To execute swiping on link elements, we redefine `excludeElements`
			 */
			_bindEvents: function() {
				var that = this;

				if (this.slideLength > 1) {
					this.$el.swipe({
						swipeLeft: function(event, direction, distance, duration, fingerCount) {
							that.changeSlide({
								direction: 'next'
							});
						},
						swipeRight: function(event, direction, distance, duration, fingerCount) {
							that.changeSlide({
								direction: 'prev'
							});
						},
						threshold: 75,
						excludedElements: 'input, select, textarea, .js-no-swipe'
					});
				}

				App.Vent.on('CarouselView:changeSlide', this.changeSlide, this);

				this.carouselPager.on('CarouselPagerView:changeSlide', function(e, opts) {
					that.changeSlide(opts);
				});

				this.listenTo(App.Vent, 'resize', _.debounce(function() {
					that.getAndSetSlideDimensions();
				}, 300));
			},

			/**
			 * Delete all styles on slides wrapper and slide element.
			 */
			_deleteStyles: function() {
				this.slides.removeAttr('style');
				this.slide.each(function() {
					$(this).removeAttr('style');
				});
			},

			/**
			 * Main function to navigate in our carousel.
			 * @param {object} opts - options: `slideIndex`, `direction`
			 */
			changeSlide: function(opts) {
				// var newSlide;

				// Update our current slide index
				this.setCurrentSlideIndex(opts);

				// Set the new slide which we can use in other functions
				// newSlide = this.setNewSlide(this.slide);

				// Animate to the new slide and deliver some parameters
				this.animateToNewSlide(this.slide, opts.direction);
			},

			/**
			 * Set the current slide index.
			 * @param {object} opts - options: `slideIndex`, `direction`
			 */
			setCurrentSlideIndex: function(opts) { // When we are changing the URL go to the specific index
				// if slideIndex has a value in opts
				if (opts.slideIndex) {
					// set the current slide index to the value we get from opts
					this.lastSlide = this.currentSlideIndex;
					return this.currentSlideIndex = ~~opts.slideIndex; // ~~ is a shortcut for Number()
				}

				// Set the var lastSlide with getting the old value out of currentSlideIndex
				this.lastSlide = this.currentSlideIndex;

				// And update currentSlideIndex with values we get from opts
				this.currentSlideIndex += opts.direction === 'next' ? 1 : -1;

				// If currentSlideIndex is greater than slide length go back to first slide
				if (this.currentSlideIndex > this.slideLength) {
					this.currentSlideIndex = 1;
				}

				// If currentSlideIndex is smaller than 0 go to last slide
				if (this.currentSlideIndex <= 0) {
					this.currentSlideIndex = this.slideLength;
				}

			},

			/**
			 * Animate to our new slide.
			 * - Remove all classes from `slides`
			 * - Get the direction and define it as number
			 * - Add classes to our active and previous slide
			 * - Trigger an event for our pagination
			 *
			 * @param {object} slides - All slides
			 * @param {string} direction - Provide a direction: `next`, `prev`
			 */
			animateToNewSlide: function(slides, direction) {
				// First we remove all classes from all slides
				var width = this.slideWidth;
				var dir = direction === 'next' ? -1 : 1;


				// First we remove all classes from all slides
				slides
					.removeClass(this.options.slideLeftInFX + " " +
						this.options.slideLeftOutFX + " " +
						this.options.slideRightInFX + " " +
						this.options.slideRightOutFX + " " +
						this.options.slideFadeClass + " " +
						this.options.currentClass
					);

				// If dir is next
				if (direction === 'next') {
					// Add classes to the last and current slide
					slides.eq(this.lastSlide - 1)
						.addClass(this.options.currentClass + " " + this.options.slideLeftOutFX);

					slides.eq(this.currentSlideIndex - 1)
						.addClass(this.options.currentClass + " " + this.options.slideLeftInFX);

				} else { // else
					// Add classes to the last and current slide
					slides.eq(this.lastSlide - 1)
						.addClass(this.options.currentClass + " " + this.options.slideRightOutFX);

					slides.eq(this.currentSlideIndex - 1)
						.addClass(this.options.currentClass + " " + this.options.slideRightInFX);

				}

				this.$el.trigger('CarouselView:changeSlide', this.currentSlideIndex - 1);
			},

			/**
			 * Navigate to the previous element by executing `changeSlide` and providing the direction `prev`.
			 * @param {event} e - Event
			 */
			showPreviousElement: function(e) {
				if (this.slideLength > 1) {
					this.changeSlide({
						direction: 'prev'
					});
				}
			},


			/**
			 *  Navigate to the next element by executing `changeSlide` and providing the direction `next`.
			 * @param {event} e - Event
			 */
			showNextElement: function(e) {
				if (this.slideLength > 1) {
					this.changeSlide({
						direction: 'next'
					});
				}
			},

			/**
			 * Create a new pagination.
			 */
			initPagination: function() {
				var that = this;

				/**
				 * @constructor
				 */
				var pager = new Pagination({
					el: that.carouselPager
				}).render();

				return pager;
			},


			/**
			 * Render the view's template.
			 */
			render: function() {
				this._buildCarousel();
				this._hidePaginationByOneSlide();
				this.getFirstSlide();
				this.getAndSetSlideDimensions();
				this._bindEvents();
				this.initPagination();

				this.$el.removeClass(this.options.unresolvedClass);

				// Maintains chainability
				return this;
			}

		});

		/** Use mixin to extend our view with `ImageLoader` */
		App.ui.Carousel.mixin(ImageLoader);

		// Returns the View class
		return App.ui.Carousel;
	}
);

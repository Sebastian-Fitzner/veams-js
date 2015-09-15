/**
 * @module Slide Fox
 *
 * @author Andy Gutsche
 * @refactoring Sebastian Fitzner
 */

import Helpers from '../../utils/helpers';
import App from '../../app';

var $ = App.$;

class SlideFox {
	constructor(obj) {
		this.el = obj.el;
		this.$el = $(obj.el);

		this.options = {
			visibleClass: 'is-visible'
		};

		this.options = Helpers.defaults(obj.options || {}, this.options);

		this.initialize();
	}

	initialize() {
		this.bindEvents();
	}

	bindEvents() {
		App.Vent.on(App.Events.scroll, this.render.bind(this));
	}

	showSlideFox() {
		this.$el.addClass(this.options.visibleClass);
	}

	hideSlideFox() {
		this.$el.removeClass(this.options.visibleClass);
	}

	render() {
		Helpers.isInViewport(this.$el) ? this.showSlideFox() : this.hideSlideFox();
	}
}

// Returns the constructor
export default SlideFox;
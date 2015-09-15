/**
 * Represents a view.
 * @class ElementsView
 *
 * Use the get keyword to make our methods serve as getters for a property.
 * This means they will be accessible as properties, but defined as methods,
 * retaining compatibility with any existing references if you're converting existing code.
 *
 * @author Sebastian Fitzner
 */

import App from '../../../app';
import Helpers from '../../../utils/helpers';
import Tpl from '../../../templates/templates';
import ElementView from './results-item-view';

let $ = App.$;

// Creates a new view class object
class ElementsView extends App.ComponentView {

// options property
	get _options() {
		return {
			itemsPerPage: 12
		}
	}

	// set options
	set _options(opts) {
		this.options = opts;
	}

	initialize(obj) {
		this._options = Helpers.defaults(obj.options || {}, this._options);

		this.bindEvents();
	}

	bindEvents() {
		App.Vent.on(App.Events.paginationRendered, this.handleData.bind(this))
	}

	// Renders the view's template to the UI
	render() {
		this.completeCollection = this.collection;
		this.handleData({
			index: 1,
			offsetIndex: {
				start: 1,
				end: this.options.itemsPerPage
			}
		});

		// Maintains chainability
		return this;
	}

	renderOne(model) {
		let elementView = new ElementView({
			model: model
		});

		this.$el.append(elementView.render().el); // Append the new view to $el
	}

	renderAll(modCol) {
		let collection = modCol ? modCol : this.completeCollection;

		// renderAll() cleans up the $el
		this.$el.empty();

		// Each element in collection we start render()
		collection.forEach(this.renderOne, this);
	}

	handleData(obj) {
		let visibleCollection = this.completeCollection.filter((item, index) => {
			let idx = index + 1;

			if (idx >= obj.offsetIndex.start && idx <= obj.offsetIndex.end) {
				return item;
			}
		});

		this.renderAll(visibleCollection);
	}
}

// Returns the view class
export default ElementsView;

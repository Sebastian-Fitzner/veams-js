/**
 * Represents a view.
 * @class FormElementView
 *
 * Use the get keyword to make our methods serve as getters for a property.
 * This means they will be accessible as properties, but defined as methods,
 * retaining compatibility with any existing references if you're converting existing code.
 *
 * @author
 */

import App from '../../../app';
import Helpers from '../../../utils/helpers';
import Tpl from '../../../templates/templates';

let Handlebars = require('handlebars/runtime')['default'];
let $ = App.$;
let Template = Tpl(Handlebars);

// Creates a new view class object
class ElementView extends App.ComponentView {
	get template() {
		return Template['RESULTSITEM']; // Setting the view's template property using the handlebars template method
	}

	// options property
	get _options() {
		return {

		}
	}

	// set options
	set _options(opts) {
		this.options = opts;
	}

	initialize(obj) {
		this._options = Helpers.defaults(obj.options || {}, this._options);
	}

	// Renders the view's template to the UI
	render() {
		// Dynamically updates the UI with the view's template
		this.setElement(this.template(this.model.toJSON()));

		// Maintains chainability
		return this;
	}
}

// Returns the view class
export default ElementView;
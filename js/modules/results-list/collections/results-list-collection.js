/**
 * Represents a collection.
 * @class FormElementCollection
 *
 * Use the get keyword to make our methods serve as getters for a property.
 * This means they will be accessible as properties, but defined as methods,
 * retaining compatibility with any existing references if you're converting existing code.
 *
 * @author Sebastian Fitzner
 */

import App from '../../../app';
import ItemModel from '../models/results-item-model';

class ListCollection extends App.ComponentCollection {

	/**
	 * Get the models object
	 *
	 * @return obj
	 */
	get model() {
		// Tells the collection that all of it's models will be the type model (listed up top as a dependency)
		return ItemModel
	}
}

export default ListCollection;
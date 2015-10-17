let Helpers = window.Veams = window.Veams || {};

// ----------------------------------
// FUNCTIONAL HELPERS
// ----------------------------------

/**
 * Get dom elements in an array
 *
 * @param {String} el - Required: selector
 * @param {Object} [context] - Optional: context
 *
 * @return {Array}
 */
Helpers.querySelectorArray = function (el, context) {
	if (!el) throw new Error('In order to work with querySelectorArray you need to define an element as string!');
	var element = el;
	var customContext = context || document;

	return Array.prototype.slice.call((customContext).querySelectorAll(element));
};

export default Helpers;
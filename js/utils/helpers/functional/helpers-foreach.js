/**
 * @alias module:Helper
 */
let Helpers = window.Veams = window.Veams || {};

// ----------------------------------
// FUNCTIONAL HELPERS
// ----------------------------------

/**
 * Simple forEach method
 *
 * @param {Array} array - array of objects
 * @param {function} callback - callback function
 * @param {string} scope - scope of function
 */
Helpers.forEach = function (array, callback, scope) {
	for (var i = 0; i < array.length; i++) {
		callback.call(scope, i, array[i]);
	}
};


export default Helpers;
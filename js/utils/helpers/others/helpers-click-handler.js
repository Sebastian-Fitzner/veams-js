import '../detection/helpers-is-touch';

/**
 * @alias module:Helper
 */
let Helpers = window.Veams = window.Veams || {};

// ----------------------------------
// OTHER HELPERS
// ----------------------------------

/**
 * Determine click handler.
 *
 * @return {string}
 */
Helpers.clickHandler = function () {
	return Helpers.isTouch() ? 'touchstart' : 'click';
};

export default Helpers;
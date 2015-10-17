/**
 * @alias module:Helper
 */
let Helpers = window.Veams = window.Veams || {};

// ----------------------------------
// FUNCTIONAL HELPERS
// ----------------------------------

/**
 * Return new RegExp
 *
 * @param {string} regEx - Regular Expression
 *
 * @return {RegExp}
 */
Helpers.regExp = function (regEx) {
	return new RegExp("(^|\\s+)" + regEx + "(\\s+|$)");
};

export default Helpers;
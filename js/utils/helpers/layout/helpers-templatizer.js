/**
 * @alias module:Helper
 */
let Helpers = window.Veams = window.Veams || {};

// ----------------------------------
// LAYOUT HELPERS
// ----------------------------------

/**
 * Templatizer cleans up template tags and insert the inner html before the tag
 *
 * @param {Object} obj - Contains all properties
 * @param {string} obj.templateName - Defines the template name which is a selector from the element
 */
Helpers.templatizer = function (obj) {
	if (!'content' in document.createElement('template')) return;
	if (!obj && !obj.templateName) throw new Error('You need to pass a template namespace as string!');

	Helpers.querySelectorArray(obj.templateName).forEach(function (tpl) {
		let parent = tpl.parentNode;
		let content = tpl.content.children[0];

		parent.insertBefore(content, tpl);
	});
};

export default Helpers;
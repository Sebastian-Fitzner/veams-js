import Helpers from './functional/helpers-foreach';

/**
 * @alias module:Helper
 */
let Helpers = window.Veams = window.Veams || {};

// ----------------------------------
// MODULE HELPERS
// ----------------------------------

/**
 * Initialize a module and render it and/or provide a callback function
 *
 * @param {Object} obj - Definition of our module
 * @param {string} obj.el - Required: element
 * @param {Object} obj.Module - Required: class which will be used to render your module
 * @param {boolean} [obj.render=true] - Optional: render the class, if false the class will only be initialized
 * @param {function} [obj.cb] - Optional: provide a function which will be executed after initialisation
 * @param {Object} [obj.context] - Optional: context of module
 *
 */
Helpers.loadModule = function (obj) {
	if (!obj.el) throw new Error('In order to work with loadModule you need to define an element as string!');
	if (!obj.module) throw new Error('In order to work with loadModule you need to define a Module!');

	var moduleList = Helpers.querySelectorArray(obj.el, obj.context);
	var renderOnInit = obj.render !== false;

	Helpers.forEach(moduleList, (i, el) => {
		var attrs = el.getAttribute('data-js-options');
		var options = JSON.parse(attrs);

		var module = new obj.module({
			el: el,
			options: options
		});

		// Render after initial module loading
		if (renderOnInit) module.render();
		// Provide callback function in which you can use module and options
		if (obj.cb && typeof(obj.cb) === "function") obj.cb(module, options);
	});
};

export default Helpers;
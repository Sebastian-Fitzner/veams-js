/**
 * Represents a Helper Object.
 * @module Helper
 *
 * @author Sebastian Fitzner
 */

"use strict";

/**
 * @alias module:Helper
 */
let Helpers = {};

// ----------------------------------
// MODULE HELPERS
// ----------------------------------

/**
 * Save/Update DOM references for JS Modules
 *
 *
 */
Helpers.saveDOM = function() {
	Helpers.dataJsModules = Helpers.querySelectorArray('[data-js-module]');
};

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
Helpers.loadModule = function(obj) {
	if (!obj.domName) throw new Error('In order to work with loadModule you need to define the module name (defined in data-js-module attribute) as string! ');
	if (!obj.module) throw new Error('In order to work with loadModule you need to define a Module!');

	let context = obj.context || document.querySelector('html');
	let renderOnInit = obj.render !== false;


	Helpers.forEach(Helpers.dataJsModules, (i, el) => {
		let dataModules = el.getAttribute('data-js-module').split(' ');

		if (dataModules.indexOf(obj.domName) != -1 && Helpers.checkElementInContext(el, context)) {
			let attrs = el.getAttribute('data-js-options');
			let options = JSON.parse(attrs);
			let module = new obj.module({
				el: el,
				options: options
			});

			// Render after initial module loading
			if (renderOnInit) module.render();
			// Provide callback function in which you can use module and options
			if (obj.cb && typeof(obj.cb) === "function") obj.cb(module, options);
		}
	});
};

// ----------------------------------
// EXTENDING HELPERS
// ----------------------------------

/**
 * Simple extend method to extend the properties of an object.
 *
 * @param {Object} obj - object which will be extended
 *
 * @return {Object} obj - extended object
 */
Helpers.extend = function extend(obj) {
	[].slice.call(arguments, 1).forEach((item) => {
		for (let key in item) obj[key] = item[key];
	});
	return obj;
};

/**
 * Simple extend method, which extends an object.
 *
 * @param {Object} obj - object which will be extended
 *
 * @return {Object} obj - extended object
 */
Helpers.defaults = function defaults(obj) {
	[].slice.call(arguments, 1).forEach((item) => {
		for (let key in item) {
			if (obj[key] === undefined) obj[key] = item[key];
		}
	});
	return obj;
};

/**
 * Merge method functions.
 *
 * @param {Object} from - Mixin object which will be merged via Helpers.defaults with the methods of our class
 * @param {Array} methods - Array of method names which will be extended.
 */
Helpers.classMixin = function(from, methods = ['initialize', 'render']) {

	let to = this.prototype;

	/** Add those methods which exists on `from` but not on `to` to the latter */
	Helpers.defaults(to, from);

	/** we do the same for events */
	if (to.events) {
		Helpers.defaults(to.events, from.events);
	}

	// Extend to's methods
	methods.forEach((method) => {
		Helpers.extendMethod(to, from, method);
	});
};

/**
 * Helper method to extend an already existing method.
 *
 * @param {Object} to - view which will be extended
 * @param {Object} from - methods which comes from mixin
 * @param {string} methodName - function name
 */
Helpers.extendMethod = function(to, from, methodName) {
	function isUndefined(value) {
		return typeof value == 'undefined';
	}

	// if the method is defined on from ...
	if (!isUndefined(from[methodName])) {
		let old = to[methodName];

		// ... we create a new function on to
		to[methodName] = function() {

			// wherein we first call the method which exists on `to`
			let oldReturn = old.apply(this, arguments);

			// and then call the method on `from`
			from[methodName].apply(this, arguments);

			// and then return the expected result,
			// i.e. what the method on `to` returns
			return oldReturn;
		};
	}
};

// ----------------------------------
// FUNCTIONAL HELPERS
// ----------------------------------

/**
 * Get dom elements in an array
 *
 * @param {String} elem - Required: selector
 * @param {Object} [context] - Optional: context
 *
 * @return {Array}
 */
Helpers.querySelectorArray = Helpers.$ = function(elem, context) {
	if (!elem) throw new Error('In order to work with querySelectorArray you need to define an element as string!');
	let el = elem;
	let customContext = context || document;

	return Array.prototype.slice.call((customContext).querySelectorAll(el));
};

/**
 * Simple forEach method
 *
 * @param {Array} array - array of objects
 * @param {function} callback - callback function
 * @param {string} scope - scope of function
 */
Helpers.forEach = function(array, callback, scope) {
	for (let i = 0; i < array.length; i++) {
		callback.call(scope, i, array[i]);
	}
};

/**
 * Find index of a specific item in an array.
 *
 * @param {Array} array - array in which we search for
 * @param {Object} item - item which will be searched
 */
Helpers.indexOf = function(array, item) {
	if (array == null) return -1;
	let l;
	let i;

	for (i = 0, l = array.length; i < l; i++)
		if (array[i] === item) return i;
	return -1;
};

/**
 * Return new RegExp
 *
 * @param {string} regEx - Regular Expression
 *
 * @return {RegExp}
 */
Helpers.regExp = function(regEx) {
	return new RegExp("(^|\\s+)" + regEx + "(\\s+|$)");
};

/**
 * Throttle method for resize events and more
 *
 * @param {function} func - Function which will be executed.
 * @param {number} wait - number to wait in milliseconds.
 * @param {boolean} immediate - execute function immediately.
 */

Helpers.throttle = function(func, wait, immediate) {
	let timeout;

	return function() {
		let context = this;
		let args = arguments;
		let callNow = immediate && !timeout;
		let later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};

		clearTimeout(timeout);

		timeout = setTimeout(later, wait);

		if (callNow) func.apply(context, args);
	};
};

// ----------------------------------
// DETECTION HELPERS
// ----------------------------------

/**
 * Touch Detection
 */
Helpers.isTouch = function() {
	return 'ontouchstart' in window;
};

/**
 * Detect transitionend event.
 */
Helpers.transitionEndEvent = function() {
	let t;
	let el = document.createElement('fakeelement');
	let transitions = {
		'transition': 'transitionend',
		'OTransition': 'oTransitionEnd',
		'MozTransition': 'transitionend',
		'WebkitTransition': 'webkitTransitionEnd'
	};

	for (t in transitions) {
		if (el.style[t] !== undefined) {
			return transitions[t];
		}
	}
};

/**
 * Detect animationend event.
 */
Helpers.animationEndEvent = function() {
	let t;
	let el = document.createElement('fakeelement');
	let animations = {
		'animation': 'animationend',
		'OAnimation': 'oAnimationEnd',
		'MozAnimation': 'animationend',
		'WebkitAnimation': 'webkitAnimationEnd'
	};

	for (t in animations) {
		if (el.style[t] !== undefined) {
			return animations[t];
		}
	}
};

/**
 * Request animation frame
 *
 * @return {function}
 */
Helpers.requestAniFrame = function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
};

// ----------------------------------
// CHECK HELPERS
// ----------------------------------

/**
 * based on https://github.com/inuyaksa/jquery.nicescroll/blob/master/jquery.nicescroll.js
 *
 * Todo: merge with checkElementInContext
 * @return {boolean}
 */
Helpers.hasParent = function(e, p) {
	if (!e) return false;
	let el = e.target || e.srcElement || e || false;
	while (el && el != p) {
		el = el.parentNode || false;
	}
	return (el !== false);
};

/**
 * Check if element is in a specific context
 * and return state as boolean
 *
 * Todo: merge with hasParent
 * @param {Object} elem - Element, which will be checked
 * @param {Object} context - Context element, in which our element could persists
 *
 * @return {boolean}
 */
Helpers.checkElementInContext = function(elem, context) {
	let currentNode = elem;
	let contextNode = context || context;

	while (currentNode.parentNode) {
		currentNode = currentNode.parentNode;

		if (Helpers.checkNodeEquality(currentNode, contextNode)) {
			return true;
		}
	}

	return false;
};

/**
 * Check if node is really the same
 *
 * @param {Object} obj1 - Object, which we want to check
 * @param {Object} obj2 - Element, which we want to check against equality
 *
 * @return {boolean}
 */
Helpers.checkNodeEquality = function(obj1, obj2) {
	return (obj1 === obj2);
};


/**
 * Check if element is in viewport
 *
 * @param {Object} elem - Object, which we want to check
 * @param {boolean} useBounds - if true, whole element must be visible
 *
 * @return {boolean}
 */
Helpers.isInViewport = function(elem, useBounds) {
	let el = elem;
	let top = el.offsetTop;
	let left = el.offsetLeft;
	let width = el.offsetWidth;
	let height = el.offsetHeight;
	let cond = false;

	while (el.offsetParent) {
		el = el.offsetParent;
		top += el.offsetTop;
		left += el.offsetLeft;
	}

	if (useBounds) {
		cond = top >= window.pageYOffset && left >= window.pageXOffset && (top + height) <= (window.pageYOffset + window.innerHeight) && (left + width) <= (window.pageXOffset + window.innerWidth);
	} else {
		cond = top < (window.pageYOffset + window.innerHeight) && left < (window.pageXOffset + window.innerWidth) && (top + height) > window.pageYOffset && (left + width) > window.pageXOffset;
	}

	return cond;
};

// ----------------------------------
// LAYOUT HELPERS
// ----------------------------------

/**
 * Calculates the outer height for the given DOM element, including the
 * contributions of margin.
 *
 * @param {Object} elem - the element of which to calculate the outer height
 * @param {boolean} outer - add padding to height calculation
 *
 * @return {number}
 */
Helpers.getOuterHeight = function(elem, outer) {
	let el = elem;
	let height = el.offsetHeight;

	if (outer) {
		let style = getComputedStyle(el);
		height += parseInt(style.paddingTop) + parseInt(style.paddingBottom);
	}
	return height;
};

/**
 * Templatizer cleans up template tags and insert the inner html before the tag
 *
 * @param {Object} obj - Contains all properties
 * @param {string} obj.templateName - Defines the template name which is a selector from the element
 */
Helpers.templatizer = function(obj) {
	if (!'content' in document.createElement('template')) return;
	if (!obj && !obj.templateName) throw new Error('You need to pass a template namespace as string!');

	Helpers.querySelectorArray(obj.templateName).forEach(function(tpl) {
		let parent = tpl.parentNode;
		let content = tpl.content.children[0];

		parent.insertBefore(content, tpl);
	});
};

// ----------------------------------
// OTHER HELPERS
// ----------------------------------

/**
 * Determine click handler.
 *
 * @return {string}
 */
Helpers.clickHandler = function() {
	return Helpers.isTouch() ? 'touchstart' : 'click';
};

/**
 * Check if script is already added,
 * and returns true or false
 *
 * @param {string} url - URL to your script
 *
 * @return {boolean}
 */
Helpers.checkScript = function(url) {
	let x = document.getElementsByTagName("script");
	let scriptAdded = false;

	for (let i = 0; i < x.length; i++) {
		if (x[i].src == url) {
			scriptAdded = true;
		}
	}
	return scriptAdded;
};

/**
 * Load scripts asynchronous,
 * check if script is already added,
 * optional check if script is fully loaded and
 * execute callback function.
 *
 * @param {string} url - URL to your script
 * @param {function} callbackFn - callback function
 * @param {Object} callbackObj - this context
 */
Helpers.loadScript = function(url, callbackFn, callbackObj) {
	let scriptAdded = Helpers.checkScript(url);
	let script;

	if (scriptAdded === false) {
		script = document.createElement("script");
		script.src = url;
		document.body.appendChild(script);
	}

	if (callbackFn && typeof(callbackFn) === "function") {
		if (scriptAdded === true) {
			callbackFn.apply(callbackObj);
		} else {
			script.onreadystatechange = function() {
				if (x.readyState == 'complete') {
					callbackFn.apply(callbackObj);
				}
			};
			script.onload = function() {
				callbackFn.apply(callbackObj);
			};
		}
	}

	return false;
};

Helpers.hasClass = function(elem, className) {
	let el = elem;

	if ('classList' in document.documentElement) {
		return el.classList.contains(className);
	} else {
		return Helpers.regExp(className).test(el.className);
	}
};

Helpers.addClass = function(elem, className) {
	let el = elem;

	if ('classList' in document.documentElement) {
		el.classList.add(className);
	} else {
		if (!Helpers.hasClass(el, className)) {
			el.className = el.className + ' ' + className;
		}
	}
};

Helpers.removeClass = function(elem, className) {
	let el = elem;

	if ('classList' in document.documentElement) {
		el.classList.remove(className);
	}
	else {
		el.className = el.className.replace(Helpers.regExp(className), ' ');
	}
};


/**
 * Add/Update a parameter for given url
 *
 * @deprecated use Helpers.updateUrl instead
 * @param {String} url - url on which the parameter should be added / updated
 * @param {String} paramName - parameter name
 * @param {(String|Number)} paramValue - parameter value
 *
 * @return {String} - url
 */
Helpers.addParamToUrl = function(url, paramName, paramValue) {
	let params = {};

	params[paramName] = paramValue;

	return Helpers.updateUrl(url, params);
};


/**
 * Add/Update multiple parameters for given url
 *
 * @param {String} url - url on which parameters should be added / updated
 * @param {Object} params - parameters (name/value)
 *
 * @return {String} - resulting url
 */
Helpers.updateUrl = function(url, params) {
	let urlParts = url.split('?');
	let tmpParams = [];
	let originalParams = [];
	let newParams = [];
	let baseUrl = '';
	let property = '';
	let updated = false;
	let i = 0;
	let j = 0;

	for (property in params) {
		if (params.hasOwnProperty(property)) {
			tmpParams.push([property, '=', params[property]].join(''));
		}
	}

	baseUrl = urlParts[0];
	originalParams = urlParts.length > 1 ? urlParts[1].split('&') : [];

	for (i; i < tmpParams.length; i++) {
		updated = false;

		for (j = 0; j < originalParams.length; j++) {
			if (tmpParams[i] && originalParams[j].split('=')[0] === tmpParams[i].split('=')[0]) {
				originalParams[j] = tmpParams[i];
				updated = true;
				break;
			}
		}

		if (!updated) {
			newParams.push(tmpParams[i]);
		}
	}

	return ([baseUrl, '?', originalParams.concat(newParams).join('&')].join(''));
};


/**
 * Generates alphanumeric id.
 *
 * @param {Number} [length=5] - length of generated id.
 *
 * @return {String} - generated id
 */
Helpers.makeId = function(length) {
	let idLength = length || 5;
	let charPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let i = 0;
	let id = '';

	for (; i < idLength; i++)
		id += charPool.charAt(Math.floor(Math.random() * charPool.length));

	return id;
};

export default Helpers;
/**
 * Represents a DOM-Helper.
 * @module DOMHelper
 *
 * @author Andy Gutsche
 */

let DOMHelper = function (selector, context) {
	return new DOMWrapper(selector, context);
};


/**
 * Return DOM element created from given HTML string
 *
 * @param {String} htmlString - html string to parse
 * @return {Object} - DOM node
 */
DOMHelper.parseHTML = function (htmlString) {
	let parser = new DOMParser();
	let content = 'text/html';
	let DOM = parser.parseFromString(htmlString, content);

	// return element
	return DOM.body.childNodes[0];
};


/**
 * Send XMLHttpRequest
 *
 * @param {Object} obj - options
 * @param {String} [obj.type='GET'] - an alias for method
 * @param {String} obj.url - a string containing the URL to which the request is sent
 * @param {String} [obj.dataType='text'] - a string containing the URL to which the request is sent
 */
DOMHelper.ajax = function (obj) {
	let options = {
		type: obj.type || 'GET',
		url: obj.url,
		dataType: obj.dataType || 'text',
		success: obj.success || function () {
		},
		error: obj.error || function () {
		},
	};

	let request = new XMLHttpRequest();
	request.open(options.type, options.url, true);

	request.onload = function () {
		if (request.status >= 200 && request.status < 400) {
			let response;

			if (options.dataType === 'json') {
				response = JSON.parse(request.responseText);
			}
			else {
				response = request.responseText;
			}

			options.success(response);
		} else {
			options.error(request.status, request.statusText)
		}
	};

	request.onerror = function (e) {
		options.error(e.target.status);
	};

	request.send();
};


/**
 * DOM Wrapper
 *
 * @param {String} selector - selector
 * @param {Object} context - context node
 */
let DOMWrapper = function (selector, context) {
	let scope;

	// console.log('selector: ', selector);

	if (selector.nodeType) {
		this.nodeList = [selector];

		return;
	}

	if (selector.nodeList) {
		this.nodeList = selector.nodeList;

		return;
	}

	this.classListSupport = 'classList' in document.documentElement;

	if (context) {
		if (!context.nodeList.length) {
			this.nodeList = [];
			return;
		}

		scope = context.nodeList[0];
	}
	else {
		scope = document;
	}

	if (/^(#?[\w-]+|\.[\w-.]+)$/.test(selector)) {
		switch (selector.charAt(0)) {
			case '#':
				this.nodeList = [scope.getElementById(selector.substr(1))];
				break;
			case '.':
				let classes = selector.substr(1).replace(/\./g, ' ');
				this.nodeList = [].slice.call(scope.getElementsByClassName(classes));
				break;
			default:
				this.nodeList = [].slice.call(scope.getElementsByTagName(selector));
		}
	}
	else {
		this.nodeList = [].slice.call(scope.querySelectorAll(selector));
	}
};


/**
 * Check if element has given class
 *
 * @param {String} className - name of class to check
 * @return {Boolean} - element has class (true/false)
 */
DOMWrapper.prototype.hasClass = function (className) {
	if (this.classListSupport) {
		return this.nodeList[0].classList.contains(className);
	} else {
		return new RegExp("(^|\\s+)" + className + "(\\s+|$)").test(this.nodeList[0].className);
	}
};


/**
 * Add the specified class(es) to each element in the set of matched elements.
 *
 * @param {String} classNames - name(s) of class(es) to add
 */
DOMWrapper.prototype.addClass = function (classNames) {
	let i = 0;
	let classes = classNames && classNames.split(' ');

	if (!classes) {
		return;
	}

	for (i; i < this.nodeList.length; i++) {

		for (let j = 0; j < classes.length; j++) {

			if (this.classListSupport) {
				this.nodeList[i].classList.add(classes[j]);
			} else {
				if (this.nodeList[i].className.split(' ').indexOf(classes[j]) === -1) {
					this.nodeList[i].className = this.nodeList[i].className + ' ' + classes[j];
				}
			}

		}

	}
};


/**
 * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
 *
 * @param {String} classNames - name(s) of class(es) to remove
 */
DOMWrapper.prototype.removeClass = function (classNames) {
	let i = 0;
	let classes = classNames && classNames.split(' ');

	for (i; i < this.nodeList.length; i++) {

		if (!classes) {
			this.nodeList[i].removeAttribute('class');
		}
		else {

			for (let j = 0; j < classes.length; j++) {

				if ('classList' in document.documentElement) {
					this.nodeList[i].classList.remove(classes[j]);
				}
				else {
					this.nodeList[i].className = this.nodeList[i].className.replace(new RegExp("(^|\\s+)" + classes[j] + "(\\s+|$)"), ' ');
				}

				if (!this.nodeList[i].className.length) {
					this.nodeList[i].removeAttribute('class');
				}

			}
		}
	}
};


/**
 * Get the HTML contents of the first element in the set of matched elements
 * Set the HTML contents of each element in the set of matched elements
 *
 * @param {String} htmlStr - html string
 * @return {String} - html contents
 */
DOMWrapper.prototype.html = function (htmlStr) {
	let i = 0;

	if (!htmlStr) {
		return this.nodeList[0].innerHTML;
	}

	for (i; i < this.nodeList.length; i++) {
		this.nodeList[i].innerHTML = htmlStr;
	}
};


/**
 * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
 *
 * @param {Object} domWrapperObj - DOM wrapper object
 */
DOMWrapper.prototype.append = function (domWrapperObj) {
	let i = 0;

	for (i; i < this.nodeList.length; i++) {
		if (typeof domWrapperObj === 'string') {
			this.nodeList[i].insertAdjacentHTML('beforeend', domWrapperObj);
		}
		else {
			this.nodeList[i].appendChild(domWrapperObj.nodeList && domWrapperObj.nodeList[0] || domWrapperObj);
		}
	}
};

/**
 * Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
 *
 * @param {Object} domWrapperObj - DOM wrapper object
 */
DOMWrapper.prototype.prepend = function (domWrapperObj) {
	let i = 0;

	for (i; i < this.nodeList.length; i++) {
		if (typeof domWrapperObj === 'string') {
			this.nodeList[i].insertAdjacentHTML('afterbegin', domWrapperObj);
		}
		else {
			this.nodeList[i].insertBefore(domWrapperObj.nodeList && domWrapperObj.nodeList[0] || domWrapperObj, this.nodeList[i].firstChild);
		}
	}
};


/**
 * Insert content, specified by the parameter, before each element in the set of matched elements
 *
 * @param {Object} domWrapperObj - DOM wrapper object
 */
DOMWrapper.prototype.before = function (domWrapperObj) {
	let i = 0;

	for (i; i < this.nodeList.length; i++) {
		if (typeof domWrapperObj === 'string') {
			this.nodeList[i].insertAdjacentHTML('beforebegin', domWrapperObj);
		}
		else {
			this.nodeList[i].parentNode.insertBefore(domWrapperObj.nodeList && domWrapperObj.nodeList[0] || domWrapperObj, this.nodeList[i]);
		}
	}
};

/**
 * Insert content, specified by the parameter, after each element in the set of matched elements.
 *
 * @param {Object} domWrapperObj - DOM wrapper object
 */
DOMWrapper.prototype.after = function (domWrapperObj) {
	let i = 0;

	for (i; i < this.nodeList.length; i++) {
		if (typeof domWrapperObj === 'string') {
			this.nodeList[i].insertAdjacentHTML('afterend', domWrapperObj);
		}
		else {
			this.nodeList[i].parentNode.insertBefore(domWrapperObj.nodeList && domWrapperObj.nodeList[0] || domWrapperObj, this.nodeList[i].nextElementSibling);
		}
	}
};


/**
 * Remove the set of matched elements from the DOM
 *
 */
DOMWrapper.prototype.remove = function () {
	let i = 0;

	for (i; i < this.nodeList.length; i++) {
		this.nodeList[i].parentNode.removeChild(this.nodeList[i]);
	}
};


/**
 * Remove all child nodes of the set of matched elements from the DOM
 *
 */
DOMWrapper.prototype.empty = function () {
	let i = 0;

	for (i; i < this.nodeList.length; i++) {
		while (this.nodeList[i].firstChild) {
			this.nodeList[i].removeChild(this.nodeList[i].firstChild);
		}
	}
};


/**
 * Get the value of an attribute for the first element in the set of matched elements
 * Set value of an attribute for the set of matched elements
 *
 * @param {String} attrName - attribute name
 * @param {String} [attrVal] - attribute value
 * @return {String} - attribute value
 */
DOMWrapper.prototype.attr = function (attrName, attrVal) {
	let i = 0;

	if (!attrVal) {
		return this.nodeList[0].getAttribute(attrName);
	}

	for (i; i < this.nodeList.length; i++) {
		this.nodeList[i].setAttribute(attrName, attrVal);
	}
};

/**
 * Remove an attribute from each element in the set of matched elements.
 *
 * @param {String} attrName - attribute name
 */
DOMWrapper.prototype.removeAttr = function (attrName) {
	let i = 0;

	if (!attrName) {
		return;
	}

	for (i; i < this.nodeList.length; i++) {
		this.nodeList[i].removeAttribute(attrName);
	}
};


/**
 * Get the combined text contents of each element in the set of matched elements.
 * Set the content of each element in the set of matched elements to the specified text.
 *
 * @param {String} [text] - text
 * @return {String} - text
 */
DOMWrapper.prototype.text = function (text) {
	let i = 0;
	let combinedText = '';

	for (i; i < this.nodeList.length; i++) {

		if (!text) {
			combinedText += this.nodeList[i].innerText;
		}
		else {
			this.nodeList[i].innerText = text;
		}
	}

	if (!text) {
		return combinedText;
	}

};


/**
 * Get the computed style properties for the first element in the set of matched elements.
 * Set the content of each element in the set of matched elements to the specified text.
 *
 * @param {String|Object} cssProp - css poperty
 * @param {String} [cssVal] - css value
 * @return {String} - css value
 */
DOMWrapper.prototype.css = function (cssProp, cssVal) {
	let i = 0;

	if (typeof cssProp === 'string') {

		if (!cssVal) {
			return this.nodeList[0].style[cssProp];
		}
		else {

			for (i; i < this.nodeList.length; i++) {
				this.nodeList[i].style[cssProp] = cssVal;
			}
		}
	}
	else if (typeof cssProp === 'object') {

		for (i; i < this.nodeList.length; i++) {
			for (let prop in cssProp) {
				if (cssProp.hasOwnProperty(prop)) {
					this.nodeList[i].style[prop] = cssProp[prop];
				}
			}
		}
	}
};


/**
 * Create a deep copy of the first element in the set of matched elements
 *
 * @param {Boolean} [withChildren] - clone with children (true/false)
 * @return {Object} - clone of dom node
 */
DOMWrapper.prototype.clone = function (withChildren) {
	return this.nodeList[0].cloneNode(withChildren);
};


/**
 * Return an integer indicating the position of the first element in the set of matched elements relative to its sibling elements
 *
 * @return {Number} - index of element among its siblings
 */
DOMWrapper.prototype.index = function () {
	return [].slice.call(this.nodeList[0].parentNode.children).indexOf(this.nodeList[0]);
};


/**
 * Attach an event handler function for one or more events to the selected elements
 *
 * @param {String} eventNames - name(s) of event(s) for which handler will be registered for the matched set of elements
 * @param {Function} handler - event handler function to register
 */
DOMWrapper.prototype.on = function (eventNames, handler) {
	let i = 0;
	let j = 0;
	let events = eventNames.split(' ');

	for (i; i < this.nodeList.length; i++) {

		for (j; j < events.length; j++) {
			this.nodeList[i].addEventListener(events[j], handler);
		}
	}
};


/**
 * Detach an event handler for one or more events from the selected elements
 *
 * @param {String} eventNames - name(s) of event(s) for which handler will be unregistered for the matched set of elements
 * @param {Function} handler - event handler function to unregister
 */
DOMWrapper.prototype.off = function (eventNames, handler) {
	let i = 0;
	let j = 0;
	let events = eventNames.split(' ');

	for (i; i < this.nodeList.length; i++) {

		for (j; j < events.length; j++) {
			this.nodeList[i].removeEventListener(events[j], handler);
		}
	}
};


/**
 * Execute all handlers and behaviors attached to the matched elements for the given event type
 *
 * @param {String} eventNames - name(s) of event(s) which will be trigger on the set of matched elements
 * @param {Object} [customData] - custom data to pass with the event (accessible via event.detail)
 */
DOMWrapper.prototype.trigger = function (eventNames, customData) {
	let i = 0;
	let j = 0;
	let events = eventNames.split(' ');

	for (i; i < this.nodeList.length; i++) {

		for (j; j < events.length; j++) {

			if (typeof this.nodeList[i][events[j]] === 'function') {
				this.nodeList[i][events[j]]();
			}
			else {
				this.nodeList[i].dispatchEvent(new CustomEvent(events[j], {detail: customData}));
			}
		}
	}
};


export default DOMHelper;
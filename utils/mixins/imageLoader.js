/**
 * Represents a imageLoader Mixin.
 * @module ImageLoader
 *
 * @author Sebastian Fitzner
 */

var $ = require('jquery');
var App = require('../../app');


"use strict";
/**
 * @alias module:imageLoader
 */
var ImageLoader = {

	/** Initialize function which extends initialize() in our views. */
	initialize: function() {
		this._checkImages(this.$el);
	},

	/**
	 * Check images in our view
	 * @param {string} el - element which contains our images
	 */
	_checkImages: function(el) {
		var imgs = $('img', el);
		var loadedImgs = 0;
		var totalImgs = imgs.length || 0;

		if (totalImgs === 0) {
			this.render()
		} else {
			this._checkImageLoading(imgs, loadedImgs, totalImgs);
		}
	},

	/**
	 * Check the loading status of our images
	 * @param {string} imgs - images
	 * @param {number} loadedImgs - images which are already loaded
	 * @param {number} totalImgs - image length in our element
	 */
	_checkImageLoading: function(imgs, loadedImgs, totalImgs) {
		var timeout;
		var that = this;

		loadedImgs = 0;

		imgs.each(function() {
			if (this.complete) {
				loadedImgs++;
			}
		});

		if (loadedImgs === totalImgs) {
			clearTimeout(timeout);

			timeout = setTimeout(function() {
				that.render();
			}, 0);
		} else {
			timeout = setTimeout(function() {
				that._checkImageLoading(imgs, loadedImgs, totalImgs);
			}, 10);
		}
	}

};

module.exports = ImageLoader;

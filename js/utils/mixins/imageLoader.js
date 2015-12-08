/**
 * Represents a imageLoader Mixin.
 * With this mixin you can extend a view or the module class and
 * add the possibility to support the execution of the render method
 * only after all images are loaded (i.e. equal-row-height.js)
 *
 * @module ImageLoader
 *
 * @author Sebastian Fitzner
 */
import Helpers from '../../utils/helpers';
import App from '../../app';

const $ = Helpers.$;

"use strict";
/**
 * @alias module:imageLoader
 */
var ImageLoader = {

	/** Initialize function which extends initialize() in our views. */
	initialize: function () {
		this.checkImages();
		this.bindImageLoaderEvents();
	},

	/**
	 * Bind image loader events
	 */
	bindImageLoaderEvents: function () {
		let checkImages = this.checkImages.bind(this);

		App.Vent.on(App.EVENTS.resize, checkImages);
	},

	/**
	 * Check images in our view
	 */
	checkImages: function () {
		let imgs = $('img', this.el);
		let loadedImgs = 0;
		let totalImgs = imgs.length || 0;

		if (totalImgs === 0) {
			this.render()
		} else {
			this.checkImageLoading(imgs, loadedImgs, totalImgs);
		}
	},

	/**
	 * Check the loading status of our images
	 * @param {string} imgs - images
	 * @param {number} loadedImgs - images which are already loaded
	 * @param {number} totalImgs - image length in our element
	 */
	checkImageLoading: function (imgs, loadedImgs, totalImgs) {
		let timeout;
		loadedImgs = 0;

		Helpers.forEach(imgs, (i, el) => {
			if (el.complete) {
				loadedImgs++;
			}
		});

		if (loadedImgs === totalImgs) {
			clearTimeout(timeout);

			timeout = setTimeout(() => {
				this.render();
			}, 0);
		} else {
			timeout = setTimeout(() => {
				this.checkImageLoading(imgs, loadedImgs, totalImgs);
			}, 10);
		}
	}
};

export default ImageLoader;
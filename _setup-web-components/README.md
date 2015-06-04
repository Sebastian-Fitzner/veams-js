# JS Methodology

We decide to use Web Components, Exoskeleton, Browserify and jQuery to realize a scalable project.

## Web Components

Read the following articles, to get a first intro to web components.

- [http://www.html5rocks.com/en/tutorials/webcomponents/customelements/](http://www.html5rocks.com/en/tutorials/webcomponents/customelements/)
- [https://developer.mozilla.org/en-US/docs/DOM/DOM_Reference#HTML_interfaces](https://developer.mozilla.org/en-US/docs/DOM/DOM_Reference#HTML_interfaces)

If you have read these articles you should already know, that IE8 is not supported.

IE9 is supported, because we use a [polyfill](https://github.com/WebReflection/document-register-element).

### Initialize Web Components

We use the lifecycle callback methods of our elements to initialize our views. See:

- [http://www.html5rocks.com/en/tutorials/webcomponents/customelements/#lifecycle](http://www.html5rocks.com/en/tutorials/webcomponents/customelements/#lifecycle)

Each component have their own `init.js` which can be adjusted to your needs.
This `init.js` file should be required in our `main.js`.

## BackboneJS/Exoskeleton

All modules will be written with Backbone/Exoskeleton. The `render()` method will be executed in `attachedCallback` or our mixins.

### Mixins

Furthermore we use mixins. These are snippets which provides a global functionality and can be used by our modules.

Our mixin object is attached to `View` (see `app.js`). Therefore we can use this mixin in our modules like this:

``` js
/** Use mixin to extend our view with `ImageLoader` */
App.ui.Carousel.mixin(ImageLoader);
```

## Browserify

To structure our code base we use Browserify. We do NOT load our scripts depending on the modules which are present on the current page.

For development purpose we add sourcemaps (`grunt serve`). In production we minify our js (`grunt dist`).

To support templates in BackboneJS/Exoskeleton we add [`handlebars/runtime`](http://handlebarsjs.com/).

## jQuery

jQuery will be used for event and selector handling.


## Other Libraries

### respimage.js

For picture handling with polyfill we decide to use [`respimage.js`](https://github.com/aFarkas/respimage).

### touchSwipe.js

To support swipe gestures we use [`touchSwipe.js`](https://github.com/mattbryson/TouchSwipe-Jquery-Plugin).
# JS Methodology

We decide to use BackboneJS, RequireJS and jQuery to realize a scalable project with HTML components.

## HTML Components

Read the following articles, to get a first intro to HTML components.

- [http://simonsmith.io/modular-html-components-with-requirejs/)

### Initialize HTML Components

We use ordinary script tags.

**Example:**

``` html
<script>
	require(['inits/carousel']);
</script>
```

Each component have their own `init` which can be adjusted to your needs.
This `init` file should required our `main.js`.

## BackboneJS

All modules will be written with Backbone.

### Mixins

Furthermore we use mixins. These are snippets which provides a global functionality and can be used by our modules.

Our mixin object is attached to `Backbone.View` (see `resources/js/utils/helpers.js`). Therefore we can use this mixin in our modules like this:

``` js
/** Use mixin to extend our view with `ImageLoader` */
App.ui.Carousel.mixin(ImageLoader);
```

## RequireJS

To structure our code base we use RequireJS. We load our scripts depending on the modules which are present on the current page.

For development purpose we add sourcemaps (`grunt serve`). In production we minify our js (`grunt dist`).

To support templates in BackboneJS we add [`requirejs-text`](https://github.com/requirejs/text).

## jQuery

jQuery will be used for event and selector handling.


## Other Libraries

### respimage.js

For picture handling with polyfill we decide to use [`respimage.js`](https://github.com/aFarkas/respimage).

### touchSwipe.js

To support swipe gestures we use [`touchSwipe.js`](https://github.com/mattbryson/TouchSwipe-Jquery-Plugin).
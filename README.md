## PG-JS Starter Kit

PG-JS Starter Kit contains a simple setup for a general JavaScript workflow. 

It consists of two basic approaches:

1. [Web Components](_setup-web-components/README.md) or
2. [HTML Components](_setup-html-components/README.md)

Both approaches are realised with:

- BackboneJS/Exoskeleton
- CommonJS with Browserify
- jQuery

Choose one of these or both approaches.

Then install the dependencies via npm:
``` bash 
npm i jquery exoskeleton touchswipe document-register-element handlebars respimage --save
```

Or copy these lines into your `package.json` and execute `npm i`: 
``` json
  "dependencies": {
    "document-register-element": "^0.3.0",
    "exoskeleton": "^0.7.0",
    "handlebars": "^3.0.3",
    "jquery": "^2.1.4",
    "respimage": "^1.4.0",
    "touchswipe": "^1.6.0"
  }
```

### Requirements

In general there are no requirements. Just download the package and import the files you need. 

If you want to install it with Bower, here are the requirements: 

- NodeJS
- Bower (npm install -g bower)

### Installation

``` bash
bower install pg-js --save
```

### How to use

Just copy the files you need into the js folder in your project. The following files are important: 

#### Web Components

- `app.js`
- `main.js`
- `utils/helpers.js`
- `utils/mixins/imageLoader.js`

All files in the `modules` folder are optional and work in progress. Keep that in mind.

### Modules

Each module has an own `init` file which is only necessary when you use the `web components` approach. 
You can also require the files you need and init the modules in your `main.js`.

Furthermore there are `scss` and `hbs` files for each module, which you can use in your project. 

#### Handlebars Files

Each `hbs` template contains `web components` instead of normal html tags. 
When you want to use the `html components` approach, just change the `ui`-tag into something you would prefer. Then you need to add a new data attribute (`data-js-module="module-name"`). That's it ...  

### Demo 

Work in progress ...

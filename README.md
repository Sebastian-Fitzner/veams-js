## PG-JS Starter Kit

PG-JS Starter Kit contains a simple setup for a general JavaScript workflow. 

It consists of two basic approaches:

1. [Web Components](web-components/js/README.md) or
2. [HTML Components](html-components/js/README.md)

Both approaches are realised with:

- BackboneJS
- RequireJS and RequireJS Text
- jQuery

Choose one of these approaches and copy the requirejs.js task in `helpers/_grunt` (only necessary if you use a PG setup).

Then copy the dependencies of the bower file into your project and install them. 

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
- `vendor/document-register-element.js`
- `utils/helpers.js`
- `utils/mixins/imageLoader.js`

All files in the `modules` folder are optional and work in progress. Keep that in mind. 

#### HTML Components

- `app.js`
- `config.js`
- `main.js`
- `utils/helpers.js`
- `utils/mixins/imageLoader.js`

All files in the `modules` folder are optional and work in progress. Keep that in mind. 


### Demo 

Work in progress ...

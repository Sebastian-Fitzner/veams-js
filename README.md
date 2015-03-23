## PG-JS Starter Kit

PG-JS Starter Kit contains a simple setup for a general JavaScript workflow. 

It consists of two basic approaches:

1. [Web Components](_setup-web-components/README.md) or
2. [HTML Components](_setup-html-components/README.md)

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

### Modules

Each module has an own `init` file which is only necessary when you use the `web components` approach. 

Furthermore there are `scss` and `hbs` files for each module, which you can use in your project. 

#### Handlebars Files

Each `hbs` template contains `web components` instead of normal html tags. 
When you want to use the `html components` approach, just change the `ui`-tag into something you would prefer. Then you need to add a new data attribute (`data-js-module="module-name"`). That's it ...  

### Demo 

Work in progress ...

# Usage
===================================

Simply use `panels` to generate an individual carousel element.
Put the following snippets into your page:

``` hbs
{{#panel "m-carousel"}}
	{{#pContent "content" modifier="default" pagination="true" id="carousel-01"}}
		{{! Panel START: Carousel Item}}
			{{#each ../page-home.carousel.data}}
				{{#panel "m-carousel__item"}}
					{{#pContent "content"}}
						{{> c-figure }}
					{{/pContent}}
				{{/panel}}
			{{/each}}
		{{! Panel END: Carousel Item}}
	{{/pContent}}
{{/panel}}
```

Use your own JSON file to generate content.
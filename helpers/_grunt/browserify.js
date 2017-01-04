var externalLibs = [
	'exoskeleton',
	'handlebars',
	'picturefill',
	'lazysizes',
	'veams-query'
];

var internalLibs = [
	'./resources/js/utils/events.js:events',
	'./resources/js/app.js:app',
	'./resources/js/modules/_global/module.js:app-module'
];

module.exports = {
	options: {
		transform: [
			['babelify',
				{
					compact: true,
					// ignore: [
					// 	'<%= paths.dev %>/js/vendor/'
					// ],
					presets: ['es2015', 'stage-0']
				}
			],
			['aliasify',
				{
					aliases: {
						'backbone': 'exoskeleton'
					},
					global: true,
					verbose: true
				}
			]
		],
		ignore: ['jquery', 'underscore']
	},
	vendor: {
		src: ['.'],
		dest: '<%= paths.dev %>/js/vendor/libs.js',
		options: {
			debug: false,
			alias: externalLibs
		}
	},
	dev: {
		options: {
			alias: internalLibs,
			external: externalLibs,
			browserifyOptions: {
				debug: true
			},
			watch: true
		},
		files: {
			'<%= paths.dev %>/js/main.js': '<%= paths.src %>/js/main.js'
		}
	},
	dist: {
		options: {
			alias: internalLibs,
			external: externalLibs
		},
		files: {
			'<%= paths.dev %>/js/main.js': '<%= paths.src %>/js/main.js'
		}
	}
};
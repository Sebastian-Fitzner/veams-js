module.exports = {
	options: {
		baseUrl: "<%= paths.src %>/js/",
		mainConfigFile: "<%= paths.src %>/js/config.js",
		findNestedDependencies: true,
		logLevel: 0,
		wrapShim: true,
		removeCombined: true, // delete duplicates
		modules: [ // define your modules
			{
				name: 'config'
			},
			{
				name: 'main',
				exclude: ['config']
			},
			{
				name: 'inits/carousel',
				exclude: ['main', 'config']
			},
			{
				name: 'inits/select',
				exclude: ['main', 'config']
			},
			{
				name: 'inits/map',
				exclude: ['main', 'config']
			},
			{
				name: 'inits/breadscroller',
				exclude: ['main', 'config']
			}
		]
	},
	dev: {
		options: {
			dir: "<%= paths.dev %>/js/",
			keepBuildDir: true,
			optimize: "none", // no minification
			generateSourceMaps: true
		}
	},
	prod: {
		options: {
			dir: "<%= paths.dev %>/js/"
		}
	}
};
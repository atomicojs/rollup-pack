'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var inputHTML = _interopDefault(require('@atomico/rollup-plugin-input-html'));
var resolve = _interopDefault(require('rollup-plugin-node-resolve'));
var sizes = _interopDefault(require('@atomico/rollup-plugin-sizes'));
var rollupPluginTerser = require('rollup-plugin-terser');

let ignoreLog = ["CIRCULAR_DEPENDENCY", "UNRESOLVED_IMPORT"];

let isDev = process.env.ROLLUP_WATCH;

let defaultOptions = {
	dirDist: "./dist",
	dirLib: "./lib",
	minifyDist: !isDev,
	minifyLib: !isDev,
	showSizes: !isDev,
	plugins: [],
	pluginsDist: [],
	pluginsLib: [],
	onwarn(message) {
		if (ignoreLog.indexOf(message.code) > -1) return;
		console.error(message);
	}
};

function pack(input = "*.html", options) {
	options = { ...defaultOptions, ...options };

	let bundles = [];

	if (options.dirDist) {
		bundles.push({
			input,
			output: {
				dir: options.dirDist,
				sourcemap: true,
				format: "esm"
			},
			onwarn: options.onwarn,
			plugins: [
				inputHTML(),
				resolve(),
				...options.pluginsDist,
				...options.plugins,
				...(options.minifyDist ? [rollupPluginTerser.terser()] : []),
				...(options.showSizes ? [sizes()] : [])
			]
		});
	}

	if (options.dirLib) {
		bundles.push({
			input,
			output: {
				dir: options.dirLib,
				sourcemap: true,
				format: "esm"
			},
			onwarn: options.onwarn,
			plugins: [
				inputHTML({
					createHTML: false
				}),
				...options.pluginsLib,
				options.plugins,
				...(options.minifyLib ? [rollupPluginTerser.terser()] : []),
				...(options.showSizes ? [sizes()] : [])
			]
		});
	}

	return bundles;
}

module.exports = pack;

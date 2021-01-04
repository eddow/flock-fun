var webpack = require("webpack"),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	path = require("path");

module.exports = {
	mode: 'development',	//This is meant to be bundled afterward anyway
	context: path.resolve(__dirname, 'src'),
	entry: {
		'index': ['./index.ts'],
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, "dist"),
		umdNamedDefine: true
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'index.ejs',
			favicon: 'favicon.ico',
			title: 'flock-fun'
		})
	],
	devtool: 'source-map',
	module: {
		rules: [{
			test: /\.tsx?$/,
			exclude: /node_modules/,
			loader: 'ts-loader',
			options: {
				appendTsSuffixTo: [/\.vue$/]
			}
		}, {
			enforce: 'pre',
			test: /\.tsx?$/,
			exclude: /node_modules/,
			use: "source-map-loader"
		}]
	},
	resolve: {
		extensions: [".ts"]
	}
};
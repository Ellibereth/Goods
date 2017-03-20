var webpack = require('webpack');
var path = require('path');
var env = process.env.WEBPACK_ENV;
var BUILD_DIR = path.resolve(__dirname, 'static');
var APP_DIR = path.resolve(__dirname, 'static/components');
var config = {
  entry: APP_DIR + '/Main.js',
  output: {
	path: BUILD_DIR,
	filename: 'bundle.js'
  },
  module: {
	loaders: [
	  {
		test: /\.js?$/,
		loader: 'babel-loader',
		exclude: /node_modules/,
		query: {
		  presets: ['react', 'es2015']
		}
	  }
	]
  },
  resolve : {
	 modules: [
	   APP_DIR,
	   "node_modules"
	 ],

	extensions: ['*', '.js', '.jsx']
  },
  target : 'node',
  plugins: [
	new webpack.DefinePlugin({
		'process.env': {
		  NODE_ENV: JSON.stringify('production')
		}
	})
  ],
  externals: {
	'Config': JSON.stringify(process.env.ENV === 'production' ? {
	  serverUrl: "https://whereisitmade.herokuapp.com"
	} : {
	  serverUrl: "http://127.0.0.1:5000"
	})
  }
};

module.exports = config;

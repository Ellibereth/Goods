var webpack = require('webpack');
var path = require('path');
var env = process.env.WEBPACK_ENV;
var BUILD_DIR = path.resolve(__dirname, 'static');
var APP_DIR = path.resolve(__dirname, 'static/components');


var config = {
    cache : true,
    // devtool: "eval", //or cheap-module-eval-source-map,
  entry: APP_DIR + '/Main.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [

        { test: /\.css$/, loader: "style-loader!css-loader" },

        {
            test: /\.js?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            include: [
                    path.join(__dirname, "static") //important for performance!
                ],
            query: {
                    cacheDirectory: true, //important for performance
                    plugins: ["transform-regenerator"],
                    presets: ["react", "es2015", "stage-0"]
            }
      }
    ]
  },
  resolve : {
     modules: [
       APP_DIR,
       "node_modules",
        path.resolve(__dirname, "static")
     ],

    extensions: ['*', '.js', '.jsx']
  },
  target : 'node',
  plugins: [
    new webpack.DefinePlugin({
        'global': {}, // bizarre lodash(?) webpack workaround,
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
    }),
    //Typically you'd have plenty of other plugins here as well
        new webpack.DllReferencePlugin({
            context: path.join(__dirname, "static"),
            manifest: require(path.join(__dirname, "static", 'dll', 'vendor-manifest.json'))
        }),
  ],
};

// "use-strict"
module.exports = config;

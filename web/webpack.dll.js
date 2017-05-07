var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        vendor: [path.join(__dirname, "vendors.js")]
    },
    output: {
        path: path.join(__dirname, "static", "dist", "dll"),
        filename: "dll.[name].js",
        library: "[name]"
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, "static", "dll", "[name]-manifest.json"),
            name: "[name]",
            context: path.resolve(__dirname, "static")
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        // new webpack.optimize.UglifyJsPlugin()
    ],
    resolve: {
        modules: [path.resolve(__dirname), "node_modules"]
    },
    node: {
      fs: 'empty'
    },
};
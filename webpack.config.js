/**
 * Created by 谭宏志 on 2016/12/14.
 */
var webpack = require('webpack');
//var HtmlWebpackPlugin = require('html-webpack-plugin');
//var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'eval-source-map',
    entry: __dirname + "/app.js",
    output: {
        path: __dirname + "/node_server/build",
        filename: "bundle.js"
    },

    module: {
        loaders: [
            {
                test: /\.json$/,
                loader: "json"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            /*{
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css?modules!postcss')
            }*/
        ]
    },
    postcss: [
        require('autoprefixer')
    ],
    devServer: {
        contentBase: "./node_server/build",
        colors: true,
        historyApiFallback: true,
        inline: true
    },
    node: {
        console: true,
        fs: 'empty'
    },
    resolve: {
        extensions: ['', '.js']
    },
    plugins: [
        /*new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html"
        }),*/
        //new webpack.optimize.OccurenceOrderPlugin(),
        //new webpack.optimize.UglifyJsPlugin(),
        //new ExtractTextPlugin("[name]-[hash].css")
    ]
}

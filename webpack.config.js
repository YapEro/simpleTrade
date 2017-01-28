/**
 * Created by sean on 2017/1/15.
 */
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = [{
    name : "server",
    devtool: 'cheap-module-eval-source-map',
    // 入口
    entry: "./app.ts",
    // 输出的文件名
    output: {
        path : "./node_server/dist/",
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    target: "node",
    module: {
        loaders: [
            // all files with a `.ts` extension will be handled by `ts-loader`
            { test: /\.ts$/, loader: 'ts-loader', exclude: "./node_modules"},
            { test: /\.json$/, loader: 'json-loader'}
        ]
    },
},{
    name : "client",
    entry: {
        'polyfills': './ng_client/polyfills.ts',
        'vendor': './ng_client/vendor.ts',
        'app': './ng_client/index.ts'
    },

    resolve: {
        extensions: ['', '.ts', '.js', 'css']
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader']
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            },
            { test: /\.scss$/,
                loaders: [
                    'css-loader?sourceMap',
                    'sass-loader?sourceMap'
                ]
            },
            {
                test: /\.(gif|png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.css$/,
                loaders: ['to-string-loader', 'css-loader']
            },
             /*{
                test: /\.css$/,
                include: "./ng_client/",
                loader: 'style!css'
            }*/
        ]
    },
    devtool: 'cheap-module-eval-source-map',

    output: {
        path: "./ng_client/dist/",
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),
        new ExtractTextPlugin('[name].css')
    ]
}];
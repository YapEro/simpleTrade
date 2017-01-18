/**
 * Created by sean on 2017/1/15.
 */
var webpack = require('webpack');
module.exports = {
    devtool:"#source-map",
    // 入口
    entry: "./ng_client/index.ts",
    // 输出的文件名
    output: {
        path : __dirname + "/ng_client/dist/",
        filename: 'bundle.js'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.ts', '.js']
    },
    module: {
        loaders: [
            // all files with a `.ts` extension will be handled by `ts-loader`
            { test: /\.ts$/, loader: 'ts-loader'},
            { test: /\.json$/, loader: 'json-loader'}
        ]
    },
    plugins: [
        // uglify
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            output: { comments: false },
            sourceMap: true
        })
    ]
};
/**
 * Created by sean on 2017/1/15.
 */
//var HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 入口
    entry: "./ng_client/index.ts",
    // 输出的文件名
    output: {
        filename: './ng_client/dist/bundle.js'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.ts', '.js']
    },
    module: {
        loaders: [
            // all files with a `.ts` extension will be handled by `ts-loader`
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
};
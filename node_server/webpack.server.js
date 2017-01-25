/**
 * Created by sean on 2017/1/15.
 */
module.exports = {
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
};
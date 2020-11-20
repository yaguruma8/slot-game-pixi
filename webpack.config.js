const path = require('path');

const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: { app: './src/index.ts' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        open: 'google chrome',
        watchOptions: {
            ignored: /node_modules/,
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new ESLintPlugin({
            extensions: ['tsx', 'ts', 'js'],
            exclude: 'node_modules',
            formatter: 'stylish',
            fix: true,
        }),
        new HtmlPlugin({
            template: './src/index.html',
            inject: 'body'
        })
    ],
};

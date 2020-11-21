const path = require('path');

const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: { app: './src/index.js' },
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
            {
                test: /\.png$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets',
                    publicPath: 'assets',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    plugins: [
        new ESLintPlugin({
            extensions: ['tsx', 'ts', 'js'],
            exclude: 'node_modules',
            formatter: 'table',
            fix: true,
        }),
        new HtmlPlugin({
            template: './src/index.html',
            inject: 'head',
            scriptLoading: 'defer',
        }),
    ],
};

const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const libraryName = 'tung';

const config = {
    entry: path.join(__dirname, `/examples/index.js`),
    output: {
        path: path.join(__dirname, '/examples'),
        filename: `bundle.js`,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [{
            test: /(\.js)$/,
            //loader: 'babel-loader',
            exclude: /(node_modules|bower_components)/
        }]
    },
    //plugins: [ new UglifyJsPlugin({ minimize: true }) ]
};

module.exports = config;
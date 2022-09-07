// The path to the CesiumJS source code
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    reactScriptsVersion: "react-scripts" /* (default value) */,
    webpack: {
        alias: {},
        style: {
            modules: {
                localIdentName: ""
            },
            css: {
                loaderOptions: (cssLoaderOptions, { env, paths }) => { return cssLoaderOptions; }
            },         
        },
        plugins: {
            add: [
                // [ new HtmlWebpackPlugin({ template: 'src/index.html' }), "append"],
                [ new CopyWebpackPlugin({
                    patterns: [
                        { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
                        { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
                        { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' },
                        { from: path.join(cesiumSource, 'ThirdParty'), to: 'ThirdParty'}
                    ]
                }), "append"],
                [ new webpack.DefinePlugin({
                    // Define relative base path in cesium for loading assets
                    CESIUM_BASE_URL: JSON.stringify('')
                }), "append"]

                // plugin1,
                // [plugin2, "append"],
                // [plugin3, "prepend"], /* Specify if plugin should be appended or prepended */
            ], /* An array of plugins */
            remove: [],  /* An array of plugin constructor's names (i.e. "StyleLintPlugin", "ESLintWebpackPlugin" ) */
        },
        // configure: { /* Any webpack configuration options: https://webpack.js.org/configuration */ },
        configure: (webpackConfig, { env, paths }) => { return webpackConfig; }
    },
};
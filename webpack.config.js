const path          = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    entry     : "./src/index.ts",
    target    : "node",
    externals : [nodeExternals()],
    devtool   : "cheap-module-source-map",
    module    : {
        rules : [
            {
                test    : /\.tsx?$/,
                exclude : /node_modules/,
                use     : [{
                    loader  : "ts-loader",
                    options : { onlyCompileBundledFiles: true }
                }]
            },
            {
                test : /\.json$/,
                use  : "json-loader"
            }
        ]
    },
    output : {
        path     : path.join(__dirname, "dist"),
        filename : "index.min.js"
    },
    resolve : {
        extensions : [".tsx", ".ts", ".d.ts"]
    }
};
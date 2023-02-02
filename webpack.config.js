const path = require("path");

module.exports = {
    entry: "./src/background.js",
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: { noEmit: false },
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "background.js",
        path: path.resolve(__dirname, ".", "build"),
    },
    devtool: "source-map"
};
const webpack = require("webpack");

module.exports = {
  entry: ["babel-polyfill", "./app.js"],
  output: {
    path: __dirname + "/build",
    filename: "app.bundle.js"
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" }
      // ...
    ],
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            // presets: [["@babel/preset-env", { targets: { node: "current" }}], "@babel/preset-react"],
            presets: [
              ["@babel/preset-env", { modules: false, useBuiltIns: "entry" }],
              "@babel/preset-react"
            ],
            plugins: ["transform-class-properties"]
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: "source-map"
};

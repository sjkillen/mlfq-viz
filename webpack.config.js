"use strict";

const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const BANNER = require("./banner");
const PACKAGE = require("./package.json");

const srcPath = path.join(__dirname, "src");

module.exports = {
  entry: ["babel-polyfill", path.join(srcPath, "debug.js"), path.join(srcPath, "main.jsx")],
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".html"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
          path.join(__dirname, "./isolate_loader.js"),
        ],
      },
      {
        test: /\.(png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: "file-loader",
      },
      {
        test: /\.ts[x]?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["env", "react"],
            },
          },
          "ts-loader",
          "tslint-loader",
        ],
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["env", "react"],
            },
          },
          "tslint-loader",
        ],
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({ banner: BANNER, entryOnly: true }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      title: PACKAGE.name,
    }),
    new webpack.ProvidePlugin({
      React: "react",
    }),
    new ExtractTextPlugin("[name].css"),
  ],
};

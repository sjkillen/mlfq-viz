"use strict";

const path = require("path");

const webpack = require("webpack"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  ExtractTextPlugin = require("extract-text-webpack-plugin");


const BANNER = require("./banner"),
  PACKAGE = require("./package.json");


const srcPath = path.join(__dirname, "src");

module.exports = {
  entry: ["babel-polyfill", path.join(srcPath, "main.jsx"), path.join(srcPath, "debug.js")],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js"
  },

  resolve: {
    extensions: ["", ".js", ".jsx", ".ts", ".tsx", ".css", ".scss"],
  },

  module: {
    loaders: [
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader: "file-loader"
      },
      {
        test: /\.ts[x]?$/,
        loader: "babel?{presets: ['es2015', 'es2016', 'es2017', 'react']}!ts!tslint",
      },

      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: "babel?{presets: ['es2015', 'es2016', 'es2017', 'react']}",
      },
      {
        test: /\.html$/,
        loader: "html"
      },
      {
        test: /\.json$/,
        loader: "json"
      },
      {
        test: /\.hbs$/,
        loader: "handlebars"
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", `css-loader!sass-loader!${path.join(__dirname, "./isolate_loader.js")}`)
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style-loader", `css-loader!sass-loader!${path.join(__dirname, "./isolate_loader.js")}`)
      },
    ]
  },

  plugins: [
    new webpack.BannerPlugin(BANNER, { entryOnly: true }),
    new HtmlWebpackPlugin({
      template: "src/index.hbs",
      title: PACKAGE.name
    }),
    new webpack.ProvidePlugin({
      React: "react"
    }),
    new ExtractTextPlugin("[name].css")
    // new webpack.optimize.UglifyJsPlugin(),
  ]
};
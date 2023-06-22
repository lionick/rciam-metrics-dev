const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin")
const webpack = require('webpack');

// https://www.educative.io/answers/how-to-create-a-react-application-with-webpack
// https://www.youtube.com/watch?v=h3LpsM42s5o
// https://blog.logrocket.com/versatile-webpack-configurations-react-application/
module.exports = {
  entry: {
    index: path.resolve(__dirname, "src/index.js")
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].js",
    sourceMapFilename: "[name].[contenthash].js.map",
    clean: true
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: false,
    // By default, the dev server runs for 127.0.0.1
    // to enable accessing by localshot:XXXX on browsers.
    // But this does not expose the content outside of a Docker container
    host: "0.0.0.0",
    allowedHosts: 'all',
    hot: true,
    port: 3030,
    client: {
      progress: true,
    }
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "src/config",
          to: "config"
        }
      ],
      options: {
        concurrency: 100,
      },
    }),
    new HTMLWebpackPlugin({
      template: 'public/index.html',
    })
  ],
  // loaders
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      },
      {
        test: /\.(sa|sc|c)ss$/, // styles files
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(txt|json)$/,
        exclude: /node_modules/,
        use: 'raw-loader'
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
        exclude: /node_modules/,
        loader: "url-loader",
        options: {limit: false},
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 200,
    poll: 1000,
  },
}
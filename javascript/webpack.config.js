const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const webpack = require("webpack")
const dotenv = require("dotenv")

// https://www.educative.io/answers/how-to-create-a-react-application-with-webpack
// https://www.youtube.com/watch?v=h3LpsM42s5o
// https://blog.logrocket.com/versatile-webpack-configurations-react-application/
module.exports = () => {
  const env = dotenv.config().parsed
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[next] = JSON.stringify(env[next]);
    return prev;
  }, {});

  console.log('envKeys', envKeys)

  return {
    entry: {
      index: path.resolve(__dirname, "src/index.js")
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/egi/devel/',
      filename: "[name].js",
      sourceMapFilename: "[name].[contenthash].js.map",
      clean: true
    },
    devServer: {
      historyApiFallback: true,
      static: {
        directory: path.join(__dirname, 'dist')
      },
      compress: false,
      // By default, the dev server runs for 127.0.0.1
      // to enable accessing by localshot:XXXX on browsers.
      // But this does not expose the content outside of a Docker container
      host: "0.0.0.0",
      allowedHosts: 'all',
      hot: true,
      port: 3300,
      client: {
        progress: true,
        overlay: {
          errors: false,
          warnings: false,
          runtimeErrors: false,
        },
      }
    },
    plugins: [
      new HTMLWebpackPlugin({
        template: 'public/index.html',
      }),
      new webpack.DefinePlugin(envKeys)
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
    }
  }
}
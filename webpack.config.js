const { resolve } = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './src/index.ts',
  watch: true,
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.less$/,
        loader: 'less-loader'
      },
      {
        test: /\.css$/,
        loader: 'css-loader'
      }
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.tsx', '.ts', '.less', '.css'],
  },
  watchOptions: {
    poll: 1000,
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  output: {
    path: resolve(__dirname, 'dist'),
    // filename: 'bundle.js'
  }
}

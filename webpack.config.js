const { resolve } = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isDevelopmentBuild = true;

module.exports = {
  entry: './src/bootstrap.ts',
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
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        }
      }
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.tsx', '.ts', '.less', '.css'],
  },  
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  output: {
    path: resolve(__dirname, 'dist'),
  },

  // development settings
  watch: isDevelopmentBuild,
  watchOptions: {
    poll: 1000
  },
  devtool: isDevelopmentBuild ? 'inline-source-map' : undefined,
  devServer: {
    port: 3000,
    host: '0.0.0.0'
  }
}

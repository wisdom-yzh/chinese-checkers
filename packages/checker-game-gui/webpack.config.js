const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const dist = path.resolve(__dirname, 'dist');

module.exports = {
  entry: './lib/index.js',
  output: {
    filename: '[name].[hash].js',
    path: dist,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'assets/index.html'),
    }),
  ],
  devServer: {
    contentBase: dist,
    progress: true,
    compress: true,
    port: 9000,
    hot: true,
  },
};

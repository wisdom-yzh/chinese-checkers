const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const dist = path.resolve(__dirname, 'dist');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: '[name].[hash].js',
    path: dist,
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'assets/index.html'),
    }),
  ],
  devServer: {
    open: true,
    contentBase: dist,
    progress: true,
    compress: true,
    port: 9000,
    hot: true,
  },
};

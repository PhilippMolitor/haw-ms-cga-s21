const { resolve } = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
  mode: 'development',
  output: {
    filename: '[id].[contenthash].js',
    path: resolve(__dirname, 'build'),
    clean: true,
  },
  resolve: { extensions: ['.ts', '.js'] },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?name=assets/images/[name].[contenthash].[ext]',
          'image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false',
        ],
      },
      {
        test: /\.(ogg|wma|mp3|wav|mpe?g)$/i,
        use: ['file-loader?name=assets/audio/[name].[contenthash].[ext]'],
      },
      {
        test: /\.(fbx|obj|stl|mtl|glb)$/i,
        use: ['file-loader?name=assets/models/[name].[contenthash].[ext]'],
      },
    ],
  },
  plugins: [
    new ProgressBarPlugin(),
    new HtmlWebpackPlugin({
      template: `${__dirname}/web/index.html`,
      filename: 'index.html',
      inject: 'body',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devtool: 'source-map',
};

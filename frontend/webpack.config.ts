import CleanWebpackPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

export default {
  output: {
    path: path.resolve('dist'),
    // filename: '[name].js',
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },

  mode: process.env.NODE_ENV || 'development',

  entry: {
    client: './src/index.tsx',
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },

  plugins: [
    new CopyWebpackPlugin([path.resolve('./static/index.html')]),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: './static/index.html',
    }),
  ],

  devServer: {
    port: 3000,
    // hot: true,
  },

  devtool: 'source-map',
};

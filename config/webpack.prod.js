import fs from 'fs'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

import * as path from 'path'

const srcFolder = 'src'
const assetsFolder = 'assets'
const builFolder = 'dist'
const rootFolder = path.basename(path.resolve())

let pugPages = fs
  .readdirSync(srcFolder)
  .filter(fileName => fileName.endsWith('.pug'))

const paths = {
  src: path.resolve(srcFolder),
  assets: path.resolve(assetsFolder),
  build: path.resolve(builFolder),
}
const config = {
  mode: 'production',
  cache: {
    type: 'filesystem',
  },
  output: {
    path: `${paths.build}`,
    filename: '[name].min.js',
    publicPath: '',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/',
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
          },
          {
            loader: 'string-replace-loader',
            options: {
              multiple: [
                { search: 'PROJECT_NAME', replace: rootFolder, flags: 'g' },
              ],
            },
          },
        ],
      },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          {
            loader: 'string-replace-loader',
            options: {
              search: '@img',
              replace: '../img',
              flags: 'g',
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 0,
              sourceMap: false,
              modules: false,
              url: {
                filter: (url, resourcePath) => {
                  if (url.includes(`img/`) || url.includes(`fonts/`)) {
                    return false
                  }
                  return true
                },
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: 'expanded',
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    ...pugPages.map(
      pugPage =>
        new HtmlWebpackPlugin({
          minify: false,
          template: `${srcFolder}/${pugPage}`,
          filename: `../${pugPage.replace(/\.pug/, '.html')}`,
          inject: false,
        })
    ),
    new MiniCssExtractPlugin({
      filename: '../css/style.css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: `${paths.src}/files`,
          to: `../files`,
          noErrorOnMissing: true,
        },
        {
          from: `${paths.assets}/img/favicons/favicon.ico`,
          to: `../img/favicons`,
          noErrorOnMissing: true,
        },
        {
          from: `${paths.assets}/img/favicons/site.webmanifest`,
          to: `../img/favicons`,
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@scss': `${paths.assets}/scss`,
      '@js': `${paths.src}/js`,
      '@img': `${paths.assets}/img`,
      '@pug': `${paths.assets}/pug`,
    },
    extensions: ['.pug', '.js', '.scss', '.json'],
  },
}
export default config

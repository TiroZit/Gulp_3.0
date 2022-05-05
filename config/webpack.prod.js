import fs from "fs";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

import * as path from "path";

const srcFolder = "src";
const assetsFolder = "assets";
const builFolder = "dist";
const rootFolder = path.basename(path.resolve());

let pugPages = fs
  .readdirSync(assetsFolder)
  .filter((fileName) => fileName.endsWith(".pug"));

const paths = {
  src: path.resolve(srcFolder),
  assets: path.resolve(assetsFolder),
  build: path.resolve(builFolder),
};
const config = {
  mode: "production",
  cache: {
    type: "filesystem",
  },
  output: {
    path: `${paths.build}`,
    filename: "[name].min.js",
    publicPath: "",
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
          name: "vendors",
          test: /node_modules/,
          chunks: "all",
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
        loader: "babel-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: "pug-loader"
          },
          {
            loader: "string-replace-loader",
            options: {
              multiple: [
                {
                  search: "link(rel='stylesheet' href='css/style.min.css')",
                  replace: " ",
                },
                { search: "../img", replace: "img" },
                { search: "NEW_PROJECT_NAME", replace: rootFolder },
              ],
            },
          },
        ],
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          {
            loader: "string-replace-loader",
            options: {
              search: "@img",
              replace: "../img",
              flags: "g",
            },
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 0,
              sourceMap: false,
              modules: false,
              url: {
                filter: (url, resourcePath) => {
                  if (url.includes(`img/`) || url.includes(`fonts/`)) {
                    return false;
                  }
                  return true;
                },
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                outputStyle: "expanded",
              }
            },
          },
        ],
      },
    ],
  },
  plugins: [
    ...pugPages.map(
      (pugPage) =>
        new HtmlWebpackPlugin({
          minify: false,
          template: `${assetsFolder}/${pugPage}`,
          filename: `../${pugPage.replace(/\.pug/, ".html")}`,
          inject: false,
        })
    ),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "../css/style.css",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: `${paths.src}/files`,
          to: `../files`,
          noErrorOnMissing: true,
        },
        {
          from: `${paths.src}/favicon.ico`,
          to: `../`,
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@scss": `${paths.assets}/scss`,
      "@js": `${paths.src}/js`,
      "@img": `${paths.assets}/img`,
      "@pug": `${paths.assets}/pug`,
    },
    extensions: [".pug", ".js", ".scss", ".json"],
  },
};
export default config;

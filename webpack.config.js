const path = require('path')
const webpack = require('webpack')
const cssimport = require('postcss-import')
const cssnext = require('postcss-cssnext')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')


const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.replace(' ', '') : 'development'
const env = {
  prod: NODE_ENV === 'production',
  dev: NODE_ENV === 'development' || NODE_ENV === 'testing',
  test: NODE_ENV === 'testing',
}
const nodeModulesRegexp = /node_modules/

const jsName = 'bundle' + (env.prod ? '-[hash]' : '') + '.js'
const cssName = 'bundle' + (env.prod ? '-[hash]' : '') + '.css'

const getJavaScriptLoaders = () => {
  if (!env.test) {
    return [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: nodeModulesRegexp,
      },
    ]
  }
  return [
    {
      test: /\.test\.js$/,
      loaders: ['babel'],
      exclude: nodeModulesRegexp,
    },
    {
      test: /\.js$/,
      loaders: ['isparta'],
      exclude: /node_modules|\.test\.js/,
    },
  ]
}

module.exports = {
  debug: !env.prod,
  devtool: !env.prod ? 'eval-source-map' : false,
  entry: !env.dev ?
    './src/client/' :
    [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      './src/client',
    ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: jsName,
    publicPath: '/static/',
  },
  node: env.test ? {
    fs: 'empty',
  } : {},
  module: {
    loaders: getJavaScriptLoaders().concat([
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.css$/,
        loader: env.dev ?
          'style-loader' +
          '!css-loader?modules' +
            '&localIdentName=[name]__[local]___[hash:base64:5]' +
          '!postcss-loader' :
          ExtractTextPlugin.extract(
            'style-loader',
            'css-loader?modules' +
              '&importLoaders=1' +
              '&localIdentName=[hash:base64:5]' +
            '!postcss-loader'
          ),
        exclude: nodeModulesRegexp,
      },
      {
        test: /\.svg$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
        exclude: nodeModulesRegexp,
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=10000&mimetype=image/png',
        exclude: nodeModulesRegexp,
      },
      {
        test: /\.gif$/,
        loader: 'url-loader?limit=10000&mimetype=image/gif',
        exclude: nodeModulesRegexp,
      },
    ]),
  },
  externals: {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
  postcss: [
    cssimport({
      path: ['src/client'],
    }),
    cssnext({
      browsers: env.dev ? ['last 2 Chrome versions'] : ['last 2 versions', 'ie 11'],
    }),
  ],
  resolve: {
    alias: {
    },
    modulesDirectories: [
      'node_modules',
      path.join(__dirname, 'src', 'client'),
    ],
    extensions: ['', '.js', '.json', '.css'],
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin(cssName, { allChunks: true }),
    new webpack.DefinePlugin({
      'process.env': {
        DEV: JSON.stringify(env.dev),
        TEST: JSON.stringify(env.test),
        NODE_ENV: `"${NODE_ENV}"`,
        API_HOST: process.env.API_HOST ? `"${process.env.API_HOST}"` : 'false',
      },
    }),
    new webpack.ProvidePlugin({
      key: 'keymaster',
    }),
  ].concat(!env.prod ? [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ] : [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: { drop_console: true },
    }),
    new webpack.ExtendedAPIPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ]),
}

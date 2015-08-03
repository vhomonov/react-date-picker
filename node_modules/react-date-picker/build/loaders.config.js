'use strict';

module.exports = [
  {
    test: /\.jsx$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  },
  {
    test: /\.jsx$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  },
  {
    test: /\.json$/,
    loader: 'json-loader'
  },
  {
    test: /\.styl$/,
    loader: 'style-loader!css-loader!stylus-loader'
  },
  {
    test: /\.css$/,
    loader: 'style-loader!css-loader'
  },
  {
    test: /\.png$/,
    loader: 'url-loader?mimetype=image/png'
  }
]
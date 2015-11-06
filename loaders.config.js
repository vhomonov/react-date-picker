module.exports = [
    {
        test: /\.jsx$/,
        loader: 'babel-loader'
    },
    {
        test: /\.js$/,
        loader: 'babel-loader'
    },
    {
        test: /\.json$/,
        loader: 'json-loader'
    },
    {
        test: /\.styl$/,
        loader: 'style!css!autoprefixer!stylus'
    },
    {
        test: /\.css$/,
        loader: 'style!css!autoprefixer'
    },
    {
        test: /\.png$/,
        loader: 'url-loader?mimetype=image/png'
    }
]
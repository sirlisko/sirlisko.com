var path = require('path')

module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, 'src/javascripts/modules'),
  entry: {
    base: ['./beacon', './ghost', './switchTitle'],
    trak: ['./beacon']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      exclude: '/node_modules/'
    }]
  },
  output: {
    filename: 'dist/js/[name].js'
  }
}

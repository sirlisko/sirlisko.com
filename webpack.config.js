const path = require('path')

module.exports = {
  devtool: 'source-map',
  devServer: {
    contentBase: './dist'
  },
  context: path.resolve(__dirname, 'src/javascripts/modules'),
  entry: {
    base: ['./beacon', './ghost', './switchTitle'],
    trak: ['./beacon']
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader'
      },
      exclude: '/node_modules/'
    }]
  },
  output: {
    filename: 'js/[name].js'
  }
}

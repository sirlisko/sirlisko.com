var path = require('path')

module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, 'src/javascripts/modules'),
  entry: {
    base: ['./beacon', './ghost', './switchTitle'],
    trak: ['./beacon']
  },
  output: {
    filename: 'dist/js/[name].js'
  }
}

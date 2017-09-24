module.exports = (ctx) => {
  console.log(ctx)
  return {
    map: ctx.options.map,
    plugins: {
      'postcss-import': {},
      'postcss-cssnext': {},
      'cssnano': { autoprefixer: false }
    }
  }
}

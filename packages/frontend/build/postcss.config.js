module.exports = ({ file, options, env }) => ({
  plugins: {
    'cssnano': options.cssnano ? options.cssnano : false
  }
})

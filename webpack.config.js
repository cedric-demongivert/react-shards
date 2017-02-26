module.exports = {
  'devtool': 'inline-source-map',
  'output': {
    'library': 'Kernel',
    'libraryTarget': 'umd'
  },
  'module': {
    'loaders': [
      {
        'test': /\.(js|jsx)$/,
        'exclude': /(node_modules|bower_components)/,
        'loader': 'babel-loader'
      }
    ]
  },
  'resolve': {
    'extensions': ['.js', '.jsx']
  },
  'externals': {
    'jsdom': 'window',
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/addons': true,
    'react/lib/ReactContext': 'window'
  }
}

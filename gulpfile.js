var elixir = require('laravel-elixir')

elixir(function (mix) {
  mix.webpack('./src/index.js', './dist/')
})

var context = require.context('./tests/', true, /\.spec\.(js|jsx)$/)
context.keys().forEach(context)

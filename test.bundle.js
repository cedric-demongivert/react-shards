var chai = require('chai'), spies = require('chai-spies');

chai.use(spies);

var context = require.context('./tests/', true, /\.spec\.(js|jsx)$/)
context.keys().forEach(context)

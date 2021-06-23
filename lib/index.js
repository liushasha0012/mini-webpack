const Compiler = require('./compiler.js');
const options = require('../simplepack.config.js');

let webpack = new Compiler(options);

webpack.run();
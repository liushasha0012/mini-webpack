const { getAST, getDependencies, transform } = require('./parser.js');
const path = require('path');

let ast = getAST(path.join(__dirname, '../src/index.js'));
let code = transform(ast);
// console.log(getDependencies(ast));
console.log(code);
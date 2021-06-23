const fs = require('fs');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const {transformFromAst} = require('babel-core');
module.exports = {
    getAST: (path) => {
        let source = fs.readFileSync(path, 'utf-8');

        return babylon.parse(source, {
            sourceType: 'module'
        });
    },
    getDependencies: (ast) => {
        let dependencies = [];
        traverse(ast, {
            ImportDeclaration: ({node}) => {
                dependencies.push(node.source.value);
            }
        });
        return dependencies;
    },
    transform: (ast) => {
        let { code } = transformFromAst(ast, null, {
            presets: ['env']  // 设置这个选项，就可以将 es6、es7等更高版本的 ECMAScript 转换为 es5。
        });
        return code;
    }
}
const {getAST, getDependencies, transform} = require('./parser');
const path = require('path');
const fs = require('fs');
module.exports = class Compiler {
    constructor(options) {
        let {entry, output} = options;
        this.entry = entry;
        this.output = output;
        this.module = []; // 存放所有的模块信息
    }
    run() {
        const entryModule = this.buildModule(this.entry, true);
        this.module.push(entryModule);
        this.module.map((_module) => {
            _module.dependencies.map((dependency) => {{
                this.module.push(this.buildModule(dependency));
            }})
        });

        this.emitFiles();
    }
    buildModule(filename, isEntry) {
        let ast;
        if(isEntry) {
            ast = getAST(filename);
        } else {
            let absolutePath = path.join(process.cwd(), `./src/${filename}`);
            ast = getAST(absolutePath);
        }

        return {
            filename,
            dependencies: getDependencies(ast),
            source: transform(ast)
        }
    }
    emitFiles() {
        let outputPath = path.join(this.output.path, this.output.filename);
        let modules = '';
        this.module.map((_module) => {
            modules += `'${_module.filename}': function(require, module, exports){${_module.source}},`;
        });
        const bundle = `(function(modules){
            function require(filename){
                var fn = modules[filename];
                var module = {
                    exports: {}
                }
                fn(require, module, module.exports);
                return module.exports;
            }
            require('${this.entry}')
        })({${modules}})`;
        fs.writeFileSync(outputPath, bundle, 'utf-8'); // 写出文件
    }
}
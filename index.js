/*
 * less自动编译
 * 用法： node index.js
 * walk包api地址(https://github.com/coolaj86/node-walk)
 **/

var fs = require('fs'),
    walk = require('walk'),
    exec = require('child_process').exec,
    path = require('path');

//设置lessc路径
var lessc = path.resolve('./node_modules/.bin/lessc.cmd');

var compire = function(filename) {
    var baseName = path.resolve(path.dirname(filename), path.basename(filename, '.less'));
    //运行lessc命令
    exec('' + lessc + ' ' + filename + ' > ' + baseName + '.css', { encoding: ''},
        function (err, stdout, stderr) {
        //如果有错，写入错误日志
        if (err != null) {
            fs.writeFile(baseName + '.log', err, '', function(error) {
                if(error) {
                    console.log('write file error:' + error);
                }
            });
        } else {
            console.log(baseName + '.css has render.');
        }
    });
};

// walk配置
var walker  = walk.walk('.', { followLinks: false });

walker.on('file', function(root, stat, next) {
    if(!/^.\/node_modules/.test(root) && /.less$/.test(stat.name)) {
        console.log(root + '/' + stat.name);
        (function(filename){
            compire(filename);
            fs.watch(filename ,function(event, name){
                if(event === 'change') {
                    compire(filename);
                }
            });
        })(root + '/' + stat.name);
    }

    next();
});
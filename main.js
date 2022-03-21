const path = require("path");
const fs = require("fs");
const dataUrl = path.dirname(process.execPath);

const $ = Seablue.$;

const configData = (dataUrl+'\\seaData\\data.txt').replace(/\\/g, '\\\\');
console.log(configData);
// 创建默认配置文件夹
fs.mkdir(dataUrl+'\\seaData',{recursive:true},(err)=>{
    if(err){
        throw err;
    }else{
        console.log('mkdir ok!');
    }
});

// 创建文件
const ws = fs.createWriteStream(configData,{ 
    'flags': 'a+' , 'encoding': "utf-8" , 'mode': 0666 // 添加流flags:a 覆盖流: 'flags': 'w' 
 });
ws.write('123=');
// 删除文件
fs.unlink(configData, (err)=>{
    if(err){
        throw err;
    }else{
        console.log('unlink ok!');
    }
});
// 查询文件
fs.readFile(configData,function(err,data) {
    data = data.toString();
    // err 代码错误优先机制
    if(err){
        console.log(err.stack);
        return;
    }
    console.log(data);
});
ws.end(); 

// 打开应用程序
const exec = require('child_process').execFile;

exec('D:\\\\Tools\\\\install\\\\Tencent\\\\QQ\\\\Bin\\\\QQ.exe', function (err, data) {
    if (err) {
        throw err;
    }
    console.log(data.toString());
});

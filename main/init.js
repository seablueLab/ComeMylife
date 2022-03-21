
//初始化
var win = nw.Window.get();
// 设置默认窗口大小
win.resizeTo(500, 560);
setTimeout(()=>{
    win.show();
    win.setPosition('center');
},200);

// Load native UI library
var isShowWindow = true;
var gui = require('nw.gui');
var win = gui.Window.get();
var tray = new gui.Tray({ title: 'seaNote - 笔记', icon: './img/sea-green.png' });
tray.tooltip = '点击显示/隐藏？ -seaNote';
//添加一个菜单
var menu = new gui.Menu();
menu.append(new gui.MenuItem({ type: 'normal', label: '退出', click: function(){
    win.close(true);
} }));
tray.menu = menu;
//click 托盘图标事件
tray.on('click',
    function() {
        if(isShowWindow){
            win.hide();
            isShowWindow = false;
        }
        else {
            win.show();
            isShowWindow = true;
        }
    }
);
win.on('close', function () {
    win.hide();
});
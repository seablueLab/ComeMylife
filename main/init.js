
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
var tray = new gui.Tray({ title: 'ComeMylife - 走向你', icon: './img/sea-green.png' });
tray.tooltip = '点击显示/隐藏？ - ComeMylife';
//添加一个菜单
var menu = new gui.Menu();
menu.append(new gui.MenuItem({ type: 'normal', label: '打开开发者模式', click: function(){
    win.showDevTools();
}}));
menu.append(new gui.MenuItem({ type: 'normal', label: '重新加载', click: function(){
    // 移除托盘图标
    tray.remove();
    tray = null;
    win.reload();
}}));
menu.append(new gui.MenuItem({ type: 'normal', label: '退出', click: function(){
    // 关闭时先进行隐藏以让用户觉得立即关闭
    win.hide();
    // 虽然关了,但实际上它还在工作
    if (win != null){
        win.close(true);
    }
    // 关闭新窗口也关闭主窗口
    this.close(true);
}}));
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
    isShowWindow = false;
});

// 禁用右击
document.onmousedown=disableclick;
function disableclick(event) {
    if(event.button==2) {
        return false;
    }
}
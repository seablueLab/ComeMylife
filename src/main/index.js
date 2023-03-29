import { app, BrowserWindow, ipcMain,Menu, Tray,globalShortcut } from 'electron'
import fs from 'fs'
import path from 'path'
import { log } from 'console'
import Store from 'electron-store'
const store = new Store({
    name: 'config',
    fileExtension: 'json'
});

/**build
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
let urlResources = app.getAppPath() + ''
const userData =urlResources.substring(0,urlResources.lastIndexOf("\\")+1)
let mainWindow,appTray,iconPath
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  console.log("用户数据存储:"+userData);
  app.setPath('userData', userData);
  // 限制只可以打开一个应用,2.x的文档
  const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
      mainWindow.show()
    }
  });
  if (isSecondInstance) {
    app.quit();
  }
  // Create myWindow, load the rest of the app, etc...
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    frame: false,
    transparent: true,
    // 设置此属性可消除字体模糊问题 backgroundColor: '#fff', 
    backgroundColor: '#00000000',
    useContentSize: true, 
    width: 500,   
    height: 580,
    minWidth: 500,  
    minHeight: 580, 
    offscreen: true,
    webPreferences: {
      webSecurity: false,
      // experimentalFeatures: true 苹果毛玻璃
    },
    resizable: true,
    skipTaskbar: false,
    flashFrame: true,
    show: false // 先隐藏
  });
  globalShortcut.register('Shift+Alt+CommandOrControl+I', () => {
    mainWindow.webContents.openDevTools({ mode: 'bottom' });
  })
  mainWindow.loadURL(winURL);
  mainWindow.center();
  // 被关闭
  mainWindow.on('closed', () => {
    mainWindow = null
  });
  // 启动完成 依赖store存储
  if(store.get('show')){
    mainWindow.hide();
  }else {
    mainWindow.show(); // 如果配置文件true 就显示
  }
  // 启动完成 不依赖store存储
  /* mainWindow.on('ready-to-show', function () {
    mainWindow.show() // 初始化后再显示
  }); */


  /* 
  // 鼠标穿透
  mainWindow.setIgnoreMouseEvents(true) */


  /**
   * 创建一个带图标的托盘应用static/ico/
   */
  //系统托盘右键菜单
  iconPath = 'ico/ico.png';
  if(!global.__static){
    iconPath = 'static/' + iconPath
  }else {
    iconPath = global.__static + '\\\\ico\\\\ico.png';
  }
  const trayMenuTemplate = [
    {
      type : 'checkbox',
      label: '开机启动',
      checked : app.getLoginItemSettings().openAtLogin,
      click : function () {
        if(!app.isPackaged){
          app.setLoginItemSettings({
            openAtLogin: !app.getLoginItemSettings().openAtLogin,
            path: process.execPath
          })
        }else{
          app.setLoginItemSettings({
            openAtLogin: !app.getLoginItemSettings().openAtLogin
          })
        }
        console.log(app.getLoginItemSettings().openAtLogin)
    }
  },{
      type : 'checkbox',
      label: '开机隐藏',
      checked : store.get('show'),
      click : function () {
        if(store.get('show')){
          store.set('show',false)
        }else {
          store.set('show',true);
        }
        console.log(store.get('show'));
    }
  },{
    label: "恢复窗口大小",
    click: function() {
      mainWindow.setSize(500,580);
      mainWindow.center();
    }
  },{
    label: "设置",
    click: function() {} //打开相应页面
  },{
      label: "退出",
      click: function() {
          //ipc.send('close-main-window');
          app.quit();
      }
  }
  ];
  appTray = new Tray(iconPath);
  //图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
  //设置此托盘图标的悬停提示内容
  appTray.setToolTip("日历 - Seablue\n点击显示/隐藏?");
  //设置此图标的上下文菜单
  appTray.setContextMenu(contextMenu);
/*   // 获取托盘所在位置信息
const { width, height, x, y } = appTray.getBounds();
// 获取窗口信息 win 是 BrowserWindow 对象
const [w, h] = mainWindow.getSize();
// 刚好在正上方
mainWindow.setPosition(x + width / 2 - w / 2, y - h - 10);
// 封装成函数
const aboveTrayPosition = (win, tray) => {
    const { width, height, x, y } = tray.getBounds();
    const [w, h] = win.getSize();
    return [x + width / 2 - w / 2, y - h - 10]
} */
  appTray.on("click", function() {
      //主窗口显示隐藏切换
      if(mainWindow.isVisible()){
        const s = 0.3;
        // 展示退出动画
        mainWindow.webContents.send("hide", s);
        // 退出动画加载完之后再隐藏程序
        setTimeout(() => {
            mainWindow.hide();
        }, s * 1000);
      }else {
        /* mainWindow.setSize(500,580);
        mainWindow.center(); */
        /* mainWindow.setPosition(...aboveTrayPosition(mainWindow, appTray)); */
        mainWindow.setSize(500,580);
        mainWindow.center();
        mainWindow.show();
        mainWindow.webContents.send("show");
      }
      appTray.setImage(iconPath);
        // 关闭托盘显示
        //appTray.destroy();
  });
} // 创建主窗口

// 创建窗口
app.on('ready', createWindow);
// 被关闭
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
// 激活
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
});
/**
 * Set signal communication
*/
// 创建通信
ipcMain.on('setData', (event, arg) => {
  let arr = arg.arr;
  const data = arg.data;
  arr.push(data);
  fs.writeFile(
    path.join(userData, '/seaData.json'),
    JSON.stringify(arr),
    { 
      'flag': 'w' , 'encoding': 'utf-8'
   },
    (err) => { 
      event.sender.send('data-reply', arg);
    }
  ); 
});
// 删除通信
ipcMain.on('delData', (event, arg) => {
  fs.writeFile(
    path.join(userData, '/seaData.json'),
    arg,
    { 
      'flag': 'w' , 'encoding': 'utf-8'
   },
    (err) => { 
      event.sender.send('data-reply', arg);
    }
  ); 
});
// xSystem
ipcMain.on('xSystem', (event, arg) => {
  mainWindow.minimize();
});
// tSystem
ipcMain.on('tSystem', (event, arg) => {
  const s = 0.3;
  // 展示退出动画
  mainWindow.webContents.send("hide", s);
  // 退出动画加载完之后再隐藏程序
  setTimeout(() => {
      mainWindow.hide();
  }, s * 1000);
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

/* \
        
    electron main 主要的

*/
/* process.env.IS_WEB 不存在启动vue-electron */
let SeablueConfig = {};
import Store from 'electron-store'
import fs from 'fs'
import { app, remote, ipcRenderer, shell } from 'electron'
const APP = process.type === 'renderer' ? remote.app : app
const store = new Store({
    name: 'taskes',
    fileExtension: 'json'
});
const configStore = new Store({
    name: 'config',
    fileExtension: 'json'
});
SeablueConfig._configStore = configStore
SeablueConfig._Store = store
SeablueConfig._fs = fs
SeablueConfig._remote = remote
SeablueConfig._shell = shell
SeablueConfig._ipcRenderer = ipcRenderer
SeablueConfig._app = APP
SeablueConfig._appData = APP.getAppPath()
SeablueConfig._userData = APP.getPath('userData')

window._SeablueConfig = SeablueConfig

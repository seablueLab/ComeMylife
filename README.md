# my

> An electron-vue project

#### Build Setup


``` bash
# 安装electron镜像   C盘用户-用户名下 yarnrc、npmrc文件中添加
disturl=https://registry.npmmirror.com/-/binary/node
electron_mirror=https://npmmirror.com/mirrors/electron/
electron-builder-binaries_mirror=https://registry.npmmirror.com/-/binary/electron-builder-binaries/



# 使用yarn 安装
yarn config set ignore-engines true    # 忽略 版本
# install dependencies
yarn / yarn install   
# serve with hot reload at localhost:9080
yarn run dev
# build electron application for production
yarn run build

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8d4ed60](https://github.com/SimulatedGREG/electron-vue/tree/8d4ed607d65300381a8f47d97923eb07832b1a9a) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

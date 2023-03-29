const { nextTick } = require("process");

new Vue({
    el: ".ComeMylife",
    data() {
        return {
            ComeMylifeTitle: '程序快捷方式管理程序',
            isNavArchive: false,
            isNavData: false,
            isNavFolder: false,
            isFolder: false,
            fileList: [],
            fileData: [],
            listI: null,
            listJ: null,
            comeMylifeForm: {
                archive: '',
            },
            ComeMylifefile: [],
            ComeMylifefolder: [],
            collection: [
                {
                    "id": "61ff96ac699ba458306e9f05",
                    "name": "收藏夹",
                    "parent": [
                        {
                            "id": "61ff96ac699ba458306e9f05",
                            "name": "前端",
                            "child": [
                                {
                                    "id": "61ff96ac699ba458306e9f05",
                                    "name": "webpack",
                                    "path": "https://www.w3school.com.cn/tags/att_a_target.asp",
                                }
                            ]
                        },{
                            "id": "61ff96ac699ba458306e9f05",
                            "name": "后端"
                        },
                    ]
                },{
                    "id": "61ff96ac699ba458306e9f05",
                    "name": "应用程序",
                    "path": "/D:/Warehouse/Git/dearmsdan/seablue/seablueServer/seaComments/index.html",
                }
            ],
        }
    },
    computed: {
        // VUE computed
        uploadList() {
            return this.$refs.upload.$refs['upload-inner'].fileList;
        },
        // NODE models
        _path() {
            return require("path");
        },
        _fs() {
            return require("fs");
        },
        // 数据存放路径
        _dataUrl() {
            return this._path.dirname(process.execPath);
        },
        _collectionUrl() {
            return (this._dataUrl+'\\seaData\\collection.txt').replace(/\\/g, '\\\\');
        },
        _folderUrl() {
            return (this._dataUrl+'\\seaData\\folder.txt').replace(/\\/g, '\\\\');
        },
    },
    methods: {
        // 弹出层示例
        dac() {
            this.$prompt('请输入新分类', '添加', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                value = value != null ? value : '';
                if(value != ''){

                }else {
                    this.$message({
                        type: 'error',
                        message: '不能为空'
                    });       
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消分类添加'
                });       
            });
        },
        // 创建归档
        onCreateArchive(){
            const arc = this.comeMylifeForm.archive;
            const id = parseInt(moment().format('YYYYMMDDhmmss'));
            let arr = {
                id: id,
                name: arc
            };
            if(arc != ''){
                this.ComeMylifefile.push(arr);
                this._addData(this._fs,this._collectionUrl,JSON.stringify(this.ComeMylifefile),()=>{
                    this.isNavArchive = false;
                    this._init();
                    this.comeMylifeForm.archive = '';
                });
            }
            
        },
        // 创建分类
        onCreateClassify(item,i){
            let obj = this.ComeMylifefile[i];
            obj.parent = obj.parent != undefined ? obj.parent : [];
            // 弹出框
            this.$prompt('请输入新分类', '添加', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                value = value != null ? value : '';
                if(value != ''){
                    const arr = {
                        id: parseInt(moment().format('YYYYMMDDhmmss')),
                        name: value
                    };
                    obj.parent.push(arr); 
                    this._addData(this._fs,this._collectionUrl,JSON.stringify(this.ComeMylifefile),()=>{
                        this._init();
                    });
                }else {
                    this.$message({
                        type: 'error',
                        message: '分类不能为空'
                    });       
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消分类添加'
                });       
            });
        },
        // 创建数据
        onCreateData(item,i,j) {
            this.isNavData = true;
            this.listI = i;
            this.listJ = j;
        },
        handleClose(done) {
            this.uploadClear();
            this.listI = null;
            this.listJ = null;
            done();

        },
        saveData(f,l) {
            let obj = this.ComeMylifefile[this.listI].parent[this.listJ];
            obj.child = obj.child != undefined ? obj.child : [];
            const name = f.raw.name;
            const path = f.raw.path;
            const type = f.raw.type;
            const suffix = f.raw.name.substr((f.raw.name.lastIndexOf("."))+1);
            const arr = {
                id: parseInt(moment().format('YYYYMMDDhmmss')),
                name: name,
                path: path,
                type: type,
                suffix: suffix,
            };
            obj.child.push(arr);
            this._addData(this._fs,this._collectionUrl,JSON.stringify(this.ComeMylifefile),()=>{
                console.log(f,l);
                this._init();
            });
        },
        // 删除归档
        onDeleteArchive(item,i){
          console.log(item,i);
          const h = this.$createElement;
          this.$confirm(h('p', null, [
            h('span', null, [
              h('span', null, '此操作将删除 '),
              h('b', { style: 'color: #CC0000' }, item.name),
              h('span', null, ' 是否继续?'),
            ]),
          ]), '删除', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let sub = this.ComeMylifefile.indexOf(item);
            this.ComeMylifefile.splice(sub,1);
            this._addData(this._fs,this._collectionUrl,JSON.stringify(this.ComeMylifefile),()=>{
                this._init();
            });
          }).catch(() => {
            console.log('取消删除');
          });
        },
        // 删除分类
        onDeleteClassify(item,i,j){
            console.log(item,i,j);
            const h = this.$createElement;
            this.$confirm(h('p', null, [
                h('span', null, [
                h('span', null, '此操作将删除 '),
                h('b', { style: 'color: #CC0000' }, item.name),
                h('span', null, ' 是否继续?'),
                ]),
            ]), '删除', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let sub = this.ComeMylifefile[i].parent.indexOf(item);
                this.ComeMylifefile[i].parent.splice(sub,1);
                this._addData(this._fs,this._collectionUrl,JSON.stringify(this.ComeMylifefile),()=>{
                    this._init();
                });
            }).catch(() => {
                console.log('取消删除');
            });
        },
        // 删除数据
        onDeleteData(item,i,j,k) {
            console.log(item,i,j,k);
            const h = this.$createElement;
            this.$confirm(h('p', null, [
                h('span', null, [
                h('span', null, '此操作将删除 '),
                h('b', { style: 'color: #CC0000' }, item.name),
                h('span', null, ' 是否继续?'),
                ]),
            ]), '删除', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let sub = this.ComeMylifefile[i].parent[j].child.indexOf(item);
                this.ComeMylifefile[i].parent[j].child.splice(sub,1);
                this._addData(this._fs,this._collectionUrl,JSON.stringify(this.ComeMylifefile),()=>{
                    this._init();
                });
            }).catch(() => {
                console.log('取消删除');
            });
        },
        // 修改归档
        onUpdateArchive(item,i) {
            this.$prompt('请输入新的归档名称', '修改', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                value = value != null ? value : '';
                if(value != ''){
                    this.ComeMylifefile[i].name = value;
                    this._addData(this._fs,this._collectionUrl,JSON.stringify(this.ComeMylifefile),()=>{
                        this._init();
                    });
                }else {
                    this.$message({
                        type: 'error',
                        message: '归档名称不能为空'
                    });       
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消修改归档名称'
                });       
            });
        },
        // 修改分类
        onUpdateClassify(item,i,j){
            this.$prompt('请输入新的分类名称', '修改', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                value = value != null ? value : '';
                if(value != ''){
                    this.ComeMylifefile[i].parent[j].name = value;
                    this._addData(this._fs,this._collectionUrl,JSON.stringify(this.ComeMylifefile),()=>{
                        this._init();
                    });
                }else {
                    this.$message({
                        type: 'error',
                        message: '分类名称不能为空'
                    });       
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消修改分类名称'
                });       
            });
        },
        // 修改数据
        onUpdateData(item,i,j,k) {
            console.log(item,i,j,k);
            this.$prompt('请输入新的数据名称', '修改', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                value = value != null ? value : '';
                if(value != ''){
                    this.ComeMylifefile[i].parent[j].child[k].name = value;
                    this._addData(this._fs,this._collectionUrl,JSON.stringify(this.ComeMylifefile),()=>{
                        this._init();
                    });
                }else {
                    this.$message({
                        type: 'error',
                        message: '数据名称不能为空'
                    });       
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消修改数据名称'
                });       
            });
        },
        // 跳转文件
        onHref(type,suffix,path) {
            console.log(type,path);
            suffix = suffix.toLowerCase();
            if(suffix === 'exe'){
                this._OpenEXE(path);
            }else {
                window.open(path);  
            }
        },
        // 跳转文件夹
        onFolderHref(name,path) {
            this._OpenFolder(path);
        },
        onExpander(id){
            // 点击打开分类
            $(this.$refs[id])
              .parent()
              .toggleClass('expanded')
              .find('>ol')
              .slideToggle();
        },
        
    /**
        * 导航
     */
        onNavHome() {
            this._init();
            this.isFolder = false;
        },
        onNavArchive() {
            this.isNavArchive = true;
        },
        onNavIsFolder() {
            this.isFolder = true;
        },
        onNavFolder() {
            this.isNavFolder = true;
            /* this.$nextTick(()=>{
                $('#Folder .el-upload__input')[0].webkitdirectory = true;
            }); */
        },
    /**
        * 上传目录
    */
        handSuccessFolder(e,f,l) {
            const id = parseInt(moment().format('YYYYMMDDhmmss'));
            let arr = {
                id: id,
                name: f.raw.name,
                path: f.raw.path.substring(0,(f.raw.path.lastIndexOf("\\"))+1),
            };
            this.ComeMylifefolder.push(arr);
            this._addData(this._fs,this._folderUrl,JSON.stringify(this.ComeMylifefolder),()=>{
                console.log(f,l);
                this._init();
            });
        },
        handleFolderClose(done) {
            this.uploadFoldeClear();
            done();
        },
        onUpdateFolder(item,i) {
            this.$prompt('请输入新的目录名称', '修改', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                value = value != null ? value : '';
                if(value != ''){
                    this.ComeMylifefolder[i].name = value;
                    this._addData(this._fs,this._folderUrl,JSON.stringify(this.ComeMylifefolder),()=>{
                        this._init();
                    });
                }else {
                    this.$message({
                        type: 'error',
                        message: '目录名不能为空'
                    });       
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消修改目录名'
                });       
            });
        },
        onDeleteFolder(item,i) {
          const h = this.$createElement;
          this.$confirm(h('p', null, [
            h('span', null, [
              h('span', null, '此操作将删除 '),
              h('b', { style: 'color: #CC0000' }, item.name),
              h('span', null, ' 是否继续?'),
            ]),
          ]), '删除', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let sub = this.ComeMylifefolder.indexOf(item);
            this.ComeMylifefolder.splice(sub,1);
            this._addData(this._fs,this._folderUrl,JSON.stringify(this.ComeMylifefolder),()=>{
                this._init();
            });
          }).catch(() => {
            console.log('取消删除');
          });
        },
    /**
        * 上传操作
     */
        onUploadSubmit() {
            if(this.uploadList.length > 0){
                this.uploadList.map((item)=>{
                    const arr = {
                        name: item.raw.name,
                        path: item.raw.path,
                        type: item.raw.type,
                    }
                    this.ComeMylifefile.push(arr);
                    console.log(this.ComeMylifefile);
                    this.uploadClear();
                });
            }
        },
        handleSuccess(e,f,l) {
            // 保存本地
            this.saveData(f,l);
        },
        handleRemove(file, fileList) {
          /* console.log(file, fileList); */
        },
        handlePreview(file) {
          console.log(file);
        },
        handleExceed(files, fileList) {
          this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeUpload(e) {
            let sum = 0;
            for (let i = 0; i < this.uploadList.length; i++) {
                const item = this.uploadList[i];
                if(item.raw.path === e.path){
                    sum++;
                    if(sum === 2){
                        return false
                    }
                }
                
            }
        },
        beforeRemove(file, fileList) {
          /* return this.$confirm(`确定移除 ${ file.name }？`); */
        },
        uploadClear() {
            return this.$refs.upload.clearFiles();
        },
        uploadFoldeClear() {
            return this.$refs.uploadFolder.clearFiles();
        },
    /**
        * NODE CRUD
    */
        _initMain(fs,dataUrl){
            // 创建默认配置文件夹
            fs.mkdir(dataUrl+'\\seaData',{recursive:true},(err)=>{
                if(err){
                    throw err;
                }else{
                    console.log('mkdir ok!');
                }
            });
            this._init();
        },
        _init(){
            this._getData(this._fs,this._collectionUrl,(data)=>{
                data = JSON.parse(data);
                this.ComeMylifefile = data;
                console.log(this.ComeMylifefile);
            });
            this._getData(this._fs,this._folderUrl,(data)=>{
                data = JSON.parse(data);
                this.ComeMylifefolder = data;
                console.log(this.ComeMylifefolder);
            });
        },
        _addData(fs,dataUrl,data,callback) {
            callback = callback || console.log;
            const ws = fs.createWriteStream(dataUrl,{ 
                'flags': 'w+' , 'encoding': "utf-8" , 'mode': 0666 // 添加流flags:a 覆盖流: 'flags': 'w' 
            });
            ws.write(data);
            ws.end(); 
            ws.on('finish',()=>{
                callback();
            })
            ws.on('error',()=>{
              console.log('写入失败');
            })
        },
        _delData(fs,dataUrl,callback) {
            callback = callback || console.log;
            fs.unlink(dataUrl, (err)=>{
                if(err){
                    throw err;
                }else{
                    console.log('unlink ok!');
                }
                callback();
            });
        },
        _getData(fs,dataUrl,callback) {
            callback = callback || console.log;
            // 查询文件
            fs.readFile(dataUrl,function(err,data) {
                data = data.toString();
                // err 代码错误优先机制
                if(err){
                    console.log(err.stack);
                    return;
                }
                callback(data);
            });
        },
        _OpenEXE(dataUrl) {
            const qqLib = 'D:\\\\Tools\\\\install\\\\Tencent\\\\QQ\\\\Bin\\\\QQ.exe';
            dataUrl = dataUrl || qqLib
            var exec = require('child_process').exec;
            exec('explorer.exe /select,'+dataUrl); 
        },
        _OpenFolder(dataUrl) {
            dataUrl = dataUrl || "D:\\\\Tools\\\\"
            require('child_process').exec('start "" '+dataUrl+'');
        },

    },
    created() {
        this._initMain(this._fs,this._dataUrl);
    }
})
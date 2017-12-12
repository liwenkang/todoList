### 你好,这是一个 todo 小应用(基于JavaScript)

#### 需要的依赖
1. [node.js](https://nodejs.org/en/)
2. [yarn](https://yarnpkg.com/zh-Hans/) 包管理器
3. [express](http://www.expressjs.com.cn/) 基于node.js的后端框架
```
进入当前目录后,在命令行中输入
yarn add express
```
4. [body-parser](https://github.com/expressjs/body-parser)     express.js的一个中间件,用于处理 JSON, Raw, Text 和 URL 编码的数据
```
yarn add body-parser
```
#### 使用方法:
1. 运行 server.js 后
2. 打开浏览器,输入 localhost:8081

#### 基础功能：
1. 显示所有todo
2. 增加todo(时间标签)
3. 更新todo(时间标签)
4. 删除todo
5. todo 数据存储
6. 下载自己的 todo 列表

#### 包含的文件如下:
<pre>
├─src
│    ├─css
│    │      bootstrap.min.css						// bootstrap 框架
│    │      cover.css								// 主 css
│    │      ie10-viewport-bug-workaround.css		// bootstrap 在 ie10 环境下的bug修复
│    │      reset.css								// css 重置
│    │
│    └─javascript
│            bug.js									// 记录了一些小问题
│            iconfont.js							// 图标
│            jquery-3.2.1.js						// jQuery 框架
│            main.js								// 主逻辑		
│            tools.js	  							// 工具
│
├─data												// 数据存放
├─index.html										// 首页
├─package.json										// 配置相关
├─README.md									
├─server.js											// 主服务
└─yarn.lock											// yarn 自动生成文件
</pre>

#### 存在的问题:
1. Chrome 点击事件偶尔抽风, Firefox 表示呵呵,这条需要尽快修复
2. 针对移动端的适配较差,需要改改 css
3. 输出的 todo 事件最好和 Excel 或者数据库软件关联一下,现在的输出是 JSON 格式,可读性差
4. 看看能不能加个导入 todo 列表的功能

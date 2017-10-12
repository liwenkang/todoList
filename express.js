//express_demo.js 文件
var express = require('express');
var app = express();

// 安装 $ npm install body-parser,用于处理 JSON, Raw, Text 和 URL 编码的数据。是一个中间件
var bodyParser = require('body-parser')
// 配置 body-Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 公共 文件
app.use(express.static('public'))

// 读取 文件
app.get('/', function(req, res) {
    var sendFile = function(path, res) {
		// var (fs) 是 file system 文件系统的缩写
        var fs = require('fs')
		// fs 是 node 中处理文件和目录的库
		
		//读取文件
        fs.readFile(path, {encoding: 'utf-8'}, function(err, data) {
            if (err) {
                console.log('错误', err)
            } else {
				//成功,将index.html的内容放在浏览器中
                res.send(data)
            }
        })
    }
    var path = 'index.html'
    sendFile(path, res)
})

// 读取 数据
app.get('/todo/all', function(req, res) {
    var sendFile = function(path, res) {
        var fs = require('fs')
        fs.readFile(path, {encoding: 'utf-8'}, function(err, data) {
            if (err) {
                console.log('错误', err)
            } else {
                res.send(data)
            }
        })
    }
	//将用户填写的todo保存在data里面
    var path = 'data'
    sendFile(path, res)
})

// 写入 数据
app.post('/todo/save', function (req, res) {
    var data = JSON.stringify(req.body)

    var fs = require("fs");
    fs.writeFile('data', data, function (err) {
        if (err) {
            res.send('错误！')
        } else {
            res.send('POST 数据已保存')
        }
    })
})

// 默认的端口是 80
// 所以如果你监听 80 端口的话，浏览器就不需要输入端口了
// 但是 1024 以下的端口是系统保留端口，需要管理员权限才能使用
//下面的8081如果你不喜欢的画,可以换一个...
var server = app.listen(8081, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

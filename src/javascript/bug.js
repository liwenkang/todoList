// 问题:使用node.js的框架express时,无法正确写入数据
// 解决方案:使用jqery进行ajax操作时,要根据自己指定的数据格式 contentType 的内容确保发送格式的正确
// 数据要存成{obj: value}的形式,再转成JSON格式

// 具体描述:index.html中引入的save函数如下所示,想要写入 $('#id-div-todoList').html() 这个字符串到文件data里面
var save = function () {
    var obj = {
        value: $('#id-div-todoList').html()
    }
    var text = obj
    $.ajax({
        url: '/todo/save',
        type: 'post',
        contentType: 'application/json',
        data: text,
        success: function() {
            console.log('保存成功',arguments)
        },
        error: function() {
            console.log('error',arguments)
        },
    })
}

//这是根目录下express.js的post用来写入数据
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

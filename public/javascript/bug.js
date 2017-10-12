//问题:使用node.js的框架express时,无法正确写入数据

//具体描述:index.html中引入的save函数如下所示,想要写入 $('#id-div-todoList').html() 这个字符串到文件data里面
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

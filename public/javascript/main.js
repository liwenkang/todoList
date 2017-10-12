//将数据库中存放的数据显示出来
var init = function (TODO) {
    //根据TODO,画一个界面
    for(var i = 0; i < getObjLength(TODO); i++) {
        $('#id-div-todoList')[0].insertAdjacentHTML('beforeend', `
            <div class="oneThing">
                <button class="button-finish">完成</button>
                <button class="button-delete">删除</button>
                <button class="button-edit">编辑</button>
                
                <span class="span-text">${TODO[i].text}</span>
                <span class="span-startTime">${TODO[i].startTime}</span>
                <span class="span-endTime">${TODO[i].endTime}</span>
            </div>
        `)
    }
}

//原先是从本地载入，现在我要通过ajax向服务器拿数据了,服务器存的是JSON,我要转成string
var load = function (TODO) {
    var callback = function(data) {
        TODO = JSON.parse(data)
        //这里需要一个根据TODO来初始化的问题
        init(TODO)
        //绑定事件
        bindEvents(TODO)
    }

    $.ajax({
        url: '/todo/all',
        type: 'get',
        contentType: "application/json; charset=utf-8",
        success: callback,//如果成功得到数据,就开始绑定事件
        error: function() {
            log('失败')
            console.log('错误！',arguments)
        }
    })
}

//原来是更改后保存到本地，现在我要把它存在服务器上了,本地的数据要变成 对象的形式
var save = function (TODO) {
    $.ajax({
        url: '/todo/save',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(TODO),
        success: function() {
            console.log('保存成功',arguments)
        },
        error: function() {
            console.log('error', arguments)
        },
    })
}

//获得时间
var getTime = function () {
    var t = new Date()
    return (t.getMonth() + 1) + "月" + t.getDate() + "日 " + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds()
}

//绑定add
var bindEventClickAdd = function (TODO) {
    $('#id-button-add').on('click', function () {
        var list = {
            index: getObjLength(TODO),
            text: $('#id-input-text').val(),
            startTime: 'startTime: ' + getTime(),
            endTime: ``,
        }

        $('#id-div-todoList')[0].insertAdjacentHTML('beforeend', `

            <div class="oneThing">
                <button class="button-finish">完成</button>
                <button class="button-delete">删除</button>
                <button class="button-edit">编辑</button>
                
                <span class="span-text">${list.text}</span>
                <span class="span-startTime">${list.startTime}</span>
                <span class="span-endTime"></span>
            </div>
                      
        `)

        TODO.push(list)
        save(TODO)
    })
}

//绑定reset
var bindEventClickReset = function (TODO) {
    $('#id-button-reset').on('click', function () {
        var todoList = $('#id-div-todoList')
        var input = $('#id-input-text')
        input.val("")
        todoList.html("")
        TODO.length = 0
        save(TODO)
    })
}

//获取当前list.index
var getIndexTODO = function (TODO, parent) {
    //先进入list,查看能不能对应,再返回来查index的值
    var index = 0
    for(var i = 0; i < getObjLength(TODO); i++) {
        if(TODO[i].text == parent.querySelector(".span-text").innerHTML &&
            TODO[i].startTime == parent.querySelector(".span-startTime").innerHTML) {
            //这时i就选对了
            // log(i)
            // log(index)
            index = i
        }
    }
    return index
}

//绑定finish,delete,edit
var bindEventClickFinishDeleteEdit = function (TODO) {
    $('#id-div-todoList').on('click', function (event) {
        var target = event.target
        var parent = target.parentNode
        if (target.classList.contains('button-finish')) {
            if (target.innerHTML == '完成') {
                target.innerHTML = '取消完成'
                //把编辑按钮改成灰色
                parent.querySelector(".button-edit").disabled = true
            } else if (target.innerHTML = '取消完成') {
                target.innerHTML = '完成'
                parent.querySelector(".button-edit").disabled = false
            }

            //改变它的样式,要获取到当前的list
            var endTime = getTime()

            //i是当前list的序列号
            var index = getIndexTODO(TODO, parent)

            if (parent.querySelector(".span-endTime").innerHTML) {
                parent.querySelector(".span-endTime").innerHTML = ''
                TODO[index].endTime = ''
            } else {
                parent.querySelector(".span-endTime").innerHTML = `endTime: + ${endTime}`
                TODO[index].endTime = `endTime: + ${endTime}`
            }

            toggleClass(parent.querySelector(".span-text"), "finished")
            toggleClass(parent.querySelector(".span-startTime"), "finished")
            toggleClass(parent.querySelector(".span-endTime"), "finished")

            save(TODO)
        } else if (target.classList.contains('button-delete')) {
            parent.remove()
            var index = getIndexTODO(TODO, parent)
            //移除这个TODO
            TODO.splice(index,1)
            //那么,index之后的list的index全部-1
            for(var i = index; i < getObjLength(TODO); i++) {
                if(TODO[i]) {
                    TODO[i].index = TODO[i].index - 1
                }
            }
            save(TODO)
        } else if (target.classList == 'button-edit') {
            var span = parent.querySelector(".span-text")
            span.setAttribute('contenteditable', 'true')
            span.focus()
        }
    })
}

//绑定Enter
var bindEventKeydown = function (TODO) {
    $('#id-div-todoList').on('keydown', function (event) {
        var edits = $('.span-text')
        for (var i = 0; i < edits.length; i++) {
            if (edits[i] == document.activeElement) {
                //获得焦点的是一个span元素
                if (event.key == 'Enter') {
                    //此时会出发BLUR事件
                    edits[i].blur()
                    event.preventDefault()
                }
            }
        }
    })
}

//绑定focusout
var bindEventBlur = function (TODO) {
    $('#id-div-todoList').on("focusout", function (event) {
        var target = event.target
        var parent = target.parentElement
        if (target.classList.contains('span-text')) {
            var newText = parent.querySelector('.span-text').innerHTML
            var span = parent.querySelector('.span-text')
            span.innerHTML = newText
            //i是当前list的序列号
            var index = getIndexTODO(TODO, parent)
            TODO[index].text = newText
            span.setAttribute('contenteditable', 'false')
            //这里的TODO也要改变
            //失去焦点后TODO也要变
            save(TODO)
        }
    })
}

//绑定所有事件
var bindEvents = function (TODO) {
    //添加事件
    bindEventClickAdd(TODO)

    //重置
    bindEventClickReset(TODO)

    //完成和删除事件
    bindEventClickFinishDeleteEdit(TODO)

    //失去焦点,自动保存
    bindEventBlur(TODO)

    //编辑的时候,回车自动保存
    bindEventKeydown(TODO)
}

var __main = function () {
    //总的todo列表
    var TODO = []
    //初始化
    load(TODO)
}

window.onload = function () {
    __main()
}
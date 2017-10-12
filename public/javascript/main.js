//将数据库中存放的数据显示出来
var init = function (TODO) {
    //根据TODO,画一个界面
    for(var i = 0; i < getObjLength(TODO); i++) {
        if(TODO[i].finished) {
            //完成了,就返回一个撤回的svg
            $('#id-div-todoList')[0].insertAdjacentHTML('beforeend', `
            <div class="oneThing">
                <button class="button-finish">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-cancel"></use>                  
                    </svg>
                </button>
                
                <button class="button-delete">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-shanchu"></use>
                    </svg>
                </button>
                
                <button class="button-edit">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-bianji"></use>
                    </svg>
                </button>
                <span class="span-index finished">${TODO[i].index}</span>
                <span class="span-text finished">${TODO[i].text}</span>
                <span class="span-startTime finished">${TODO[i].startTime}</span>
                <span class="span-endTime finished">${TODO[i].endTime}</span>
            </div>
        `)
        }else {
            //没完成,就返回一个完成的svg
            $('#id-div-todoList')[0].insertAdjacentHTML('beforeend', `
            <div class="oneThing">
                <button class="button-finish">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-wancheng"></use>                  
                    </svg>
                </button>
                
                <button class="button-delete">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-shanchu"></use>
                    </svg>
                </button>
                
                <button class="button-edit">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-bianji"></use>
                    </svg>
                </button>
                <span class="span-index">${TODO[i].index}</span>
                <span class="span-text">${TODO[i].text}</span>
                <span class="span-startTime">${TODO[i].startTime}</span>
                <span class="span-endTime">${TODO[i].endTime}</span>
            </div>
        `)
        }
    }
}

//原先是从本地载入，现在我要通过ajax向服务器拿数据了,服务器存的是JSON,我要转成string
var load = function (TODO) {
    var callback = function(data) {
        //如果用户自己上传文件的话,TODO就要改变
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
            bindEvents(TODO)
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
    return formatTime(t.getMonth() + 1) + "月" + formatTime(t.getDate()) + "日 " + formatTime(t.getHours()) + ":" + formatTime(t.getMinutes()) + ":" + formatTime(t.getSeconds())
}

var formatTime = function (n) {
    if(n < 10) {
        return '0' + n
    }else {
        return n
    }
}

//绑定add
var bindEventClickAdd = function (TODO) {
    $('#id-button-add').on('click', function () {
        var list = {
            index: getObjLength(TODO),
            text: $('#id-input-text').val(),
            startTime: 'startTime: ' + getTime(),
            endTime: ``,
            finished:false,
        }
        if(list.text == '') {
            log('你咋啥都没填?')
        }else {
            $('#id-div-todoList')[0].insertAdjacentHTML('beforeend', `
            <div class="oneThing">
                <button class="button-finish">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-wancheng"></use>
                    </svg>
                </button>
                
                <button class="button-delete">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-shanchu"></use>
                    </svg>
                </button>
                
                <button class="button-edit">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-bianji"></use>
                    </svg>
                </button>
                <span class="span-index">${list.index}</span>
                <span class="span-text">${list.text}</span>
                <span class="span-startTime">${list.startTime}</span>
                <span class="span-endTime"></span>
            </div> 
        `)
            TODO.push(list)
            save(TODO)
        }
    })
}

//绑定reset
var bindEventClickReset = function (TODO) {
    $('#id-button-RESET').on('click', function () {
        if (!confirm("还想重置?事都干完了?")) {
            log('你咋反悔了?')
        }else {
            var todoList = $('#id-div-todoList')
            var input = $('#id-input-text')
            input.val("")
            todoList.html("")
            TODO.length = 0
            save(TODO)
        }
    })
}

//获取当前list.index
var getIndexTODO = function (TODO, parent) {
    //点击完成时,要得到当前事件的序号是多少
    var index = 0
    for(var i = 0; i < getObjLength(TODO); i++) {
        if(i == parent.querySelector('.span-index').innerText) {
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

            var index = getIndexTODO(TODO, parent)
            //点击完成时,如果还未完成,就把图标换成cancel
            if (!TODO[index].finished) {
                target.innerHTML = `
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-cancel"></use>
                    </svg>
                `
                TODO[index].finished = true
                //把编辑按钮改成灰色
                parent.querySelector(".button-edit").disabled = true
            } else {
                target.innerHTML = `
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-wancheng"></use>
                    </svg>
                `
                TODO[index].finished = false
                parent.querySelector(".button-edit").disabled = false
            }

            //改变它的样式,要获取到当前的list
            var endTime = getTime()

            if (parent.querySelector(".span-endTime").innerHTML) {
                parent.querySelector(".span-endTime").innerHTML = ''
                TODO[index].endTime = ''
            } else {
                parent.querySelector(".span-endTime").innerHTML = `endTime: + ${endTime}`
                TODO[index].endTime = `endTime: + ${endTime}`
            }

            toggleClass(parent.querySelector(".span-index"), "finished")
            toggleClass(parent.querySelector(".span-text"), "finished")
            toggleClass(parent.querySelector(".span-startTime"), "finished")
            toggleClass(parent.querySelector(".span-endTime"), "finished")

            save(TODO)
        } else if (target.classList.contains('button-delete')) {
            if (!confirm("确认要删除？")) {
                log('你咋反悔了?')
            }else {
                parent.remove()
                var index = getIndexTODO(TODO,parent)
                //移除这个TODO
                TODO.splice(index,1)
                //那么,index之后的list的index全部-1
                for(var i = index; i < getObjLength(TODO); i++) {
                    if(TODO[i]) {
                        TODO[i].index = TODO[i].index - 1
                    }
                }
                save(TODO)
            }
        } else if (target.classList == 'button-edit') {
            var span = parent.querySelector(".span-text")
            span.setAttribute('contenteditable', 'true')
            span.focus()
        }
    })
}

//绑定Enter
var bindEventKeydown = function () {
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
//载入
var load = function() {
   if(localStorage.needStorage) {
       var s = localStorage.needStorage
       return JSON.parse(s)
   }else {
       return ""
   }
}

//更改后保存
var changeAndSave = function () {
       var todoList = $('#id-div-todoList')
       var s = JSON.stringify(todoList.html())
       localStorage.needStorage = s
}

//初始化
var init = function () {
       var todoList = $('#id-div-todoList')
       todoList.html(load())
}

//获得时间
var getTime = function () {
    var t = new Date()
    return (t.getMonth()+1) + "月" + t.getDate() + "日 " + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds()
}

//绑定add
var bindEventClickAdd = function () {
    $('#id-button-add').on('click',function () {
        var value = $('#id-input-text').val()
        var startTime = getTime()
        $('#id-div-todoList')[0].insertAdjacentHTML('beforeend',`
                <div class="oneThing">
                    <button class="button-finish">完成</button>
                    <button class="button-delete">删除</button>
                    <button class="button-edit">编辑</button>
                    <span class="span-text">${value}</span>
                    <span class="span-startTime">startTime: ${startTime} </span>
                    <span class="span-endTime"></span>
                </div>
        `)
        changeAndSave()
    })
}

//绑定reset
var bindEventClickReset = function () {
    $('#id-button-reset').on('click',function () {
        var todoList = $('#id-div-todoList')
        var input = $('#id-input-text')
        input.val("")
        todoList.html("")
        localStorage.needStorage = ""
    })
}

//绑定finish,delete,edit
var bindEventClickFinishDeleteEdit = function () {
    $('#id-div-todoList').on('click', function(event){
        var target = event.target
        var parent = target.parentNode
        if(target.classList.contains('button-finish')) {
            if(target.innerHTML == '完成') {
                target.innerHTML = '取消完成'
                //把编辑按钮改成灰色
                parent.querySelector(".button-edit").disabled = true
            }else if(target.innerHTML = '取消完成'){
                target.innerHTML = '完成'
                parent.querySelector(".button-edit").disabled = false
            }

            //改变它的样式
            var endTime = getTime()
            if(parent.querySelector(".span-endTime").innerHTML) {
                parent.querySelector(".span-endTime").innerHTML = ''
            }else {
                parent.querySelector(".span-endTime").innerHTML = 'endTime: ' + endTime
            }

            toggleClass(parent.querySelector(".span-text"), "finished")
            toggleClass(parent.querySelector(".span-startTime"), "finished")
            toggleClass(parent.querySelector(".span-endTime"), "finished")

            changeAndSave()
        } else if (target.classList.contains('button-delete')) {
            parent.remove()
            changeAndSave()
        } else if(target.classList == 'button-edit') {
            var span = parent.querySelector(".span-text")
            span.setAttribute('contenteditable','true')
            span.focus()
        }
    })
}

//绑定Enter
var bindEventKeydown = function () {
    $('#id-div-todoList').on('keydown', function(event){
        var edits = $('.span-text')
        for(var i = 0; i < edits.length; i++) {
            if(edits[i] == document.activeElement) {
                //获得焦点的是一个span元素
                if(event.key == 'Enter'){
                    edits[i].blur()
                    event.preventDefault()
                    changeAndSave()
                }
            }
        }
    })
}

//绑定focusout
var bindEventBlur = function () {
    $('#id-div-todoList').on("focusout", function(event) {
        var target = event.target
        var parent = target.parentElement
        if(target.classList.contains('span-text')) {
            var newText = parent.querySelector('.span-text').innerHTML
            var span = parent.querySelector('.span-text')
            span.innerHTML = newText
            span.setAttribute('contenteditable','false')
            changeAndSave()
        }
    })
}

var bindEvents = function () {
    //添加事件
    bindEventClickAdd()

    //重置
    bindEventClickReset()

    //完成和删除事件
    bindEventClickFinishDeleteEdit()

    //失去焦点,自动保存
    bindEventBlur()

    //编辑的时候,回车自动保存
    bindEventKeydown()
}

var __main = function () {
    //绑定事件
    bindEvents()

    //初始化
    init()
}

window.onload = function () {
    __main()
}
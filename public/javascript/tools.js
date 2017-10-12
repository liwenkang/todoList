var log = console.log.bind(console)
//log(typeof string)
//log(`(${string})`)   you will know the length
//log(string.length)

//for test
var ensure = function(condition, message) {
    // 在条件不成立的时候, 输出 message
    if(!condition) {
        log('*** 测试失败 ***', message)
    }
}
// ensure(a===b, 'wrong')

//slide
var fuckSlide = function(element, images) {
    //!!!!    rely on jquery-3.2.1.js   !!!!!!
    /*
    element 是一个 div 容器, DOM 类型, 创建的 slide 就 append 到这个容器中
    images 是一个包含了图片地址的 array
    */
    var addImgBig = ``
    for(var i = 0; i < images.length; i++) {
        if(i == 0) {
            addImgBig += `<img src="${images[i]}" alt="" class="slide-img slide-img-active">`
        }else {
            addImgBig += `<img src="${images[i]}" alt="" class="slide-img">`
        }
    }

    var addImgSmall = ``
    for(var j = 0; j < images.length; j++) {
        if(j == 0) {
            addImgSmall += `<img class="slide-i slide-i-active" src="${images[j]}">`
        }else {
            addImgSmall += `<img class="slide-i" src="${images[j]}">`
        }
    }

    var t = `
            <div class="slide">
                <div class="slide-imgs" data-active="0" data-imgs=${images.length}>
                    ${addImgBig}
                    <button type="button" class="slide-button slide-button-left vertical-center">left</button>
                    <button type="button" class="slide-button slide-button-right vertical-center">right</button>
                </div>
                <div class="slide-indicators" data-active="0" data-index=${images.length}>
                    ${addImgSmall}
                </div>
            </div>`

    element.append(t)

    var style = `
            <style>
                .vertical-center {
                    top: 50%;
                    position: relative;
                    transform: translateY(-50%);
                  }
                .slide {
                    width: 300px;
                    height: 200px;
                    overflow: hidden;
                    position: relative;
                }
                .slide-img {
                    display: none;
                }
                .slide-img-active {
                    display: block;
                }
                .slide-imgs {
                    width: 100%;
                    height: 100%;
                }
                .slide-button {
                    position: absolute;
                }
                .slide-button-left {
                    left: 0px;
                }
                .slide-button-right {
                    right: 0px;
                }
                .slide-indicators {
                    position: relative;
                    bottom: 20px;
                    left: 0;
                    text-align: center;
                }
                .slide-i {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    overflow: hidden;
                    background-color: #000;
                    border-radius: 50%;
                    color: #fff;
                }
                .slide-i-active {
                    background-color: red;
                    border: 2px solid red;
                }
            </style>
        `
    $('head').append(style)

    //next img
    var play = function (offset) {
        var activeImg = $('.slide-imgs').data('active')
        var numberOfImgs = $('.slide-imgs').data('imgs')
        var i = (activeImg + offset + numberOfImgs) % numberOfImgs

        //change i
        $('.slide-imgs').data('active', i)

        //remove class
        $('.slide-img-active').removeClass('slide-img-active')
        $('.slide-i-active').removeClass('slide-i-active')

        //add class
        var activeImg = $($('.slide-img')[i])
        activeImg.addClass('slide-img-active')

        var activeIndicator = $($('.slide-i')[i])
        activeIndicator.addClass('slide-i-active')
    }

    var playNext = function () {
        play(1)
    }

    var playPrev = function () {
        play(-1)
    }

    $('.slide-button').on('click', function (event) {
        var button = $(event.target)
        if(button.hasClass('slide-button-left')) {
            playPrev()
        }else {
            playNext()
        }
    })

    $('.slide-i').on('mouseover', function (event) {
        var indicator = $(event.target)
        //get the number
        var i = indicator.attr('src').slice(0, 1) - 1

        //remove class
        $('.slide-i-active').removeClass('slide-i-active')
        $('.slide-img-active').removeClass('slide-img-active')

        //add class
        indicator.addClass('slide-i-active')
        var activeImg = $($('.slide-img')[i])
        activeImg.addClass('slide-img-active')
    })

    $('.slide-i').on('click', function (event) {
        var indicator = $(event.target)
        var i = indicator.attr('src').slice(0, 1) - 1

        //remove class
        $('.slide-i-active').removeClass('slide-i-active')
        $('.slide-img-active').removeClass('slide-img-active')

        //add class
        indicator.addClass('slide-i-active')
        var activeImg = $($('.slide-img')[i])
        activeImg.addClass('slide-img-active')
    })
}
// GuaSlide($("#fuck"), [
//     '1.jpg',
//     '2.jpg',
//     '3.jpg',
// ]);


//获取对象的属性个数
var getObjLength = function (obj) {
    var count = 0
    for(var i in obj) {
        if(obj.hasOwnProperty(i)) {  // 建议加上判断,如果没有扩展对象属性可以不加
            count++
        }
    }
    return count

    //不考虑扩展对象时，可以用下面的
    //return Object.getOwnPropertyNames(obj).length
}

// attribute 开关 jquery中可以原生实现
var toggleAttribute = function(element, attribute) {
    if (element.getAttribute(attribute) == 'true') {
        element.setAttribute(attribute, 'false')
    } else if(element.getAttribute(attribute) == 'false'){
        element.setAttribute(attribute, 'true')
    }
}

// class 开关
var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}


/*
按照功能, jQuery 常见的用法划分如下

// a. 选择器
// 1. $
// 2. find
// 3. siblings
// 4. closest, parent

$('body')
$('#id-button-add')
$('.cell')


b. dom 操作
1. append //add
2. remove //delete
3. empty //delete all son
4. show, hide, toggle //you,mei,you


c. class 操作
1. addClass removeClass //add class delete class
2. toggleClass //open or close claa


d. 属性、特性操作
1. attr, prop, data
2. removeAttr


e. 取值
1. val  //input.val
2. text //stay original
3. html //change what he want to change


f. 事件
1. on
2. change
3. event.target


g. 数组方法
1. each
2. map
3. grep

h. ajax
1. contentType, dataType
* */


// 让人快乐的 DOM 写法
// addEventListener/removeEventListener 太长了 , on off 替换
EventTarget.prototype.on = EventTarget.prototype.addEventListener
EventTarget.prototype.off = EventTarget.prototype.removeEventListener
// 简写 document
var doc = document
// 模拟 Jquery 使用 $
// 最简易的选择器
function $() {
  var a = arguments
  var l = a.length
  if (l === 1) {
    // $('.panel')
    return document.querySelector(a[0])
  } else if (l === 2) {
    // $(body,'.panel')
    return a[0].querySelector(a[1])
  }
}

// 复选
// $s('.abc')
// $s{parent,'.abc'}
function $s() {
  var args = arguments
  var len = args.length

  if (len === 1) {
    return document.querySelectorAll(args[0])
  } else if (len === 2) {
    return args[0].querySelectorAll(args[1])
  }
}

// 批量的 setAttribute 写烦了
function setAttrs(el, attrsObj) {
  for (let key in attrsObj) {
    el.setAttribute(key, attrsObj[key])
  }
}

// 批量的 style 写烦了
function setStyles(el, stylesObj) {
  for (let key in stylesObj) {
    el.style[key] = stylesObj[key]
  }
}

function setAbsPos(el, { top, left, right, bottom, transform }) {
  if (top) {
    el.style.removeProperty('bottom')
    el.style.top = top
  } else if (bottom) {
    el.style.removeProperty('top')
    el.style.bottom = bottom
  }
  if (left) {
    el.style.removeProperty('right')
    el.style.left = left
  } else if (right) {
    el.style.removeProperty('left')
    el.style.right = right
  }

  if (transform) {
    el.style.transform = transform
  }
}
// 对绝对定位进行解析
// setAbsPos('left') -> 'position:absolute;transform(0,-50%)'
function absPos(v, { top, left, right, bottom } = {}) {
  if (typeof v !== 'string') v = ''
  let x, y
  if (top === undefined) top = 0
  if (left === undefined) left = 0
  if (right === undefined) right = 0
  if (bottom === undefined) bottom = 0
  let pS = { position: 'absolute' }
  const _ = (v, v_) => v.indexOf(v_) !== -1
  if (_(v, 'top')) {
    pS.top = top + 'px'
    y = '0px'
  }
  if (_(v, 'bottom')) {
    pS.bottom = bottom + 'px'
    y = '0px'
  }
  if (_(v, 'left')) {
    pS.left = left + 'px'
    x = '0px'
  }
  if (_(v, 'right')) {
    pS.right = right + 'px'
    x = '0px'
  }
  // 如果省缺就是 center
  if (y !== '0px') {
    pS.top = '50%'
    y = '-50%'
  }
  if (x !== '0px') {
    pS.left = '50%'
    x = '-50%'
  }
  pS.transform = `translate(${x},${y})`
  return pS
}

function absPosStr(absO) {
  let str = ''
  for (let key in absO) {
    str += key + ':' + absO[key] + ';'
  }
  return str
}
// 对 padding 进行解析
// 这个虽然不是 computedStyle
// 但是也类似, 写一起吧
function paddingBox(value, width, height) {
  if (typeof value === 'number') {
    return {
      top: value,
      bottom: value,
      left: value,
      right: value,
    }
  } else if (typeof value === 'string') {
    let arr = value.split(' ')
    if (arr.length === 1) {
      return {
        top: _(arr[0], height),
        bottom: _(arr[0], height),
        left: _(arr[0], width),
        right: _(arr[0], width),
      }
    } else if (arr.length === 2) {
      return {
        top: _(arr[0], height),
        left: _(arr[1], width),
        bottom: _(arr[0], height),
        right: _(arr[1], width),
      }
    } else if (arr.length === 3) {
      return {
        top: _(arr[0], height),
        left: _(arr[1], width),
        bottom: _(arr[2], height),
        right: _(arr[1], width),
      }
    } else if (arr.length > 3) {
      return {
        top: v(arr[0], height),
        left: _(arr[1], width),
        bottom: _(arr[2], height),
        right: _(arr[3], width),
      }
    }
  }
  // 30% 而非 0.3
  // 0.3 是一个挺好的注意,但是容易混乱
  function _(value, value1) {
    if (!value1) {
      return Number(value)
    }
    if (value.charAt(value.length - 1) === '%') {
      return (parseFloat(value) / 100) * value1
    } else {
      return Number(value)
    }
  }
}

// 可以接收两种参数
// 一种是直接的元素
// 一种是 selector 都可以用
function getElement(selector) {
  if (typeof selector === 'string') {
    return $(selector)
  } else if (selector instanceof Element) {
    return selector
  }
}

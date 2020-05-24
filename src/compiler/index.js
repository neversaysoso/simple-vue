import Watcher from "../observer/watcher"
import {
  throttle
} from '../utils/index'

export class Compile {
  constructor(el, vm) {
    this.$el = document.querySelector(el)
    this.$vm = vm

    if (this.$el) {
      this.$fragment = this.node2Fragment(this.$el)
      this.compile(this.$fragment)
      this.$el.appendChild(this.$fragment)
    }
  }

  node2Fragment(el) {
    const frag = document.createDocumentFragment()
    let child
    while (child = el.firstChild) {
      frag.appendChild(child)
    }
    return frag
  }

  compile(el) {
    const childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isElement(node)) {
        // console.log('元素' + node.nodeName)
        const nodeAttr = node.attributes
        Array.from(nodeAttr).forEach(attr => {
          const attrName = attr.name
          const exp = attr.value
          if (this.isDirective(attrName)) {
            const dir = attrName.substring(2)
            this[dir] && this[dir](node, this.$vm, exp)
          }
          if (this.isEvent(attrName)) {
            const dir = attrName.substring(1)
            this.eventHandler(node, this.$vm, exp, dir)
          }
        })
      } else if (this.isInterpolation(node)) {
        // console.log('文本' + node.textContent)
        this.compileText(node)
      }
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }

  // 事件处理
  eventHandler(node, vm, exp, dir) {
    let fn = vm.$options.methods && vm.$options.methods[exp]
    if (dir && fn) {
      node.addEventListener(dir, fn.bind(vm))
    }
  }

  // 双向绑定
  model(node, vm, exp) {
    this.update(node, vm, exp, 'model')
    node.addEventListener('input', throttle(e => {
      vm[exp] = e.target.value
    }))
  }

  modelUpdater(node, value) {
    node.value = value
  }

  text(node, vm, exp) {
    this.update(node, vm, exp, 'text')
  }

  html(node, vm, exp) {
    this.update(node, vm, exp, 'html')
  }

  isDirective(attr) {
    return attr.indexOf('v-') === 0
  }

  isEvent(attr) {
    return attr.indexOf('@') === 0
  }

  compileText(node) {
    this.update(node, this.$vm, RegExp.$1, 'text')
  }

  update(node, vm, exp, dir) {
    const updateFn = this[dir + 'Updater']
    updateFn && updateFn(node, vm[exp])
    new Watcher(vm, exp, val => {
      updateFn && updateFn(node, val)
    })
  }

  textUpdater(node, value) {
    node.textContent = value
  }

  htmlUpdater(node, value) {
    node.innerHTML = value
  }

  isElement(node) {
    return node.nodeType === 1
  }

  isInterpolation(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
}
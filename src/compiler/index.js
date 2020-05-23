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
        console.log('元素' + node.nodeName)
      } else if (this.isInterpolation(node)) {
        console.log('文本' + node.textContent)
      }
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }

  isElement(node) {
    return node.nodeType === 1
  }

  isInterpolation(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
}
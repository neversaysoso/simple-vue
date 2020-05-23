import {
  initState
} from './state'

import {
  Compile
} from './compiler/index'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options

    initState(vm)

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    // const vm = this
    // const options = vm.$options
    // el = document.querySelector(el)

    // if (!options.render) {
    //   let template = options.template
    //   if (!template && el) {
    //     template = el.outerHTML
    //   }

    //   const render = compileToFunction(template)
    //   options.render = render
    // }
    // options.render
    new Compile(el, this)
  }
}
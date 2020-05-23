import {
  observe
} from './observer/index'

import Dep from './observer/dep'

import Watcher from './observer/watcher'

export function initState(vm) {
  const opts = vm.$options
  // if (opts.props) {
  //   initProps(vm)
  // }

  // if (opts.methods) {
  //   initMethod(vm)
  // }

  if (opts.data) {
    initData(vm)
  }

  // if (opts.computed) {
  //   initComputed(vm)
  // }

  // if (opts.watch) {
  //   initWatch(vm)
  // }
}

function initProps() {}

function initMethod() {}

function initData(vm) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data

  observe(data)

  new Watcher()
  vm._data.name
}

function initComputed() {}

function initWatch() {}
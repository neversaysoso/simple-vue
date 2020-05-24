import {
  isObject,
  def
} from '../utils/index'

import {
  arrayMethods
} from './array'

import Dep from './dep'

class Observer {
  constructor(value, vm) {
    this.value = value
    this.vm = vm
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
      this.proxyData(key)
    })
  }

  observeArray(value) {
    value.forEach(v => {
      observe(v)
    })
  }

  proxyData(key) {
    Object.defineProperty(this.vm, key, {
      get() {
        return this._data[key]
      },
      set(newVal) {
        this._data[key] = newVal
      }
    })
  }

  defineReactive(data, key, value) {
    observe(value, this.vm) // 递归实现深度检测
    const dep = new Dep()
    Object.defineProperty(data, key, {
      set(newVal) { // 观察者
        if (newVal == value) return
        // observe(value, this.vm) // 如果更新了一个对象 则继续检测
        value = newVal
        dep.notify()
        console.log('set')
      },
      get() {
        Dep.target && dep.addDep(Dep.target)
        console.log('get')
        return value
      }
    })
  }
}

export function observe(data, vm) {
  let isObj = isObject(data)
  if (!isObj) {
    return
  }
  return new Observer(data, vm)
}
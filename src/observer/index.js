import {
  isObject,
  def
} from '../utils/index'

import {
  arrayMethods
} from './array'

import Dep from './dep'

import Watcher from './watcher'

class Observer {
  constructor(value) {
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods
      this.observeArray(value)
    } else {
      this.walk(value)
    }
    new Watcher()
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }

  observeArray(value) {
    value.forEach(v => {
      observe(v)
    })
  }
}

export function defineReactive(data, key, value) {
  observe(value) // 递归实现深度检测
  const dep = new Dep()
  Object.defineProperty(data, key, {
    set(newVal) { // 观察者
      if (newVal == value) return
      observe(value) // 如果更新了一个对象 则继续检测
      value = newVal
      dep.notify()
    },
    get() {
      Dep.target && dep.addDep(Dep.target)
      return value
    }
  })
}

export function observe(data) {
  let isObj = isObject(data)
  if (!isObj) {
    return
  }
  return new Observer(data)
}
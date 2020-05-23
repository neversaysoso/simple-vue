import {
  isObject,
  def
} from '../utils/index'

import {
  arrayMethods
} from './array'

class Observer {
  constructor(value) {
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
      defineReactive(data, key, data[key])
    })
  }

  observeArray(value) {
    value.forEach(v => {
      observe(v)
    })
  }
}

function defineReactive(data, key, value) {
  observe(value) // 递归实现深度检测
  Object.defineProperty(data, key, {
    set(newVal) {
      if (newVal !== value) {
        console.log('更新数据')
        observe(value)
        value = newVal
      } else {
        return
      }
    },
    get() {
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
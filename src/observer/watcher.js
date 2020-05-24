import Dep from './dep'

export default class Watcher { // 执行更新
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb
    Dep.target = this
    this.vm[this.key]
    Dep.target = null
  }
  update() {
    this.cb.call(this.vm, this.vm[this.key])
  }
}
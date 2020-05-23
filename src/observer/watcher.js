import Dep from './dep'

export default class Watcher { // 执行更新
  constructor() {
    Dep.target = this
  }
  update() {
    console.log('属性在watcher更新了')
  }
}
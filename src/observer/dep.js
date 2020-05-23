export default class Dep { // 依赖收集
  constructor() {
    this.deps = [] // 存放watcher 一个watcher对应一个属性
  }

  addDep(dep) {
    this.deps.push(dep)
  }

  notify() {
    this.deps.forEach(dep => {
      dep.update()
    })
  }
}
import {
  initMixin
} from './init'

class Vue {
  constructor(options) {
    this._init(options)
  }
}

initMixin(Vue)

export default Vue
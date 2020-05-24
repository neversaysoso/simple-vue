export function isObject(data) {
  return typeof data === 'object' && data !== null
}

export function def(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: false,
    value
  })
}

export function throttle(fn, wait = 100) {
  let lastTime = Date.now()
  return (...args) => {
    let now = Date.now()
    if (now - lastTime > wait) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}
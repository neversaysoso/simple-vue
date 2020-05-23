let oldarrayMethods = Array.prototype

export const arrayMethods = Object.create(oldarrayMethods)

const methods = [
  'push',
  'shift',
  'unshift',
  'pop',
  'sort',
  'splice',
  'reverse'
]

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    const result = oldarrayMethods[method].apply(this, args)
    let ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break;
      case 'splice':
        inserted = args.slice(2)
      default:
        break;
    }

    if (inserted) ob.observeArray(inserted)

    return result
  }
});
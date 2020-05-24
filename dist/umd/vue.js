(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }

  var oldarrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldarrayMethods);
  var methods = ['push', 'shift', 'unshift', 'pop', 'sort', 'splice', 'reverse'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldarrayMethods[method].apply(this, args);
      var ob = this.__ob__;
      var inserted;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
      }

      if (inserted) ob.observeArray(inserted);
      return result;
    };
  });

  var Dep = /*#__PURE__*/function () {
    // 依赖收集
    function Dep() {
      _classCallCheck(this, Dep);

      this.deps = []; // 存放watcher 一个watcher对应一个属性
    }

    _createClass(Dep, [{
      key: "addDep",
      value: function addDep(dep) {
        this.deps.push(dep);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.deps.forEach(function (dep) {
          dep.update();
        });
      }
    }]);

    return Dep;
  }();

  var Observer = /*#__PURE__*/function () {
    function Observer(value, vm) {
      _classCallCheck(this, Observer);

      this.value = value;
      this.vm = vm;
      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        value.__proto__ = arrayMethods;
        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        var _this = this;

        Object.keys(data).forEach(function (key) {
          _this.defineReactive(data, key, data[key]);

          _this.proxyData(key);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(value) {
        value.forEach(function (v) {
          observe(v);
        });
      }
    }, {
      key: "proxyData",
      value: function proxyData(key) {
        Object.defineProperty(this.vm, key, {
          get: function get() {
            return this._data[key];
          },
          set: function set(newVal) {
            this._data[key] = newVal;
          }
        });
      }
    }, {
      key: "defineReactive",
      value: function defineReactive(data, key, value) {
        observe(value, this.vm); // 递归实现深度检测

        var dep = new Dep();
        Object.defineProperty(data, key, {
          set: function set(newVal) {
            // 观察者
            if (newVal == value) return; // observe(value, this.vm) // 如果更新了一个对象 则继续检测

            value = newVal;
            dep.notify();
          },
          get: function get() {
            Dep.target && dep.addDep(Dep.target);
            return value;
          }
        });
      }
    }]);

    return Observer;
  }();

  function observe(data, vm) {
    var isObj = isObject(data);

    if (!isObj) {
      return;
    }

    return new Observer(data, vm);
  }

  function initState(vm) {
    var opts = vm.$options; // if (opts.props) {
    //   initProps(vm)
    // }
    // if (opts.methods) {
    //   initMethod(vm)
    // }

    if (opts.data) {
      initData(vm);
    } // if (opts.computed) {
    //   initComputed(vm)
    // }
    // if (opts.watch) {
    //   initWatch(vm)
    // }

  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data;
    observe(data, vm);
  }

  var Watcher = /*#__PURE__*/function () {
    // 执行更新
    function Watcher(vm, key, cb) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.key = key;
      this.cb = cb;
      Dep.target = this;
      this.vm[this.key];
      Dep.target = null;
    }

    _createClass(Watcher, [{
      key: "update",
      value: function update() {
        this.cb.call(this.vm, this.vm[this.key]);
      }
    }]);

    return Watcher;
  }();

  var Compile = /*#__PURE__*/function () {
    function Compile(el, vm) {
      _classCallCheck(this, Compile);

      this.$el = document.querySelector(el);
      this.$vm = vm;

      if (this.$el) {
        this.$fragment = this.node2Fragment(this.$el);
        this.compile(this.$fragment);
        this.$el.appendChild(this.$fragment);
      }
    }

    _createClass(Compile, [{
      key: "node2Fragment",
      value: function node2Fragment(el) {
        var frag = document.createDocumentFragment();
        var child;

        while (child = el.firstChild) {
          frag.appendChild(child);
        }

        return frag;
      }
    }, {
      key: "compile",
      value: function compile(el) {
        var _this = this;

        var childNodes = el.childNodes;
        Array.from(childNodes).forEach(function (node) {
          if (_this.isElement(node)) {
            // console.log('元素' + node.nodeName)
            var nodeAttr = node.attributes;
            Array.from(nodeAttr).forEach(function (attr) {
              var attrName = attr.name;
              var exp = attr.value;

              if (_this.isDirective(attrName)) {
                var dir = attrName.substring(2);
                _this[dir] && _this[dir](node, _this.$vm, exp);
              }

              if (_this.isEvent(attrName)) {
                var _dir = attrName.substring(1);

                _this.eventHandler(node, _this.$vm, exp, _dir);
              }
            });
          } else if (_this.isInterpolation(node)) {
            // console.log('文本' + node.textContent)
            _this.compileText(node);
          }

          if (node.childNodes && node.childNodes.length > 0) {
            _this.compile(node);
          }
        });
      } // 事件处理

    }, {
      key: "eventHandler",
      value: function eventHandler(node, vm, exp, dir) {
        var fn = vm.$options.methods && vm.$options.methods[exp];

        if (dir && fn) {
          node.addEventListener(dir, fn.bind(vm));
        }
      } // 双向绑定

    }, {
      key: "model",
      value: function model(node, vm, exp) {
        this.update(node, vm, exp, 'model');
        node.addEventListener('input', function (e) {
          vm[exp] = e.target.value;
        });
      }
    }, {
      key: "modelUpdater",
      value: function modelUpdater(node, value) {
        node.value = value;
      }
    }, {
      key: "text",
      value: function text(node, vm, exp) {
        this.update(node, vm, exp, 'text');
      }
    }, {
      key: "html",
      value: function html(node, vm, exp) {
        this.update(node, vm, exp, 'html');
      }
    }, {
      key: "isDirective",
      value: function isDirective(attr) {
        return attr.indexOf('v-') === 0;
      }
    }, {
      key: "isEvent",
      value: function isEvent(attr) {
        return attr.indexOf('@') === 0;
      }
    }, {
      key: "compileText",
      value: function compileText(node) {
        this.update(node, this.$vm, RegExp.$1, 'text');
      }
    }, {
      key: "update",
      value: function update(node, vm, exp, dir) {
        var updateFn = this[dir + 'Updater'];
        updateFn && updateFn(node, vm[exp]);
        new Watcher(vm, exp, function (val) {
          updateFn && updateFn(node, val);
        });
      }
    }, {
      key: "textUpdater",
      value: function textUpdater(node, value) {
        node.textContent = value;
      }
    }, {
      key: "htmlUpdater",
      value: function htmlUpdater(node, value) {
        node.innerHTML = value;
      }
    }, {
      key: "isElement",
      value: function isElement(node) {
        return node.nodeType === 1;
      }
    }, {
      key: "isInterpolation",
      value: function isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
      }
    }]);

    return Compile;
  }();

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      initState(vm);

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      // const vm = this
      // const options = vm.$options
      // el = document.querySelector(el)
      // if (!options.render) {
      //   let template = options.template
      //   if (!template && el) {
      //     template = el.outerHTML
      //   }
      //   const render = compileToFunction(template)
      //   options.render = render
      // }
      // options.render
      new Compile(el, this);

      if (this.$options.created) {
        this.$options.created.call(this);
      }
    };
  }

  var Vue = function Vue(options) {
    _classCallCheck(this, Vue);

    this._init(options);
  };

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map

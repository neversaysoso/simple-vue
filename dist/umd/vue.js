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

  var Watcher = /*#__PURE__*/function () {
    // 执行更新
    function Watcher() {
      _classCallCheck(this, Watcher);

      Dep.target = this;
    }

    _createClass(Watcher, [{
      key: "update",
      value: function update() {
        console.log('属性在watcher更新了');
      }
    }]);

    return Watcher;
  }();

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        value.__proto__ = arrayMethods;
        this.observeArray(value);
      } else {
        this.walk(value);
      }

      new Watcher();
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(value) {
        value.forEach(function (v) {
          observe(v);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observe(value); // 递归实现深度检测

    var dep = new Dep();
    Object.defineProperty(data, key, {
      set: function set(newVal) {
        // 观察者
        if (newVal == value) return;
        observe(value); // 如果更新了一个对象 则继续检测

        value = newVal;
        dep.notify();
      },
      get: function get() {
        Dep.target && dep.addDep(Dep.target);
        return value;
      }
    });
  }
  function observe(data) {
    var isObj = isObject(data);

    if (!isObj) {
      return;
    }

    return new Observer(data);
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
    observe(data);
    new Watcher();
    vm._data.name;
  }

  // 生成ast语法树

  function compileToFunction(template) {
    return function render() {};
  }

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
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        var render = compileToFunction();
        options.render = render;
      } // options.render

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

(function() {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  var classCallCheck = _classCallCheck;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var createClass = _createClass;

  function createCommonjsModule(fn, module) {
    return (module = { exports: {} }), fn(module, module.exports), module.exports;
  }

  var _typeof_1 = createCommonjsModule(function(module) {
    function _typeof2(obj) {
      if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
        _typeof2 = function _typeof2(obj) {
          return typeof obj;
        };
      } else {
        _typeof2 = function _typeof2(obj) {
          return obj &&
            typeof Symbol === 'function' &&
            obj.constructor === Symbol &&
            obj !== Symbol.prototype
            ? 'symbol'
            : typeof obj;
        };
      }
      return _typeof2(obj);
    }

    function _typeof(obj) {
      if (typeof Symbol === 'function' && _typeof2(Symbol.iterator) === 'symbol') {
        module.exports = _typeof = function _typeof(obj) {
          return _typeof2(obj);
        };
      } else {
        module.exports = _typeof = function _typeof(obj) {
          return obj &&
            typeof Symbol === 'function' &&
            obj.constructor === Symbol &&
            obj !== Symbol.prototype
            ? 'symbol'
            : _typeof2(obj);
        };
      }

      return _typeof(obj);
    }

    module.exports = _typeof;
  });

  var uid = 0;
  var Dep =
    /*#__PURE__*/
    (function() {
      function Dep() {
        classCallCheck(this, Dep);

        this.id = uid++;
        this.subs = []; // 存储所有的订阅者
      }

      createClass(Dep, [
        {
          key: 'addSub',
          value: function addSub(sub) {
            this.subs.push(sub);
          },
        },
        {
          key: 'depend',
          value: function depend() {
            if (Dep.target) {
              Dep.target.addDep(this); // 一个数据对象对应一个dep实例， 此处为收集依赖
            }
          }, // 派发更新
        },
        {
          key: 'notify',
          value: function notify() {
            var subs = this.subs.slice();

            for (var i = 0, l = subs.length; i < l; i++) {
              subs[i].update();
            }
          },
        },
      ]);

      return Dep;
    })();
  Dep.target = null;
  var targetStack = [];
  /**
   *
   * <Parent>
   *   {this.props.data}
   *   <child/>
   *  </Parent>
   *
   *  父组件解析时，碰到子组件会优先去解析子组件，此时使用 pushTarget 把父组件的引用入栈
   *  子组件解析完成后， 通过 popTarget 把父组件出栈， 继续解析父组件
   */

  function pushTarget(_target) {
    if (Dep.target) targetStack.push(Dep.target);
    Dep.target = _target;
  }
  function popTarget() {
    Dep.target = targetStack.pop();
  }

  function reactive(obj, key) {
    var dep = new Dep();
    dep.key = key; // if (key === '__ob') return;

    var val = obj[key];
    observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function get() {
        console.log('触发getter: ', key, val);
        var value = val;

        if (Dep.target) {
          // console.log('Dep.target: ', Dep.target);
          dep.depend();
        }

        return value;
      },
      set: function set(newVal) {
        console.log('触发setter: ', key, newVal);
        var value = val;

        if (newVal === value || (newVal !== newVal && value !== value)) {
          return;
        }

        val = newVal;
        observe(newVal); // 对新设置的属性添加响应式

        dep.notify();
      },
    });
  }

  function observe(value) {
    if (!isObject(value)) return;
    return new Observer(value);
  }
  var Observer =
    /*#__PURE__*/
    (function() {
      function Observer(value) {
        classCallCheck(this, Observer);

        this.value = value;
        this.dep = new Dep();
        value.__ob = true; // 标记此对象已经被监听

        this.init();
      }

      createClass(Observer, [
        {
          key: 'init',
          value: function init() {
            var value = this.value;

            if (Array.isArray(value)) {
              for (var i = 0, l = value.length; i < l; i++) {
                observe(value[i]);
              }
            } else {
              var keys = Object.keys(value);

              for (var _i = 0; _i < keys.length; _i++) {
                reactive(value, keys[_i]);
              }
            }
          },
        },
      ]);

      return Observer;
    })();

  function isObject(value) {
    return value !== null && _typeof_1(value) === 'object';
  }

  var uid$1 = 0;

  var Watcher =
    /*#__PURE__*/
    (function() {
      /**
       *
       * @param vm - 组件实例
       * @param updateComponent - update函数
       * @param cb - 回调函数(vm.$watch需要提供)
       * @param options - 选项配置
       * @param isRenderWatcher - 是否是渲染 watcher
       */
      function Watcher(vm, updateComponent, cb, options, isRenderWatcher) {
        classCallCheck(this, Watcher);

        this.vm = vm;

        if (isRenderWatcher) {
          vm._watcher = this;
        }

        vm._watchers.push(this);

        this.cb = cb; // vm.watch的回调

        this.id = ++uid$1;
        this.deps = [];
        this.depIds = new Set();
        this.updateComponent =
          typeof updateComponent === 'function' ? updateComponent : function() {};
        this.value = this.init();
      }

      createClass(Watcher, [
        {
          key: 'init',
          value: function init() {
            pushTarget(this); // 给 Dep.target 赋值为 this

            /**
             * 1. vue中的update函数 vm._update(vm._render())
             * 2. _render() 调用 snabbdom 的 h函数 ,  返回 vnode
             * 3. _update 去调用 snabbdom 的 patch函数
             */

            var value = this.updateComponent();
            popTarget();
            return value;
          },
        },
        {
          key: 'addDep',
          value: function addDep(dep) {
            var id = dep.id; // 判断这个组件是否已经依赖于此数据

            if (!this.depIds.has(id)) {
              this.depIds.add(id);
              this.deps.push(dep);
              dep.addSub(this); // 组件(Watcher)添加到数据(Dep)的订阅者中去
            }
          },
        },
        {
          key: 'update',
          value: function update() {
            this.updateComponent();
          },
        },
      ]);

      return Watcher;
    })();

  var App =
    /*#__PURE__*/
    (function() {
      function App(props) {
        classCallCheck(this, App);

        this.firstRender = true;
        this.props = props;
        observe(this.props);
        this.msg = this.props.info; // 存储渲染 watcher

        this._watcher = null; // 存储所有 watcher

        this._watchers = []; //

        /**
         * 1. 对应这个组件实例生成一个watcher实例
         * 2. 把组件的update函数传进去
         * 3. options中可以传入更新时的生命周期
         * 4. 第四个参数标志这是不是一个渲染 Watcher， 因为vm.watch和vm.computed 同样会实例 Watcher
         */

        new Watcher(this, this.update.bind(this), null, {}, true);
      }

      createClass(App, [
        {
          key: 'handleClick',
          value: function handleClick() {
            this.props.message = 'alfredolee';
          },
        },
        {
          key: 'render',
          value: function render() {
            // 首次调用render会触发所依赖数据的getter
            var p = document.createElement('p');
            p.innerHTML = ''
              .concat(this.firstRender ? '触发App的首次渲染' : '触发App的更新', ' : ')
              .concat(this.props.message, ' --- ')
              .concat(JSON.stringify(this.props.info), ' --- ')
              .concat(JSON.stringify(this.props.arr));
            return p;
          },
        },
        {
          key: 'update',
          value: function update() {
            var _this = this;

            var node = this.render();

            if (this.firstRender) {
              console.log('触发App的首次渲染');
              var fragment = document.createDocumentFragment();
              var input = document.createElement('input');
              var button = document.createElement('button');
              button.textContent = '确认修改';
              button.addEventListener('click', function() {
                if (input.value) {
                  _this.props.message = input.value;
                }
              });
              fragment.append('输入 message 的值： ', input, button, node);
              document.body.appendChild(fragment);
              this.firstRender = false;
            } else {
              console.log('触发App的更新');
              document.body.appendChild(node);
            }
          },
        },
      ]);

      return App;
    })();

  var a = new App({
    message: 'lijian',
    info: {
      name: 'lijian',
      age: 25,
    },
    arr: [
      {
        a: 1,
      },
      2,
      3,
    ],
  });
  window.app = a;
  console.log(a);
})();
//# sourceMappingURL=index.js.map

import { pushTarget, popTarget } from './dep';

let uid = 0;

export default class Watcher {
  /**
   *
   * @param vm - 组件实例
   * @param updateComponent - update函数
   * @param cb - 回调函数(vm.$watch需要提供)
   * @param options - 选项配置
   * @param isRenderWatcher - 是否是渲染 watcher
   */
  constructor(vm, updateComponent, cb, options, isRenderWatcher) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    vm._watchers.push(this);

    this.cb = cb; // vm.watch的回调
    this.id = ++uid;
    this.deps = [];
    this.depIds = new Set();
    this.updateComponent = typeof updateComponent === 'function' ? updateComponent : function() {};

    this.value = this.init();
  }

  init() {
    pushTarget(this); // 给 Dep.target 赋值为 this
    /**
     * 1. vue中的update函数 vm._update(vm._render())
     * 2. _render() 调用 snabbdom 的 h函数 ,  返回 vnode
     * 3. _update 去调用 snabbdom 的 patch函数
     */
    let value = this.updateComponent();
    popTarget();
    return value;
  }

  addDep(dep) {
    const id = dep.id;
    // 判断这个组件是否已经依赖于此数据
    if (!this.depIds.has(id)) {
      this.depIds.add(id);
      this.deps.push(dep);
      dep.addSub(this); // 组件(Watcher)添加到数据(Dep)的订阅者中去
    }
  }

  update() {
    this.updateComponent();
  }
}

let uid = 0;

export class Dep {
  constructor() {
    this.id = uid++;
    this.subs = []; // 存储所有的订阅者
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this); // 一个数据对象对应一个dep实例， 此处为收集依赖
    }
  }

  // 派发更新
  notify() {
    const subs = this.subs.slice();
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}

Dep.target = null;
const targetStack = [];

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

export function pushTarget(_target) {
  if (Dep.target) targetStack.push(Dep.target);
  Dep.target = _target;
}

export function popTarget() {
  Dep.target = targetStack.pop();
}

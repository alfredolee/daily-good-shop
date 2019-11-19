import { reactive } from './reactive';
import { Dep } from './dep';

export function observe(value) {
  if (!isObject(value)) return;
  return new Observer(value);
}

export class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep();
    value.__ob = true; // 标记此对象已经被监听
    this.init();
  }

  init() {
    const value = this.value;
    if (Array.isArray(value)) {
      for (let i = 0, l = value.length; i < l; i++) {
        observe(value[i]);
      }
    } else {
      const keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++) {
        reactive(value, keys[i]);
      }
    }
  }
}

function isObject(value) {
  return value !== null && typeof value === 'object';
}

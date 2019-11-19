import { observe } from './observer';
import { Dep } from './dep';

export function reactive(obj, key) {
  const dep = new Dep();
  dep.key = key;
  // if (key === '__ob') return;

  let val = obj[key];
  observe(val);

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      console.log('触发getter: ', key, val);
      const value = val;
      if (Dep.target) {
        // console.log('Dep.target: ', Dep.target);
        dep.depend();
      }
      return value;
    },
    set: function(newVal) {
      console.log('触发setter: ', key, newVal);
      const value = val;
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }

      val = newVal;
      observe(newVal); // 对新设置的属性添加响应式
      dep.notify();
    },
  });
}

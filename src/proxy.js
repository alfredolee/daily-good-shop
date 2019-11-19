const vm = {};
let data = {
  name: 'lijian',
  age: 25,
  info: {
    hair: 'black',
    data: {
      a: 1,
    },
  },
  arr: [
    {
      a: 1,
    },
    {
      b: 1,
    },
  ],
};

function deepProxy(obj) {
  if (!isObject(obj)) return obj;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (Array.isArray(obj[key])) {
        // obj[key] = deepProxy(obj[key])
        obj[key] = obj[key].map(child => deepProxy(child));
      } else {
        obj[key] = deepProxy(obj[key]);
      }
    }
  }
  const depMap = {};
  return new Proxy(obj, {
    get(target, p) {
      console.log('get', p);
      depMap[p] = `${p} - dep`;
      console.log('收集依赖之后', depMap);
      return target[p];
    },
    set(target, p, value) {
      console.log('set', p);
      console.log(depMap[p]);
      target[p] = value;
      return true;
    },
  });
}

function proxy(obj) {
  let handler = {
    get(target, key) {
      if (target[key] === 'object' && target[key] !== null) {
        return new Proxy(target[key], hanlder);
      }
      // collectDeps(); // 收集依赖
      return Reflect.get(target, key);
    },
    set(target, key, value) {
      if (key === 'length') return true;
      // notifyRender(); // 通知订阅者更新
      return Reflect.set(target, key, value);
    },
  };

  obj = new Proxy(obj, handler);
  return obj;
}

data = deepProxy(data);

function isObject(value) {
  return value !== null && typeof value === 'object';
}

/**
 * 判断一个对象是不是纯对象 - 即没有再嵌套对象
 * @param object - 目标对象
 * @returns {boolean}
 */
function isPureObject(object) {
  if (typeof object !== 'object') {
    return false;
  } else {
    for (let prop in object) {
      if (typeof object[prop] == 'object') {
        return false;
      }
    }
  }
  return true;
}

console.log(data.name);
console.log(data.info.data);
console.log(data.arr[0]);

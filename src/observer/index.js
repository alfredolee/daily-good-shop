import { observe } from './observer';
import Watcher from './watcher';

class App {
  constructor(props) {
    this.firstRender = true;
    this.props = props;

    observe(this.props);
    this.msg = this.props.info;
    // 存储渲染 watcher
    this._watcher = null;
    // 存储所有 watcher
    this._watchers = []; //
    /**
     * 1. 对应这个组件实例生成一个watcher实例
     * 2. 把组件的update函数传进去
     * 3. options中可以传入更新时的生命周期
     * 4. 第四个参数标志这是不是一个渲染 Watcher， 因为vm.watch和vm.computed 同样会实例 Watcher
     */
    new Watcher(this, this.update.bind(this), null, {}, true);
  }

  handleClick() {
    this.props.message = 'alfredolee';
  }

  render() {
    // 首次调用render会触发所依赖数据的getter
    const p = document.createElement('p');
    p.innerHTML = `${this.firstRender ? '触发App的首次渲染' : '触发App的更新'} : ${
      this.props.message
    } --- ${JSON.stringify(this.props.info)} --- ${JSON.stringify(this.props.arr)}`;
    return p;
  }

  update() {
    const node = this.render();
    if (this.firstRender) {
      console.log('触发App的首次渲染');
      const fragment = document.createDocumentFragment();
      const input = document.createElement('input');
      const button = document.createElement('button');
      button.textContent = '确认修改';
      button.addEventListener('click', () => {
        if (input.value) {
          this.props.message = input.value;
        }
      });
      fragment.append('输入 message 的值： ', input, button, node);
      document.body.appendChild(fragment);
      this.firstRender = false;
    } else {
      console.log('触发App的更新');
      document.body.appendChild(node);
    }
  }
}

const a = new App({
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

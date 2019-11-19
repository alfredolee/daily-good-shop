import { h, init } from 'snabbdom';
import sclass from 'snabbdom/modules/class';
import props from 'snabbdom/modules/props';
import style from 'snabbdom/modules/style';
import eventlisteners from 'snabbdom/modules/eventlisteners';

const patch = init([sclass, props, style, eventlisteners]);

var container = document.body;

class App {}

var vnode = h('div#containe', { on: { click: () => console.log(111) } }, [
  h('p', { style: { fontWeight: 'bold' } }, 'This is bold'),
  ' and this is just normal text',
]);

patch(container, vnode);

var newVnode = h('div#container.two.classes', { on: { click: () => console.log(222) } }, [
  h('p', { style: { fontWeight: 'normal', fontStyle: 'italic' } }, 'This is now italic type'),
  ' and this is still just normal text',
]);

patch(vnode, newVnode);

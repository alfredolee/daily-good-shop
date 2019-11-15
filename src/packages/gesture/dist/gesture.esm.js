import"core-js/modules/es6.date.now";import"core-js/modules/web.dom.iterable";import"core-js/modules/es7.symbol.async-iterator";import"core-js/modules/es6.symbol";import"core-js/modules/es6.object.create";function e(e,t){for(var n=0;n<t.length;n++){var s=t[n];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}var t=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{panDistance:10,flickSpeed:.3,pressDuration:500,log:!1};!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),this.options=e,this.events={},this.log=e.log,this.init()}var n,s,r;return n=t,(s=[{key:"init",value:function(){var e=this,t=Object.create(null),n=Symbol("mouse");this.events.mousemove=function(s){s.preventDefault(),e.move(s,t[n])},this.events.mouseend=function(s){document.removeEventListener("mousemove",e.events.mousemove),document.removeEventListener("mouseup",e.events.mouseend),e.end(s,t[n]),delete t[n]},this.events.mousestart=function(s){s.preventDefault(),document.addEventListener("mousemove",e.events.mousemove),document.addEventListener("mouseup",e.events.mouseend),t[n]=Object.create(null),e.start(s,t[n])},this.events.touchstart=function(n){if(n.changedTouches.length>1)return!1;var s=!0,r=!1,i=void 0;try{for(var o,a=n.changedTouches[Symbol.iterator]();!(s=(o=a.next()).done);s=!0){var l=o.value;l.currentTarget=n.currentTarget,t[n.identifier]=Object.create(null),e.start(l,t[n.identifier])}}catch(e){r=!0,i=e}finally{try{s||null==a.return||a.return()}finally{if(r)throw i}}},this.events.touchmove=function(n){if(n.changedTouches.length>1)return!1;var s=!0,r=!1,i=void 0;try{for(var o,a=n.changedTouches[Symbol.iterator]();!(s=(o=a.next()).done);s=!0){var l=o.value;e.move(l,t[n.identifier])}}catch(e){r=!0,i=e}finally{try{s||null==a.return||a.return()}finally{if(r)throw i}}},this.events.touchend=function(n){if(n.changedTouches.length>1)return!1;var s=!0,r=!1,i=void 0;try{for(var o,a=n.changedTouches[Symbol.iterator]();!(s=(o=a.next()).done);s=!0){var l=o.value;e.end(l,t[n.identifier]),delete t[n.identifier]}}catch(e){r=!0,i=e}finally{try{s||null==a.return||a.return()}finally{if(r)throw i}}},this.events.touchcancel=function(n){if(n.changedTouches.length>1)return!1;var s=!0,r=!1,i=void 0;try{for(var o,a=n.changedTouches[Symbol.iterator]();!(s=(o=a.next()).done);s=!0){var l=o.value;e.cancel(l,t[n.identifier])}}catch(e){r=!0,i=e}finally{try{s||null==a.return||a.return()}finally{if(r)throw i}}}}},{key:"enable",value:function(e){var t=this;if(null==e)throw new Error("el is required");var n=!1;try{document.createEvent("TouchEvent"),n=!0}catch(e){n=!1}return n?(e.addEventListener("touchstart",this.events.touchstart,{passive:!1}),e.addEventListener("touchmove",this.events.touchmove,{passive:!1}),e.addEventListener("touchend",this.events.touchend),e.addEventListener("touchcancel",this.events.touchcancel)):e.addEventListener("mousedown",this.events.mousestart),function(){e.removeEventListener("mousedown",t.events.mousestart),e.removeEventListener("touchstart",t.events.touchstart),e.removeEventListener("touchmove",t.events.touchmove),e.removeEventListener("touchend",t.events.touchend),e.removeEventListener("touchcancel",t.events.touchcancel)}}},{key:"start",value:function(e,t){var n=this;t.el=e.currentTarget||e.target,t.startX=e.clientX,t.startY=e.clientY,t.isTap=!0,t.isPan=!1,t.isPress=!1,t.startTime=Date.now(),t.pressHandler=setTimeout((function(){t.isPress=!0,t.isTap=!1;var e=new Event("press");n.log&&console.log("press"),t.el.dispatchEvent(e),t.pressHandler=null}),this.options.pressDuration)}},{key:"move",value:function(e,t){var n=e.clientX-t.startX,s=e.clientY-t.startY;if(n*n+s*s>this.options.panDistance*this.options.panDistance){if(null!==t.pressHandler)clearTimeout(t.pressHandler),t.pressHandler=null,t.isPress=!1;else if(t.isPress){t.isPress=!1;var r=new Event("presscancel");this.log&&console.log("presscancel"),t.el.dispatchEvent(r)}if(t.isTap=!1,!1===t.isPan){t.isPan=!0,Math.abs(n)>Math.abs(s)?(t.isVertical=!1,t.isHorizontal=!0):(t.isVertical=!0,t.isHorizontal=!1);var i=new Event("panstart");this.log&&console.log("panstart"),i.startX=t.startX,i.startY=t.startY,t.el.dispatchEvent(i)}}if(t.isPan){var o=new Event("pan");o.dx=n>0?n-this.options.panDistance:n+this.options.panDistance,o.dy=s,o.isHorizontal=t.isHorizontal,o.isVertical=t.isVertical,this.log&&console.log("pan"),t.el.dispatchEvent(o)}}},{key:"end",value:function(e,t){if(null!==t.pressHandler&&clearTimeout(t.pressHandler),t.isPress){var n=new Event("pressend");this.log&&console.log("pressend"),t.el.dispatchEvent(n)}if(t.isTap){var s=new Event("tap");this.log&&console.log("tap"),t.el.dispatchEvent(s)}var r=e.clientX-t.startX,i=e.clientY-t.startY,o=Math.sqrt(r*r,i*i)/(Date.now()-t.startTime);if(t.isPan&&o>this.options.flickSpeed){t.isFlick=!0;var a=new Event("flick");this.log&&console.log("flick"),a.dx=r,a.dy=i,t.el.dispatchEvent(a)}else t.isFlick=!1;if(t.isPan){var l=new Event("panend");this.log&&console.log("panend"),l.dx=r,l.dy=i,l.isHorizontal=t.isHorizontal,l.isVertical=t.isVertical,l.isFlick=t.isFlick,t.el.dispatchEvent(l)}}},{key:"cancel",value:function(e,t){if(t.isPan){var n=new Event("pancancel");t.el.dispatchEvent(n)}if(t.isPress){var s=new Event("presscancel");t.el.dispatchEvent(s)}if(null!==t.pressHandler){var r=new Event("pancancel");t.el.dispatchEvent(r),clearTimeout(t.pressHandler)}}}])&&e(n.prototype,s),r&&e(n,r),t}();export default t;
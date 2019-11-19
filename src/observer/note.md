实例化实例 -> new Watch -> watch.get -> Dep.target = watch 同时调用render触发getter -> 检查Dep.target -> Dep.target.addDep(dep) -> watch.newDeps.push(dep) 同时dep.addSub(watch)

## TODO
1. 数组没办法监听
1. 数据更新的时候把所有的dep实例也要更新，因为可能有些数据用不到了；
2. 每一个组件实例都要拥有一个id，父组件永远比子组件大，这样在触发更新时候可以根据id的顺序重新render；

# Vue3基础

### 构建Vue3：

#### 使用vite构建

vite是一个现代化前端构建工具，也是官方推荐的Vue3项目的构建工具；在生产环境使用Rollup打包，开发环境使用Esbuild打包；

在终端中执行：`npm i -g vite`全局安装vite，再执行`npm create vite@latest`选择Vue，创建以vite为构建工具的前端框架；

#### 使用Vue CLI构建

使用的构建与打包工具是 Webpack，同时集成了完整的前端工程化工具链，包括Babel，Postcss，Webpack-Loader等；

在终端中执行：`npm create vue@latest`可以直接创建Vue3工程；（确保VSCode禁用 Vetur插件，Vue3使用vue-official插件）；

### 样式配置

#### CSS预编译器

Vite和 Vue CLI 5+已内置了 CSS 预编译器的编译能力，只需安装对应预编译器依赖，即可直接使用；需要在`style`标签中指定对应的lang；

使用scss需要安装：`npm install -D sass`

使用less需要安装：`npm install -D less`

使用stylus需要安装：`npm install -D stylus`

#### CSS相关

在 `script` 标签中直接 `import CSS` 时，无论在哪个模块中导入，CSS 的样式规则都会作为全局样式生效，不存在作用域隔离；构建工具（ Vite / Webpack）会在构建过程中收集所有被导入的全局样式并进行合并处理，最终通常打包为一个全局 CSS 文件（如果存在动态导入或代码分割，则可能生成多个按需加载的全局 CSS 文件）；

- 开发环境：`import './style.css'` 时，Vite/Webpack 会将 CSS 内容转换为字符串并封装为 JS 模块，运行时由 JS 创建 `<style>` 标签并插入到 `document.head` 中，从而使样式生效，同时这种方式也便于实现 HMR；
- 生产环境：`import './style.css'` 时，构建工具会在构建阶段收集所有 CSS 资源并进行合并与优化，生成独立的 `style.css` 文件，并在 HTML 中通过 `<link>` 标签引入该 CSS 文件；
- 通常在入口文件main.js文件中设置全局css样式（包括body，html的样式）；

在组件中可以通过 `<style src="...">` 标签引入外部 CSS 文件，Vite / Webpack在编译时会读取该文件，并将其作为组件样式的一部分进行处理（如果没有scope还是全局生效）

- 如果同时使用 `scoped`，无论是外部CSS，还是当前 `<style>` 中编写的样式，都会在编译阶段被添加作用域属性选择器（如 `data-v-xxxx`），从而只作用于当前组件的 DOM
- 如果多个组件都通过 `<style src="./assets/css/loading.css" scoped></style>` 引入同一个 CSS 文件，由于 `scoped` 的作用域是按组件生成唯一标识实现的，构建时每个组件都会生成不同的作用域属性，因此同一个 CSS 文件会被编译多次并生成多份带不同作用域的样式规则，使各组件样式互不影响，但也会造成一定的样式重复；

```css
<style src="./assets/css/loading.css" scoped></style>//引入的外部文件
<style scoped>
    //自己的css文件
</style>
```

对于@import的CSS，构建工具会读取对应的CSS，并且合并到当前style

#### scoped原理：

当组件的 `<style>` 标签添加 `scoped` 属性时（如果不使用则会被当做全局样式处理），Vue 在编译阶段会为该组件生成一个 唯一的作用域标识（如 `data-v-hash`）随后 Vue 会做两件事：

1. 给组件模板中的所有 DOM 元素添加该属性（如 `data-v-hash`）。
2. 将 `<style>` 中的每个 CSS 选择器转换为带有该属性的属性选择器（如 `.title` → `.title[data-v-hash]`）。

这样样式规则只会匹配带有该属性的元素，从而实现 组件级的样式隔离；

当组件内部包含子组件时：

- 子组件根元素会同时携带父组件的作用域属性 和 子组件自己的作用域属性。
- 子组件内部元素只携带 子组件自己的作用域属性。

因此：

- 父组件样式可以作用到 子组件的根元素
- 但不会影响 子组件内部的其他元素

```css
.example {
  color: red;
}

//编译后
.example[data-v-hash] {
  color: red;
}
```

**:deep()**

是Vue中允许样式穿透的伪类选择器，允许父组件的样式影响子组件的样式；

其实现原理是在编译阶段对选择器进行转换：Vue 在处理包含 `:deep()` 的选择器时，会只给 `:deep()` 前面的部分添加作用域属性，而不会给 `:deep()` 内部的选择器添加作用域限制

```vue
<script setup>
import Home from './components/Home.vue';
</script>
<template>
  <div class="app">
    <Home />
  </div>
</template>

<style scoped>
//第一种写法
.app :deep(.home) {
  color: blue;
}
//第二种写法
:deep(.home) {
  color: blue;
}
</style>

//编译后，这样就能影响到Home的.home了 .app[data-v-7a7a37b1] .home { color: blue;
} [data-v-7a7a37b1] .home { color: blue; }
```

#### 动态绑定类名：

当使用 对象语法 时，对象的键表示类名，值表示一个布尔表达式：当值为 `true` 时会添加该类名，当值为 `false` 时则不会添加该类名

可以和静态类名一起使用：Vue 会自动 合并静态类名和动态类名

```html
<div class="box" :class="{ active: isActive }"></div>
```

#### CSS中的v-bind()

`<style>`标签支持使用 `v-bind` CSS 函数将 CSS 的值链接到动态的响应式数据；Vue会对`v-bind()` 进行特殊处理：

- 将绑定的变量转换为 CSS 变量
- 在组件根元素上动态设置对应的 CSS 变量值
- 在样式中通过 `var(--xxx)` 的方式引用该变量

```vue
<script setup>
const color = 'red';
</script>

<template>
  <div class="text">Hello</div>
</template>

<style scoped>
.text {
  color: v-bind(color);
}
</style>

//编译后
<div class="text" style="--color: red;"></div>

.text[data-v-xxxx] { color: var(--color); }
```

#### CSS Modules

Vue 支持 CSS Modules 实现局部样式：自动生成唯一类名

```css
<style module>
.title {
  color: red;
}
</style>

//使用：
<div :class="$style.title"></div>
```

### 组合式API：

选项式API：通过data，methods，computed，生命周期钩子等不同的选项来编写代码，依赖this访问组件实例；业务逻辑和数据分布在不同选项中，是Vue2的核心写法，Vue3完全兼容；

组合式API：基于setup函数将一个业务的所有代码（状态、方法、监听、生命周期）集中编写，不需要this访问组件实例；业务逻辑和数据集能中在一起；

| 对比         | 选项式 API                             | 组合式 API                |
| ------------ | -------------------------------------- | ------------------------- |
| 逻辑组织方式 | 按 **功能类型** 分类                   | 按 **业务逻辑** 分类      |
| 代码结构     | data / methods / computed / watch 分开 | 逻辑写在 `setup()` 中     |
| 代码复用     | mixins                                 | composables（封装成函数） |
| TS支持       | 一般                                   | 更好                      |
| Vue版本      | Vue2 主流                              | Vue3 主流                 |

**setup函数：**

setup是组合式API的入口函数，可以和data等选项式API共存，返回值可以作为data或methods等选项数据；

setup是组件生命周期中最早执行的函数： `beforeCreate` 钩子之前执行（组件实例尚未创建），因此 `setup` 内部的 `this` 指向 `undefined`，并且每次实例化组件时都会执行一次；

```vue
<template>
  <h1>姓名：{{ name }}</h1>
  <button @click="printname">输出</button>
</template>

<script>
export default {
    setup() {
        let name = 'aaa';//此时的name不是响应式的，
        function printname() {
            name='bbb'//这里修改name页面不会变化，但是实际上name确实变化了
            console.log(name);
        };
        return {name,age,printname};
    },
    data(){
        dataName:this.name,//data的this可以读取setup的属性，但是setup不能读取data中属性
    },
}
</script>
```

### 生命周期：

组件在特定的时期会调用特定的函数，这些函数统称为生命周期钩子；对于各个嵌套组件的执行生命周期的顺序是先子后父；

**setup**：在beforeCreate之前（代替了Vue2的beforeCreate/created），组件实例尚未初始化，没有this，但是收到了props参数和context；

**onBeforeMount**：组件挂载之前，模板编译完成（已经生成了虚拟DOM），即将挂载到真实DOM节点之前（不能操作DOM）；可以在此修改响应式数据，但不触发更新；

**onMounted**：组件已渲染到真实DOM并插入到了页面之后；可以在此发起首屏异步请求，操作DOM；

- 首屏请求通常放在 `onMounted`，因为请求属于副作用；`setup` 更适合做初始化，`onBeforeMount` 又太早，可能影响首屏渲染体验（没有页面结构）；

**onBeforeUpdate**：响应式数据已经变化了，虚拟 DOM 重新渲染之前；

**onUpdated**：虚拟DOM 重新渲染并更新到真实 DOM 之后；避免在此钩子中修改数据状态，否则会无限循环；

**onBeforeUnmount**：组件即将被卸载（如路由跳转、v-if 隐藏）之前；可以在此清理副作用，如清除定时器 ，移除全局事件监听；

**onUnmounted**：组件已完全卸载（DOM 移除，实例销毁）之后；

```js
<script setup lang="ts">
import { onBeforeMount,onMounted,onBeforeUpdate,onUpdated,onUnmounted } from 'vue';

//挂载前：
onBeforeMount(() => {
    console.log('挂载前');
});
//挂载完毕：
onMounted(() => {
    console.log('挂载完毕');
});
</script>
```

### 响应式

#### 基本原理

响应式：当带有响应式的数据变化时，自动触发依赖该数据的函数；比如watch，computed，watchEffect，render渲染里所依赖的数据变化时，就去执行对应的回调；

**Vue2的Object.defineProperty属性级响应式：**

在 Vue.js 2 中，响应式系统是基于 `Object.defineProperty` 的属性级劫持实现的。Vue 在初始化 `data` 时，会通过 `Observer` 遍历对象的所有属性，并使用 `defineReactive` 对每个属性调用 `Object.defineProperty`，为其定义 `getter` 和 `setter`。当组件渲染或计算属性执行时，如果访问了某个响应式属性，就会触发 `getter`，此时通过 `Dep` 进行依赖收集，将当前的 `Watcher` 记录下来；当属性值发生变化时会触发 `setter`，调用 `dep.notify()` 通知所有依赖的 Watcher 执行更新，从而重新渲染组件或执行相应的回调

- Observer：数据监听器，接收一个对象或数组为参数，遍历对象的所有属性（初始时遍历data对象），并且调用 defineReactive 将属性转换成响应式（如果属性值还是对象，则递归 observer，如果是数组，则改写数组的原型方法（Vue 不会像对象一样为每个索引使用 `Object.defineProperty`，而是重写数组变更方法，监听push，pop，shift，unshift，splice，sort，reverse的执行来实现响应式））

- defineReactive（非JS原生）：用于为对象的每一个属性通过 Object.defineProperty定义getter 和 setter、并创建 Dep（依赖管理器）、并且在 getter / setter 中调用 Dep 方法，触发依赖收集和派发更新

- Dep：一个属性对应一个 Dep，负责存储所有依赖该属性的watcher，并且执行依赖收集（发生在组件渲染，计算属性执行，watch 监听时）和派发更新（通知Watcher执行更新逻辑）

- Watcher：用于订阅响应式数据（包括渲染 watcher，computed watcher，watch监听），当数据变化时接收通知，并且执行对应的更新逻辑；

  ```vue
  <template>
    <div>{{ count }}</div>
  </template>
  //这里就会创建一个 渲染 Watcher
  ```

**缺点：**

- 无法监听对象属性的新增和删除，只能劫持已经存在的属性；
- 无法直接监听数组索引和长度变化；
- 需要递归遍历对象，初始化性能开销大，深层嵌套对象监听成本高
- 不能直接监听 Map / Set 等新数据结构

```jsx
       data
         │
         ▼
     Observer
         │
         ▼
  defineReactive
 (Object.defineProperty)
      │        │
      │        │
      ▼        ▼
   getter     setter
      │          │
      │          ▼
      │      Dep.notify()
      │          │
      ▼          ▼
  Dep.depend()  Watcher.update()
      │              │
      ▼              ▼
  收集Watcher       重新渲染组件
```

**Vue3的proxy和Reflect的对象级响应式：**

**proxy：**可以为对象（target）设置代理层，在对象被读取、修改、删除、调用等调用对象的内部方法（JS引擎实现的所有对象操作的真正执行入口）时进行拦截并自定义行为；

handler：拦截器对象，定义各种trap（捕获器）

| Trap           | 拦截操作        |
| -------------- | --------------- |
| get            | 读取属性        |
| set            | 设置属性        |
| deleteProperty | 删除属性        |
| has            | `in` 操作       |
| ownKeys        | `Object.keys()` |
| apply          | 函数调用        |
| construct      | `new` 操作      |
| getPrototypeOf | 获取原型        |
| setPrototypeOf | 设置原型        |

```js
const proxy = new Proxy(target, handler);

const obj = { a: 1 };
const proxy = new Proxy(obj, {
  get(target, key) {
    console.log('读取属性:', key);
    return target[key];
  },
});
console.log(proxy.a);
```

**Reflect**：JS引擎内置的静态方法，用于操作对象的内部方法，并且与对象内部方法（Proxy Trap）一一对应，如 `[[Get]]` → `Reflect.get()`，常用于 Proxy 中调用默认行为；

| 内部方法              | 对应 Reflect 方法                               | 说明                          |
| --------------------- | ----------------------------------------------- | ----------------------------- |
| [[Get]]               | Reflect.get(target, key[, receiver])            | 获取属性值                    |
| [[Set]]               | Reflect.set(target, key, value[, receiver])     | 设置属性值                    |
| [[HasProperty]]       | Reflect.has(target, key)                        | `key in obj`                  |
| [[Delete]]            | Reflect.deleteProperty(target, key)             | 删除属性                      |
| [[OwnPropertyKeys]]   | Reflect.ownKeys(target)                         | 获取对象所有属性（含 Symbol） |
| [[Call]]              | Reflect.apply(target, thisArg, args)            | 函数调用                      |
| [[Construct]]         | Reflect.construct(target, args[, newTarget])    | 构造函数调用                  |
| [[DefineOwnProperty]] | Reflect.defineProperty(target, key, descriptor) | 定义属性                      |

```js
const obj = { a: 1 };
const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    console.log('get', key);
    return Reflect.get(target, key, receiver); // 调用默认行为
  },
  set(target, key, value, receiver) {
    console.log('set', key, value);
    return Reflect.set(target, key, value, receiver); // 调用默认行为
  },
});

proxy.a;
proxy.a = 10;
```

**Vue3响应式原理**：基于Proxy（拦截对象操作），WeakMap（存储对象与依赖映射），effect（副作用函数/依赖函数），track / trigger（收集依赖与触发依赖构建）；核心目标：数据变化 → 自动触发依赖 → 更新视图/副作用；

- 响应式对象创建（Proxy）：将对象封装成Proxy对象，并且拦截get/set；
- 当你调用 `effect(fn)` （模版渲染函数，computed，watch，用户直接调用effect）时，Vue 会先将副作用函数 `fn` 设置为 `activeEffect`（一般全局只有一个activeEffect，嵌套Effect时会使用栈结构，但每次依然只有一个生效的 Effect），然后立即执行它。在执行过程中，如果访问响应式对象的属性，会触发 Proxy 的 get 拦截器。拦截器内部会调用 `track(target, key)`，将当前正在执行的 Effect（即 `activeEffect`）注册到 WeakMap（全局共用）的对应对象属性依赖集合里，实现依赖收集。这样，当该属性发生变化时，依赖它的 Effect 会被重新执行。如果访问的属性值本身是对象或数组，Vue 会返回它的 Proxy，从而实现嵌套对象的响应式（懒递归，只有访问到该属性对象时才递归进行Effect流程）
- 用户修改proxy对象属性时：Proxy 的 `set` 拦截器被触发，调用 `Reflect.set` 执行原始赋值，调用`trigger`通知依赖该属性的 effect 执行更新；

```text
                ┌─────────────┐
                │  reactive   │
                │  创建Proxy  │
                └─────┬──────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
      get操作                      set操作
        │                           │
        ▼                           ▼
  Proxy get拦截器触发           Proxy set拦截器触发
        │                           │
        ▼                           ▼
  track(target,key)              Reflect.set(target,key,value)
        │                           │
        ▼                           ▼
  判断是否有 activeEffect         赋值成功，原始对象更新
        │                           │
        ▼                           ▼
  将 activeEffect 收集到           trigger(target,key)
  targetMap[target][key]              │
        │                             ▼
  如果属性值是对象/数组，           找到依赖 effect 集合
  返回递归 reactive Proxy             │
  （懒递归实现嵌套响应式）              ▼
                                   遍历依赖集合
                                   执行每个 effect
                                        │
                                        ▼
                             更新视图/执行副作用（computed/watch/render）
```

**WeakMap结构**

```text
targetMap (WeakMap)
   │
   ├── target1 (响应式对象)
   │        │
   │        └── depsMap (Map)
   │              │
   │              ├── key1 → Set(effect1, effect2)
   │              ├── key2 → Set(effect3)
   │
   └── target2 (响应式对象)
            │
            └── depsMap (Map)
                   │
                   └── key1 → Set(effect4)
```

#### ref

用于创建基本类型或对象的响应式引用（RefImpl），当访问value时收集依赖，当修改value时触发所有依赖该属性的副作用函数重新执行；

- ref在template模板中会自动unwrap（解引用），模板里可以直接用值，而不用`.value`；
- 基本类型无法被 Proxy 代理，ref能将基本类型包装为一个对象，通过 `value` 属性的 getter/setter 拦截读写操作，从而在读取时收集依赖，在修改时触发更新，实现响应式。
- 对于对象类型 ，Vue 会先用 `RefImpl` 包装数据，再把对象转换为 `reactive Proxy`，通过 `ref` 监听 `.value`，通过 `Proxy` 监听对象属性

```text
class RefImpl {
  constructor(value) {
    this.__raw = value
    this._value = convert(value) // 如果是对象，内部转为 reactive
    this.dep = new Set()         // 存放依赖
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newVal) {
    if (newVal !== this.__raw) {
      this.__raw = newVal
      this._value = convert(newVal)
      triggerRefValue(this)
    }
  }
}
```

#### reactive

reactive 通过Proxy 代理对象类型数据，在读取和修改数据时拦截操作，从而实现 依赖收集（track）和更新触发（trigger）

```text
reactive(obj)
      ↓
参数检查(非对象直接返回)
      ↓
markRaw检查(是否跳过响应式)
      ↓
缓存检查 reactiveMap(已有 Proxy 则复用)
      ↓
创建 Proxy(target, handlers（拦截器）)
      ↓
存入 WeakMap 缓存
      ↓
返回 Proxy
```

**ref和reactive区别：**

当涉及单值和整体替换的对象时使用ref，当涉及对象结构存储时使用reactive（性能上没有什么区别）

| 特性           | ref             | reactive |
| -------------- | --------------- | -------- |
| 支持类型       | 基本类型 + 对象 | 只能对象 |
| 实现方式       | getter/setter   | Proxy    |
| 访问方式       | `.value`        | 直接访问 |
| 响应粒度       | 单值            | 对象属性 |
| 是否可整体替换 | 可以            | 不可以   |
| 模板使用       | 自动解包        | 正常访问 |

#### shallowRef/shallowReactive:

只对第一层数据建立响应式：

- shallowRef：`.value` 本身是响应式，但`.value` 内部的对象不会被 reactive 处理
- shallowReactive：第一层属性是响应式，深层对象不会变成 reactive

适用于大型数据结构（比如渲染后端的大数据），只关心整体变化，而不关心内部属性变化；

#### readonly/shallowReadonly

用于根据响应式对象创建新的只读的响应式对象（允许响应式追踪，但禁止修改数据）；

- shallowReadonly：第一层属性只读，深层属性可以修改（prop的原理）；

适用于状态管理时对外暴露只读状态，防止数据被修改；

```vue
<script setup>
import { ref, readonly } from 'vue';
let a = ref(1);
let b = readonly(a);
</script>

<template>
  <div class="app">
    <div>{{ a }}</div>
    <div>{{ b }}</div>
    <button @click="a++">Increment</button>//a可以被修改并影响b
    <button @click="b++">Increment</button>//b不能被修改
  </div>
</template>
```

#### triggerRef

一个手动触发 ref 依赖更新的 API；主要用于配合 `shallowRef` 使用，当内部对象变化但 Vue 无法自动检测时，可以手动通知响应式系统更新视图

```vue
<script setup>
import { shallowRef, triggerRef } from 'vue';
const count = shallowRef({
  count: 0,
});

const handleClick = () => {
  count.value.count++;
  triggerRef(count); //添加triggerRef才会触发页面更新，否则不会
};
</script>

<template>
  <div>{{ count.count }}</div>
  <button @click="handleClick">增加</button>
</template>
```

#### toRefs/toRef

- toRefs：用于把一个响应式对象的每个属性转换成新的 `ref`，同时保持与原来响应式对象的连接；
- toRef：把对象的某个属性转换为一个 `ref`，并保持与原对象属性的响应式同步关系；

用于保持响应式对象解构赋值时，值的响应式丢失问题；

```js
<script setup lang="ts" name="Person">
import { ref ,toRefs} from 'vue';

let info = ref({name: 'aaa',age: 18,})
let { name, age } = toRefs(info.value);//这样结构出来的name,age才是响应式的

const age = toRef(info, "age")//age和info的age属性共用引用；
</script>
```

#### toRaw

用于获取响应式对象对应的原始对象

```vue
<template>
  <div>
    <h1>{{ person.name }}</h1>
    <h1>{{ person.age }}</h1>
    <button @click="person.age++">age++</button>
  </div>

</template>

<script setup name="App">
import {reactive,toRaw} from 'vue'
let person = reactive({
  name: 'aaa',
  age: 18,
})

//person2就相当于{name:'aaa',age:18}
let person2 = toRaw(person);
```

#### markRaw：

标记一个对象，使其永远不会被响应式变量赋值的对象

```vue
<template>
  <div>
    <h1>{{ person1.age }}</h1>
    <h1>{{ person.age }}</h1>
    <button @click="person1.age++">age++</button>
  </div>
</template>

<script setup name="App">
import { reactive, markRaw } from 'vue';

let person = { name: 'aaa', age: 18 };
//将person变成响应式赋值给person1，person1修改属性，person也跟着改
let person1 = reactive(person);

//将person标记永远不能响应式的对象，person1也不能响应式
let person = markRaw({ name: 'aaa', age: 18 });
let person1 = reactive(person);
</script>
```

#### customRef

允许自定义 `ref` 依赖收集与触发更新行为的 API；它接受一个工厂函数作为参数，工厂函数的参数是track和trigger，返回一个包含get和set函数的对象；

```vue
<template>
  <div>
    <h1>{{ x }}</h1>
    <button @click="x++">x++</button>
  </div>
</template>

<script setup name="App">
import { customRef } from 'vue';

let initX = 0; //可以将initX写在工厂函数里面
let x = customRef((track, trigger) => {
  return {
    //当x被访问时调用get()
    get() {
      track(); //通知Vue如果x更新了，就去页面变化x
      return initX;
    },
    //当x被修改时调用set()
    set(value) {
      initX = value;
      trigger(); //通知Vue一下x更新了
    },
  };
});
</script>
```

#### computed

用于根据已有响应式数据派生出新的响应式数据；

核心思想：基于依赖自动计算 + 结果缓存（依赖不变直接返回缓存）+惰性执行（依赖变化`computed` 不会立即执行，只有访问才重新计算）

- 接收一个get函数：返回一个只读的响应式ref对象；
- 接收一个包含get和set函数的对象作为参数：返回可读可写的ref对象；

适用于存储昂贵的计算结果，派生数据；

```vue
<template>
  <h1>{{ introduce }}</h1>
</template>

<script setup lang="ts" name="Person">
import { computed, reactive, ref, toRefs } from 'vue';

let info = reactive({
  name: 'aaa',
  age: 18,
});

//只读，不能通过introduce.value='aaa'修改
let ageAdd = computed(() => {
  return info.age + 1;
});

//设置一个可读可改的属性，当修改newAge.value时，info.age会跟着变化
let newAge = computed({
  get() {
    return info.age;
  },
  set(value) {
    info.age = value;
  },
});
</script>
```

#### watch

副作用监听器，用于监听一个或多个响应式数据，当数据变化时执行回调；

- watch只能监视ref，reactive，getter函数，计算属性，以及包含上述内容的数组；
- 原理：当指定依赖发生变化时，通过调度器（scheduler）执行回调函数，并提供新旧值；
  1. `watch` 内部会把第一个参数统一转成 getter函数（如果是reactive还会递归读取属性）；
  2. 创建 `getter` 后，Vue 会创建一个副作用对象（ReactiveEffect）
  3. 当执行 getter 时，收集依赖；
  4. 当trigger 触发更新时， watch的effect 不会直接执行，而是执行 scheduler

参数及其返回值：

- 第一个参数为监听的响应式变量，或包含响应式变量的数组；

- 第二个参数为监视数据改变时执行的回调函数

- 第三个参数是添加配置项；

  | flush值    | 执行时间   |
  | ---------- | ---------- |
  | pre (默认) | 组件更新前 |
  | post       | DOM 更新后 |
  | sync       | 同步执行   |

- watch返回的是停止监听当前依赖的函数，通过调用来执行；

```vue
<script setup>
import { reactive, watch } from 'vue'; // 导入 reactive 和 watch

const state = reactive({
  // 创建一个 reactive 响应式对象
  user: {
    // 嵌套对象用于演示 deep 监听
    name: 'Tom',
    age: 20,
  },
  keyword: '',
});

watch(
  () => state, // source：getter 形式监听整个 state（推荐统一写法）
  (newValue, oldValue, onCleanup) => {
    // callback：数据变化时触发；第三个参数用于注册清理函数

    const timer = setTimeout(() => {
      // 创建一个副作用
    }, 1000);

    onCleanup(() => {
      // 注册清理函数，在下一次 watch 执行前触发
      clearTimeout(timer); // 清理上一次的定时器
    });
  },
  {
    immediate: true, // 组件初始化时立即执行一次 watch 回调
    deep: true, // 深度监听对象内部属性变化（如 state.user.name）
    flush: 'post', // 在 DOM 更新完成后再执行回调
  }
);
</script>
```

#### watchEffect

自动依赖追踪的副作用函数，他会立即执行传入函数，在执行过程中自动收集依赖，当依赖变化时重新执行该函数（watch是手动指定依赖）；

```js
import { ref, watchEffect } from 'vue';

const count = ref(0);

watchEffect(() => {
  console.log(count.value);
});

count.value++;
```

#### onWatcherCleanup

专门用于在 watchEffect 或 watch 的副作用函数中注册清理回调。这些清理回调会在下一次副作用重新运行之前或组件卸载时被调用；

```js
import { ref, watchEffect, onWatcherCleanup } from 'vue';
const count = ref(0);
watchEffect(() => {
  console.log('count.value', count.value);
  onWatcherCleanup(() => {
    console.log('cleanup');
  });
});
```

#### ref模板引用：

在模板中给 DOM元素或组件实例 添加 `ref`，可以在 `setup` 中获取对应真实DOM或组件实例；

- 要在组件或元素挂载后（onMounted，nextTick）才能访问其属性（`setup()` 执行时 DOM还没创建，此时ref.value === null）；
- 在 `<script setup>` 中子组件默认是 封闭的，父组件无法访问内部属性，必须通过在子组件 `defineExpose()` 显式暴露，才能访问（可改）；
- 多个相同ref（如在v-for中使用）会得到DOM实例数组；
- 与document.querySelector区别：
  1. ref获取dom仅限于当前组件内的元素，而dq是全局DOM都可获取；
  2. ref可以获取Vue组件实例；

```vue
//子组件
<script setup>
import { ref, defineExpose } from 'vue';

const count = ref(0);

const add = () => {
  count.value++;
};

defineExpose({
  count,
  add,
});
</script>

//父组件
<template>
  <Child ref="childRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Child from './Child.vue';

const childRef = ref(null);

onMounted(() => {
  console.log(childRef.value.count);
  childRef.value.add();
});
</script>
```

### **指令**：

#### v-bind

单向绑定，将元素的属性的值绑定到某个data的数据中，可简写为`:`；常用于a标签的href，标签的class，style，动态修改标签的类名或样式；

```vue
<div id="root">
    <a v-bind:href='link'>点击跳转</a>
    <div :style="style">aaa</div>
</div>

<script>
    new Vue({
        el:'#root',
        data:{
            link:'https://cn.vuejs.org/',
            style:{color:'red';},
        }
    });
</script>
```

#### v-model

用于表单类元素内的value值的双向绑定；

**底层原理**：将value单向绑定content变量，当用户输入时触发input事件，将输入的内容赋值给content，由于value单项绑定content，所以最终content的值赋值给value；

**修饰符**：

`v-model.number` 将v-mode的传输改为数字（默认是字符串）；

`v-model.lazy` 只有在输入框失去焦点的时候才收集value值；

`v-model.trim` 将value值中文本前后的空格删除；

```html
<input type="text" v-model:value="content" />
//简写形式
<input type="text" v-model="content" />
```

在**单选框**中使用：单项框中要给value设置特定的值，才能让v-model绑定的data变量获得值，否则为null；

```html
男<input type="radio" name="sex" v-model="sex" value="男" /> 女<input
  type="radio"
  name="sex"
  v-model="sex"
  value="女"
/>
```

在**多选框**中使用：hobby要设置为数组，当被选中的多选框的value值会push到hobby数组中；

```html
篮球<input type="checkbox" v-model="hobby" value="篮球" /> 足球<input
  type="checkbox"
  v-model="hobby"
  value="足球"
/>
排球<input type="checkbox" v-model="hobby" value="排球" />
```

在**选择框**中使用：data中的变量要绑定到select标签上，被选中的option对应的value值会赋值给data的变量

```html
<select v-model="hobby">
  <option value="篮球">篮球</option>
  <option value="足球">足球</option>
  <option value="排球">排球</option>
</select>
```

#### v-on

事件绑定，可以简写为@，后面跟事件名称，事件回调函数；回调函数可以传参数，但要用$event占位符给event对象占位；

**事件修饰符：**

prevent：阻止默认行为；

stop：阻止冒泡；

capture：使事件变为捕获模式；

once：事件只能触发一次，当页面刷新了才能再次触发；

self：只有event.target是当前元素元素时才触发事件；

passive：元素的默认行为立即执行，无需等待事件回调函数执行完毕（绑定事件的元素触发事件时，先执行回调函数，再进行元素的默认行为）；

**键盘事件修饰符**：表示只有按下特定键才触发某个事件，可以连续调用表示同时按下键才触发；

enter：回车；delete：删除键或者退格键；esc：退出键；space：空格键；tab：换格键（不能和keyup一起用，因为按下tab时光标会被切走，弹起时已经不能触发事件了）；up：上键；down：下键；left：左键；right：右键；

```html
<button v-on:click="print('aaaaaa',$event)">按钮</button
>//$event为事件对象的占位符

<button @click.prevent="print">按钮</button>

<input
  type="text"
  id="root"
  @keyup.enter.y="print"
/>//同时按下enter和y才触发事件
```

#### v-show/v-if

**v-show**

- 通过CSS 控制显示，值为true时，代表元素的display为原来值，为false时代表元素的display为none；
- 不能与 `v-else / v-else-if` 配合；
- 不能作用在 `<template>`，必须绑定在真正的DOM元素上；
- 元素仍然在DOM树中，只是不在渲染树中而已，不会触发整个生命周期；

**v-if**

- 值为true时则将元素渲染到DOM中，为false时在DOM树中销毁元素；
- 如果设置在组件中会触发创建和销毁生命周期（重置组件状态）
- 当 `v-if` 和 `v-for` 同时存在于同一个元素上时，`v-for` 的优先级更高，这意味着：循环会先执行，再在每次循环中执行 `v-if` 判断（v-if判断的条件，需要v-for产生）（不推荐元素同时使用 v-if 和 v-for，而是提前filter在循环）

#### v-for

列表渲染，可用于遍历数组，对象，数字范围

- 对于数组第一个参数代表数组每个元素的值，第二个参数代表对应的索引；

- 对于对象第一个参数代表属性值，第二个参数代表属性名；

- 对于数字范围第一个参数代表从1到数字的递增；

```html
<div class="root">
  //遍历数组
  <ul>
    <li v-for="(item,index) in arr" :key="index">{{item}}-{{index}}</li>
  </ul>

  //遍历对象
  <ul>
    <li v-for="(value,key) in obj" :key="">{key}}-{{value}}</li>
  </ul>
  //数字范围
  <ul>
    <li v-for="k in n" :key="k">{{k}}</li>
    //展示10个内容为从1到10的li
  </ul>
</div>
```

#### v-text/v-html

v-text:替换盒子的所有文本，不会解析标签；
v-html:替换盒子的所有文本，能解析标签，可能会有XSS攻击；

```vue
<div v-text="content"></div>
<div v-html="content"></div>

<div v-html="message"></div>
//会执行onclick事件，即会执行JS脚本;
<script>
new Vue({
  el: '.root',
  data: {
    content: '<span>Hello world</span>',
    message: '<h1 onclick="alert(\'Hello Vue.js!\')">Hello Vue.js!</h1>',
  },
});
</script>
```

#### **v-cloak**

一个属性，当Vue实例对象建立完毕后就会删除，当浏览器因其他原因延迟解析script导致Vue实例对象延迟建立，而引发不能渲染DOM时，使用v-cloak配合使用CSS的属性选择器，可以使DOM元素暂时不显示在页面上

```vue
<style>
[v-cloak] {
  display: none;
}
</style>

<div class="root" v-cloak>页面正在加载</div>

<script>
let vm = new Vue({
  el: '.root',
});
</script>
```

#### **v-pre**

跳过所在节点的Vue编译，可用它跳过没有使用指令的节点，加快编译；

```html
<div class="root" v-pre></div>
```

#### v-once

仅渲染元素和组件一次，并跳过之后的渲染更新，相当于静态内容；

```vue
<script setup name="">
import { ref } from 'vue';
const count = ref(0);
</script>

<template>
  <button @click="count++">Click me</button>
  <div v-once>Home once {{ count }}</div>
  //永远等于0
</template>
```

#### v-memo

用于缓存子树渲染结果，当指定的依赖没有变化时，Vue 会跳过该模板子树的重新渲染；

```vue
<script setup name="">
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <button @click="count++">Click me</button>
  <div v-memo="[count]">Home count: {{ count }}</div>
</template>
```

### 编译器宏

编译器宏函数是专为 `<script setup>` 语法糖设计的编译阶段特殊语法，在编译阶段由 Vue 编译器特殊处理的函数标记，它们不会在运行时存在，而是在编译时被转换成普通 JavaScript 代码，简化 `<script setup>` 中组件的配置（props、emits、选项等）；

Vue SFC 编译器（`@vue/compiler-sfc`）会自动识别，无需手动导入宏函数；并且宏函数只能在 `<script setup>` 的顶层使用；

#### defineProps

获得组件接收的属性，并返回一个响应式的 props 对象；接受一个对象作为参数，并返回一个含有传入值的proxy对象，通过这个proxy对象可以访问到传入值（传入值是只读并具有响应式的）；在父组件中传递变量的名称要和子组件的defineProps中的一样；

可以指定传入对象的type，default，required，validator（验证函数）；并且解构赋值props时要使用toRefs来维持响应式；

```vue
//在App组件中
<script setup>
import { ref } from 'vue';
import Son from './components/Son.vue';
let count = ref(1);
</script>
<template>
  <Son :count="count" />
  <button @click="count++">Increment</button>
</template>

//在Son组件中
<script setup name="">
const props = defineProps({
  count: {
    type: Number,
    default: 0,
    required: true,
    validator: (value) => value >= 0,
  },
});

const { count } = toRefs(props); //解构赋值时要使用toRefs来维持响应式;
</script>
```

#### defineEmits

用于声明组件可触发的事件，并返回一个用于触发事件的emit 方法；当调用emit方法触发事件时，所有注册该事件的回调都会被调用；

emit方法：

- 第一个参数为要触发的事件名；
- 第二个参数为触发事件的传入参数；

```vue
//子组件
<script setup>
const emit = defineEmits({
  change: (count) => typeof count === 'number',
  submit: (form) => form.name && form.age,
});
let count = 0;
// 修改 count 并通知父组件
const changeCount = () => {
  count++;
  emit('change', count);
};
// 提交表单
const submitForm = () => {
  const form = {
    name: 'Tom',
    age: 18,
  };
  emit('submit', form);
};
</script>

<template>
  <div class="son">
    <button @click="changeCount">修改 count</button>
    <button @click="submitForm">提交表单</button>
  </div>
</template>

//父组件
<script setup>
import Home from './components/Home.vue';

const handleChange = (count) => {
  console.log('count changed:', count);
};

const handleSubmit = (form) => {
  console.log('form submit:', form);
};
</script>

<template>
  <div class="app">
    <Home @change="handleChange" @submit="handleSubmit" />
  </div>
</template>
```

#### defineExpose

`<script setup>` 中子组件的内部变量和方法默认是封闭的，父组件无法通过 ref 获取，defineExpose 用于显式暴露需要对外提供的属性 和方法；暴露的属性支持响应式；

```vue
<!-- 子组件 -->
<script setup>
import { ref } from 'vue';
const count = ref(0);
const increment = () => count.value++;
// 显式暴露属性/方法给父组件
defineExpose({
  count,
  increment,
});
</script>

<!-- 父组件 -->
<script setup>
import { ref } from 'vue';
import Child from './Child.vue';
const childRef = ref(null);
const handleClick = () => {
  console.log(childRef.value.count); // 0
  childRef.value.increment(); // 调用子组件方法
};
</script>
<template>
  <Child ref="childRef" />
  <button @click="handleClick">调用子组件方法</button>
</template>
```

#### defineOptions

替代传统选项式 API 的顶层选项（如 `name`、`inheritAttrs`、`components` 等）；

可以用于：

- keep-alive的include/exclude 匹配；
- 禁用默认的继承父属性行为（如`<MyInput class="big" />`，在子组件会`<input />`）
- 开发调试

```vue
<script setup>
defineOptions({
  name: 'Home',
  inheritAttrs: false, // 禁用默认的属性继承行为
  components: {
    // 声明有哪些子组件
  },
});
</script>
```

#### defineModel

用于在子组件中声明一个可通过 `v-model` 绑定的 prop，并自动生成对应的 `update:xxx` 事件，从而实现父子组件之间的双向数据同步；（本质是`prop + emit('update:xxx')`实现双向绑定的语法糖）；

```vue
//父组件中
<script setup>
import Home from './components/Home.vue';
import { ref } from 'vue';
const count1 = ref(0);
const count2 = ref(0);
</script>

<template>
  <div class="app">
    <Home v-model:count1="count1" v-model:count2="count2" />
  </div>
</template>

//子组件中
<script setup>
const model1 = defineModel('count1', {
  default: 0,
  type: Number,
});

const model2 = defineModel('count2', {
  default: 0,
  type: Number,
});
</script>

<template>
  <div>{{ model1 }}</div>
  <div>{{ model2 }}</div>
  <button @click="model1++">model1增加</button>
  <button @click="model2++">model2增加</button>
</template>
```

#### defineSlots

用于为插槽提供类型信息，让 IDE 能正确提示 slot 的参数结构

```vue
//子组件
<script setup lang="ts">
interface User {
  name: string;
  age: number;
}

const slots = defineSlots<{
  default(props: { user: User }): any;
}>();

const user: User = {
  name: 'Tom',
  age: 18,
};
</script>

<template>
  <slot :user="user"></slot>
</template>

//父组件
<Child>
  <template #default="{ user }">
    {{ user.name }}
    {{ user.age }}
  </template>
</Child>
```

### 内置组件

#### teleport

用于将组件模板中的部分 DOM 节点渲染到页面中指定的目标位置；

- 虽然这些 DOM 在实际页面结构中被移动到了其他位置，但在逻辑上它们仍然属于原来的组件树，因此组件之间的 `props`、`emit`、`provide/inject` 等关系不会受到影响

- 解决在普通组件结构中，子组件 DOM 会被渲染在父组件 DOM 内部，因此会受到父元素样式影响问题，例如：`overflow: hidden`，`transform`，`filter`，`position`，`z-index`
- teleport标签属性：
  1. to：指定传送的目标 DOM 位置，可以是CSS 选择器，真实 DOM 元素
  2. disabled：控制 是否启用 teleport，如果为 `true`，就不会进行传送，而是在原位置渲染；
  3. defer：延迟 teleport 挂载，等目标节点出现再挂载，解决目标节点晚于组件渲染的问题；

```html
<body>
  <div id="app"></div>
  <div id="modal-root"></div>
</body>

//组件中
<teleport to="#modal-root">
  <div class="modal">这是一个弹窗</div>
</teleport>
```

#### component

动态组件容器，用于根据条件在同一位置动态切换不同组件；

本质是通过 `resolveDynamicComponent` 解析组件类型并生成对应的 VNode，当组件类型变化时 Vue 会卸载旧组件并挂载新组件，如果结合 `keep-alive` 则可以实现组件缓存；

- 通过is属性来决定要渲染哪个组件，并且可以添加其他属性作为props参数（但是需要统一props防止多个组件不兼容）；
- 组件切换时会销毁旧组件（触发完整生命周期），可以使用keep-alive包裹保留状态；
- 如果多个组件结构类似，Vue 可能会 复用 DOM，出现状态错乱，可以添加key属性；

```vue
<script setup>
import Son from '@/components/Son.vue';
import Son1 from '@/components/Son1.vue';

import { ref } from 'vue';
let which = ref(Son);
function toggle() {
  //切换which的值为Son1
  which.value = Son1;
}
</script>

<template>
  <component :is="which" :key="current"></component
  >//渲染哪个组件根据which来决定
  <button @click="toggle">切换</button>
</template>
```

#### keep-alive

用于缓存组件实例（不能缓存普通元素），保留组件状态，避免组件在切换时被销毁（如v-if，component，路由切换）；

属性：

- include：指定缓存的组件名（defineOption指定的名字），可写字符串，字符串数组，正则表达式；
- exclude：指定不缓存的组件；
- max最多缓存多少个组件，超过数量时，删除最久未使用组件（LRU算法）；

keep-alive内组件切换时的触发的生命周期钩子：

- onActivated：当组件触发时执行的钩子

- onDeactivated：当组件被切换时触发的生命钩子；

```js
<keep-alive :include="Son" :exclude="Son1" :max="2">
    <component :is="which"></component>
</keep-alive>

//Son组件中
<script setup name="Son">
import {onActivated,onDeactivated} from 'vue'
onActivated(()=>{
    console.log('onActivated')
})
onDeactivated(()=>{
    console.log('onDeactivated')
})
</script>
```

#### transition

通过不同生命周期（元素插入和离开）添加或移除CSS类来实现动画：并且整个过程中要设置transition属性或者直接使用animation属性才能实现；

元素插入前：v-enter-from{}；

元素插入过程：v-enter-to{}；

元素插入的整个过程：v-enter-avtive{}；

在插入的过程会同时含有v-enter-active和v-enter-to两个类；而插入过渡结束后就移除了；

元素离开前：v-leave-from{}；

元素离开过程：v-leave-to{}；

元素离开的整个过程：v-leave-avtive{}；

在动画结束后所有动画相关类都会被移除，并且由于v-show会改变状态；

trantion标签上的属性：name（名称，默认为v-，添加名称后类名v-要改为名称）；appear（动画初始时是否触发一次插入动画）；

```vue
<script setup>
import { ref } from 'vue';
let isShow = ref(true);
</script>

<template>
  <transition name="Name" appear>
    <div v-show="isShow">Hello world</div>
  </transition>

  <button @click="isShow = !isShow">isShow</button>
</template>

<style scoped>
.Name-enter-active{
    transition: all 2s;//为整个插入过程添加过渡，过渡所有样式，时间为2s
}
.Name-enter-from{//插入过渡开始时样式
    font-size: 10px;
    color:aqua;
}
.Name-enter-to{//插入过渡结束时样式
    font-size: 30px;
    color:black;
}

.Name-leave-active{
    transition: all 2s;
}
.Name-leave-from{
    font-size: 30px;
}
.Name-leave-to{
    font-size: 10px;
}
</style>
```

**transition-group**

v-for的列表过渡效果，transition只能设置单个元素，而transition-group可以设置多个元素；每个列表元素都要设置:key否则Vue无法跟踪；

```vue
<script setup>
import 'animate.css';
import { ref } from 'vue';
let isShow = ref(true);
</script>

<template>
  <transition-group
    enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__fadeOut"
  >
    <div v-for="n in 10" :key="n" v-show="isShow">{{ n }}</div>
  </transition-group>
  <button @click="isShow = !isShow">isShow</button>
</template>
```

**animate.css动画库：**

在终端中安装` npm i animate.css --save`；

由于行内元素的某些特性，当在行内元素使用animate.css可能会导致不生效；

```vue
<script setup>
import 'animate.css'; //在该组件引入动画库，也可以在main中全局引入
import { ref } from 'vue';
let isShow = ref(true);
</script>

<template>
  <transition
    enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__fadeOut"
  >
    <div v-show="isShow">Hello world</div>
  </transition>
  <button @click="isShow = !isShow">isShow</button>
</template>
```

### 异步组件

本质是将组件变成动态导入模块，还添加了延迟加载，调度，缓存，错误处理功能；

异步组件在构建时会被拆分成独立的 chunk；

- 如果所有组件都 同步加载，构建工具会把组件全部打包到一个 `bundle.js` 中，可能导致JS 解析时间长，首屏加载慢；

- 使用异步组件后，构建工具会进行代码分割，生成主包`bundle.js`和按需加载的模块：`chunk-A.js`、`chunk-B.js`，只有在 真正渲染该组件时，浏览器才会去加载对应的 `chunk` 文件；

#### Suspense

用于统一管理组件树中的异步组件（由defineAsyncComponent或`<script setup>` 中使用 `await`的组件），并在异步完成前显示 fallback（加载状态）；

```html
渲染 Suspense ↓ 发现 AsyncComponent 未加载 ↓ 显示 fallback ↓ AsyncComponent
加载完成 ↓ 渲染 default

<Suspense>
  <template #default>
    <AsyncUser />
    <PostList />
  </template>
  <template #fallback> Loading... </template>
</Suspense>
```

#### defineAsyncComponent

`defineAsyncComponent` 是 Vue3 中用于生成异步组件的 API

```js
import { defineAsyncComponent } from 'vue';

const AsyncComp = defineAsyncComponent({
  loader: () => import('./MyComponent.vue'), // 异步加载组件，返回 Promise，组件在渲染时才会动态加载
  loadingComponent: LoadingComponent, // 组件加载过程中显示的占位组件
  errorComponent: ErrorComponent, // 组件加载失败或超时时显示的组件
  delay: 200, // 延迟 200ms 再显示 loadingComponent，避免组件很快加载完成时出现闪烁
  timeout: 3000, // 最长等待 3000ms，超过时间仍未加载成功则视为失败
  suspensible: true, //当前组件是否可以被Suspense接管，此时自身的loading和error会失效，默认true
});
```

### 应用app实例：

#### app.component

注册一个全局组件，第一个参数为组件名，第二个参数为组件实例；

```vue
import { createApp } from 'vue' import App from './App.vue' import hello from
'./Hello.vue' const app = createApp(App)
//这样Hello组件就能在APP，Son等组件中直接使用 app.component('Hello',hello)
app.mount('#app')
```

#### app.config

Vue的配置选项对象；

```vue
import { createApp } from 'vue' import App from './App.vue' const app =
createApp(App)
app.config.globalProperties.pai=3.14;//全局都能直接用pai这个变量，{{
  pai
}}
app.mount('#app')
```

#### app.directive

用于注册全局自定义指令（类似v-for，v-bind的功能），这些指令允许你直接操作DOM；

局部指令：在 `<script setup>` 中声明以 `v` 开头的变量，Vue 会自动将其注册为当前组件的指令，例如 `vFocus` 对应模板中的 `v-focus`；

app.directive参数：

- 第一个参数为指令名称（不需要 `v-` 前缀，使用时要）；

- 第二个参数为指令钩子对象，指令在绑定元素的特定时期（声明周期）会调用一些指令钩子：

  | 钩子          | 触发时机         |
  | ------------- | ---------------- |
  | created       | 指令绑定到元素时 |
  | beforeMount   | 元素插入 DOM 前  |
  | mounted       | 元素插入 DOM 后  |
  | beforeUpdate  | 组件更新前       |
  | updated       | 组件更新后       |
  | beforeUnmount | 元素卸载前       |
  | unmounted     | 元素卸载后       |

指令钩子的参数：

- el：绑定指令的元素实例；

- binding：指令信息对象，含有value：传给指令的值，arg：传给指令的参数（会自动转为字符串）；

- vnode：该元素的虚拟节点；
- prevVnode：上一个虚拟节点；

```vue
//main.js const app = createApp(App) app.directive('my-focus', { mounted(el,
binding) { el.focus();//让元素获得焦点 }, }) app.mount('#app') //在App组件中:
<script setup>
import { ref } from 'vue';
let a = ref(1);
</script>

<template>
  <div class="app">
    <input
      type="text"
      v-my-focus:100="a"
    />//binding.arg为"100"，binding.value为a;
  </div>
</template>
```

#### app.unmount

卸载组件与挂载组件`app.mount(#app)`相反

#### app.use

Vue插件为一个对象，必须包含install方法，用来向全局添加一些功能，通过在main.js中使用app.use注册（第一个参数为插件对象，第二个参数为插件配置）；

install方法：

- 第一个参数为全局app实例对象；
- 第二个参数为use时传入的插件配置；

```vue
//plugins/plugin1.js export default { install(app,options){ console.log(app);
console.log(options) } } //main.js import pugin from './plugins/pugin'; const
app = createApp(App); app.use(pugin,{name:"aaa",age:23}); app.mount('#app');
```

### 通用方法

#### nextTick

Vue采用的是异步更新dom策略，响应式数据发送改变时，不会立即更新dom，而是会开启一个异步任务队列来更新数据，等待所有数据更新完成后才更新dom；而nextTick的回调函数就是在当前dom更新后执行的；

nextTick()依次使用promise，mutationObsever，setInterval，setTimeout来开启的异步任务；他接收一个回调函数作为参数，一般返回的是一个成功的Promise对象；

与onUpdated钩子的区别：onUpdated是每次DOM更新完成之后执行；而nextTick是在当前DOM更新完成后调用一次；

```vue
<script setup>
import { ref, nextTick } from 'vue';

const a = ref(0);

//每次触发increment事件时，a.value加一引发DOM更新，又调用nextTick来获得新的a.value的值
const increment = () => {
  a.value++;
  nextTick(() => {
    console.log('Updated value:', a.value);
  });
};

nextTick(() => {
  //如果把nextTick放在这里，那它只会执行一次输出0
  console.log('Updated value:', a.value);
});
</script>

<template>
  <div class="app">
    <div>{{ a }}</div>
    <button @click="increment">Increment</button>
  </div>
</template>
```

#### provide&inject

用于跨层级组件通信的一组 API，本质上解决的是祖先组件 → 任意深度后代组件的数据传递问题，避免层层 `props` 透传；

provide：在祖先组件提供依赖（键值对），提供给任何层级后代消费依赖；

inject：用于根据键消费祖先组件提供的依赖，返回祖先或app.provide提供的依赖值，可以通过第二个参数设置默认值，并且可以使用<>声明类型；

- 祖先组件默认是值传递（普通类型的修改不会影响祖先组件），可以传递响应式状态来保持响应式（子组件修改会响应式更新所有依赖这个状态的组件）；
- provide的键优先使用Symbol类型（并且导出），`inject` 是向上查找最近匹配 key，防止冲突；
- provide的值应该包含readonly的响应式状态，修改此状态的方法；

```vue
//父组件中
<template>
  <div>
    <Son></Son>
  </div>
</template>

<script setup name="App">
import { ref, provide } from 'vue';
import Son from './components/Son.vue';

let a = ref(100);
provide('a', a.value);

//通过传递函数来实现子传父
const fun = (data) => {
  a.value = data;
};
provide('fun', fun);
</script>

//在子组件中
<script setup lang="ts" name="Son">
import { ref, inject } from 'vue';
const a = inject<string>('a', '默认值');

//子传父
const fun = inject<Function>('fun');
fun(10); //传递10给a
</script>

//封装hook // useTheme.js export function provideTheme() { const state =
reactive({ theme: 'dark' }) const toggle = () => { state.theme = state.theme ===
'dark' ? 'light' : 'dark' } provide(ThemeKey, { state: readonly(state), toggle
}) } export function useTheme() { return inject(ThemeKey) }
```

#### getCurrentInstance

用于在 `setup` 阶段（在setup周期之前创建）获取当前组件实例；

```text
//可以访问
{
  proxy,        // 代理对象（等价 this）
  appContext,   // 应用上下文
  provides,     // provide 数据
  parent,       // 父组件实例
  emit,         // 事件触发函数
  props,        // props
  slots,        // 插槽
  attrs,        // attrs
  refs,         // ref引用
  vnode,        // 虚拟节点
  type          // 组件定义
}
```

#### useId

用来生成在应用内稳定且唯一的 ID，主要用于：SSR（服务端渲染）+ 客户端水合一致性和无障碍（a11y）属性绑定（label / input）；

底层原理：Vue 内部为整个应用（非单一组件）维护一个递增计数器，每次调用返回（v-1,v-2....）；

- 依赖调用序列稳定性，不能写在条件/循环里（服务端不执行JS会导致与客户端错乱）；

```vue
<script setup>
import { useId } from 'vue';
for (let i = 0; i < 10; i++) {
  console.log(useId());
}
</script>

<template>
  <div class="app">
    <div v-for="item in 10" :key="useId()">{{ item }}</div>
  </div>
</template>
```

### 插槽

插槽是一种组件内容分发机制，它允许父组件向子组件内部指定位置插入模板内容，从而让组件既能封装结构，又能保持内容的灵活性；

用于解决UI 结构（DOM / 模板）无法很好通过 props 传递的问题（比如DOM/模板中包含父组件的状态）；

- slot 本质是一个函数，父组件会把一段渲染函数传递给子组件，子组件在 `<slot>` 位置调用该插槽函数；
- 渲染作用域，插槽内容，在父组件作用域编译，插槽坑位，在子组件作用域编译；

#### 默认插槽

- slot标签内容可以写默认内容，如果没有插入内容则默认内容不显示；

- 使用多次slot标签就会显示多次插入内容；

```vue
//父组件中：
<template>
  <div>
    <Son>
      <h1>插槽内容</h1>
    </Son>
  </div>
</template>

<script setup name="App">
import { ref } from 'vue';
import Son from './components/Son.vue';
</script>

//子组件中：
<template>
  <slot>默认内容</slot>
  <slot></slot>
</template>

<script setup lang="ts" name="Son">
import { ref } from 'vue';
</script>
```

#### 具名插槽

- 当子组件需要多个插槽位置时，可以使用 `name` 为插槽命名，父组件通过 `v-slot:name`（或 `#name`）向对应的插槽传入内容（需要使用`<template>`）；
- 在子组件中的`<slot>`中通过name属性来指定插槽名；
- slot 名称可以动态：`<template #[name]>`

```vue
//父组件中
<template>
  <div>
    <Son>
      <template v-slot:s1
        >//插入名为s1的slot标签的内容
        <h1>s1插槽</h1>
      </template>

      <template #s2
        >//插入名为s2的slot标签的内容
        <h1>s2插槽</h1>
      </template>
    </Son>
  </div>
</template>

<script setup name="App">
import { ref } from 'vue';
import Son from './components/Son.vue';
</script>

//子组件中
<template>
  <slot name="s1">默认内容1</slot>
  <slot name="s2">默认内容2</slot>
</template>

<script setup lang="ts" name="Son">
import { ref } from 'vue';
</script>
```

#### 作用域插槽

- 子组件通过 `<slot>` 的 props 向父组件暴露数据，父组件在 `template` 中接收并使用这些数据进行渲染；
- 并且子组件传递的slot props 对于父组件仍然是响应式的（引用传递）；
- 但是父组件不能直接修改子组件的slot props

```vue
//父组件中：
<template>
  <div>
    <Son>
      //接收Son组件在slot标签传过来的数据，全部汇总到一个名为obj的对象上
      <template v-slot:s1="obj">
        <h1>{{ obj.sendobj.a }}</h1>
        <h1>{{ obj.sendobj.b }}</h1>
        <h1>{{ obj.sonname }}</h1>
      </template>
    </Son>
  </div>
</template>

<script setup name="App">
import { ref } from 'vue';
import Son from './components/Son.vue';
</script>

//子组件中
<template>
  <h1>Son组件</h1>
  <slot name="s1" :sendobj="obj">默认内容1</slot>
</template>

<script setup lang="ts" name="Son">
import { ref, reactive } from 'vue';

let obj = reactive({
  a: 18,
  b: 'aaa',
});
</script>
```

#### useSlots

用于在 `setup` 里访问插槽对象的API（组合式API使用this.$slots访问），相当于`getCurrentInstance().slots`；

- 每个 slot 本质是一个函数，返回对应的虚拟节点；

```js
{
  default: (props) => VNode[],
  header: (props) => VNode[],
  footer: (props) => VNode[]
}

slots.default?.()
```

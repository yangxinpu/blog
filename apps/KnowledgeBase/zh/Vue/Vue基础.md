# Vue基础

### 软件架构模式

#### MVVM

MVVM（Model-View-ViewModel）是一种软件架构模式（前端，移动端，桌面端），核心目标是彻底分离视图展示（View）和业务数据（Model），通过 ViewModel 作为中间层实现数据与视图的双向自动同步；

常见框架Vue.js、Angular

- Model（模型）：负责存储应用程序的核心数据、业务逻辑以及数据的获取、保存和持久化。它完全独立于视图和视图模型，不关心界面如何展示，也不包含视图相关的逻辑；
- View（视图）：负责展示用户界面，直接与用户交互。它只关心界面的呈现和用户输入事件的抛出。视图不应包含任何业务逻辑，所有的界面更新逻辑应由ViewModel控制；
- ViewModel（视图模型）：MVVM架构中的核心，它将视图和模型进行连接。ViewModel的职责是：
  - 数据绑定：它将模型数据映射到视图。它通过数据绑定将模型中的数据和视图中的显示保持同步。
  - 命令绑定：它接收来自视图的用户输入并将其转化为对模型的操作，或者直接处理事件逻辑。
  - 视图的状态管理：它管理视图的状态变化，比如视图加载时的展示数据、加载状态、错误提示等。
  - 自动更新：通过数据绑定，ViewModel能够在模型数据变化时，自动更新绑定到视图上的元素。

MVVM的工作流程

1. 用户交互（View）：用户与视图交互，如点击按钮、输入内容或滑动等。
2. ViewModel响应：视图将用户的输入事件传递给ViewModel。ViewModel接收到事件后，更新模型（Model）。
3. 模型更新（Model）：模型执行业务逻辑（如数据更新、数据库查询等）。一旦数据更新，模型将通知ViewModel数据变化。
4. ViewModel更新视图：ViewModel根据更新后的数据自动更新视图，视图无需手动更新，绑定的数据会自动反映到界面上。
5. 数据展示：视图自动展示最新的数据，并响应用户输入。

#### MVC

MVC（Model-View-Controller）模型是一种常见的软件架构模式，用于实现用户界面和业务逻辑的分离；

- Model（模型）：负责管理应用程序的核心数据和业务逻辑；它独立于用户界面，通常包含数据的获取、存储、更新等功能，并通过数据库、文件系统或其他数据源与外部交互；
- View（视图）：负责呈现数据（从模型中获取）并显示给用户；视图从模型中获取数据并负责显示，但它不处理任何业务逻辑。
- Controller（控制器）：连接模型和视图的中介，负责接收来自视图的用户输入，处理后更新模型或视图，确保数据和界面的同步；它包含了应用程序的控制流逻辑；

MVC的工作流程：

1. 用户输入：用户通过视图与应用程序交互，比如点击按钮、提交表单等。
2. 控制器处理：控制器接收到用户的输入后，决定如何处理。它会根据输入更新模型，或者直接请求模型执行某些操作。
3. 更新模型：模型进行相应的业务逻辑处理，并可能会改变应用程序的状态（如更改数据）。
4. 更新视图：控制器根据模型的变化更新视图。视图从模型中获取最新的数据并重新渲染，以展示给用户；

#### MVVM和MVC区别

| 特性             | **Controller**                    | **ViewModel**                                  |
| ---------------- | --------------------------------- | ---------------------------------------------- |
| **架构模式**     | MVC                               | MVVM                                           |
| **与视图的关系** | 直接操作视图，较强耦合            | 通过数据绑定间接与视图交互，较低耦合           |
| **职责**         | 处理用户输入，调用模型并更新视图  | 处理视图的状态和数据转化，自动更新视图         |
| **与视图的交互** | 直接修改视图和UI组件              | 通过数据绑定同步视图和模型的数据               |
| **业务逻辑处理** | 包含业务逻辑                      | 主要处理视图相关逻辑，业务逻辑通常在模型中处理 |
| **适用场景**     | 传统Web应用，尤其是后端驱动的应用 | 前端应用，动态交互多、需要实时更新视图的场景   |

### 编译原理

本质上是一个模板 → 渲染函数（Render Function）→ 虚拟 DOM → 真实 DOM的过程；

- Parse：对template解析（词法分析，语法分析，生成 AST 节点类型）成 AST；

- Transform：将模板语法 转化为JavaScript 逻辑的AST，并且进行编译优化（动态标记）；
  1. 节点转换：把 HTML 标签转换为创建 VNode 的调用结构的AST；

  2. 指令处理：把 Vue 指令转换成标准 JavaScript 逻辑（如v-for转化成循环调用render函数）；

  3. 表达式处理：做变量作用域分析，并把该模板变量绑定到组件上下文；

  4. 静态提升：把不会变化的节点（不依赖响应式数据，没有动态绑定，没有指令）提取成常量，并且提升到 render 函数外部（避免重复创建 VNode）；

  5. PatchFlag（更新标记）：为每个VNode 添加一个变化标记（是文本会变

     还是 class 会变等），更新时，不再做全量 diff，只更新标记的部分；

  6. Block Tree（区块树）：标记哪些节点是动态的，并且收集这些节点到一个数组，减少遍历节点数量，提高 diff 性能；

  7. Helper 注入（运行时函数注入）：自动引入 render 函数需要的工具函数；

  8. 文本优化：合并相邻文本，减少节点数量；

  9. 缓存优化：缓存不会变化的表达式或函数，避免每次 render 都创建新函数；

- Generate：阶段负责将 Transform 阶段生成的 VNode 调用结构（JS AST）递归转换为字符串形式的 render 函数代码，同时处理 helper 引入、静态提升变量输出等，使模板最终变成可执行的函数；

```text
template 模板
   ↓（编译器 @vue/compiler-dom）
AST（抽象语法树）
   ↓（转换优化）
优化后的 AST（带 patchFlag、静态提升等）
   ↓（代码生成）
render 函数（JS代码）
   ↓（运行时 @vue/runtime-dom）
VNode（虚拟DOM）
   ↓（diff + patch）
真实 DOM
```

每个 Vue 组件在运行时都会对应一个 render 函数，而 `.vue` 文件在编译后会变成一个 ES Module，其中包含 render 函数、组件配置对象，并通过 `export default` 导出组件；

```vue
<template>
  <div>{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return { msg: 'hello' };
  },
};
</script>

//编译后 import { toDisplayString, createElementVNode } from "vue" //
静态提升（如果有） const _hoisted_1 = /*#__PURE__*/createElementVNode("span",
null, "static") // render 函数（template 编译生成） function render(_ctx,
_cache) { return createElementVNode( "div", null, toDisplayString(_ctx.msg), 1 )
} // script 部分 const script = { data() { return { msg: 'hello' } } } // 合并
script.render = render // 导出组件 export default script
```

### 渲染原理

首先执行 `createApp(App)` 创建应用实例（全局控制中心），初始化包含全局组件、指令、依赖注入等配置的 `appContext`，但此时仅完成应用 架子搭建，未触发任何渲染逻辑；当调用 `app.mount('#app')` 时，才真正启动渲染流程：（render → createVNode(rootComponent) → patch(null, vnode, container)）

- **创建组件内部实例（ComponentInternalInstance）**：一个空壳实例，包含 `uid`（唯一标识）、`vnode`（组件对应的虚拟节点）、`type`（组件类型，根组件是 App）、`parent/root`（父子 / 根实例关联）、`appContext`（应用上下文）等核心字段；
- **初始化组件和执行setup函数**：
  1. 处理 props：初始化 props 的代理（让 props 具备响应式）；
  2. 收集暴露属性：把 `expose()` 暴露的属性存到实例的 `publicInstance`，供父组件访问；
  3. 存储响应式数据：把 setup 里的 `ref/reactive/computed` 都注册到 `instance.setupState`，后续渲染时能读取到；
  4. 覆盖 render 函数：如果 setup 返回一个函数（render 函数），会替换组件原本的模板编译后的 render 函数；
  5. 标记状态：设置 `instance.isMounted = false`，标记组件还未挂载到 DOM；
- **创建渲染副作用**：

```js
instance.update = effect(
  () => renderComponentRoot(instance), // 核心：执行渲染函数生成VNode
  { scheduler: queueJob } // 优化：更新时不立即执行，先入队列（避免频繁更新）
);
```

1. 这个 effect 会立即同步执行一次，触发后续的 DOM 挂载；
2. 执行 `renderComponentRoot` 时，Vue 会自动 `track`（追踪）所有读取到的响应式数据（依赖收集），后续数据变化时，会触发这个 effect 重新执行，实现视图更新；
3. `scheduler: queueJob` 是性能优化：即使多个数据同时变化，也不会多次执行 effect，而是把更新任务放进队列，异步批量执行。

- **渲染函数执行**：

  根组件：以 `instance.proxy`（组件的代理对象，能访问 props/setupState 等）作为渲染上下文（`_ctx`），执行 render 函数，返回根组件的 VNode 树；

  子组件：先通过 `createVNode` 创建子组件的 VNode，但子组件的 `renderComponentRoot`（执行子组件 render）不会立刻执行，要等后续 patch 阶段才触发

- **patch 阶段**： Vue 递归遍历整棵 VNode 树：把虚拟节点变成真实 DOM 的核心阶段，Vue 会递归遍历整棵 VNode 树：
  1. 遇到普通元素（type 是字符串，如 `div`）：执行 `mountElement` → 创建真实 DOM 元素 → 设置属性 → 递归处理子节点；
  2. 遇到文本：直接创建文本节点；
  3. 遇到组件 VNode（type 是组件对象）：
     - 为子组件创建新的 `ComponentInternalInstance`（父实例指向当前父组件）；
     - 执行子组件的 `setup` 函数（重复第二步）；
     - 为子组件注册渲染 effect（重复第三步）；
     - 执行子组件的 `renderComponentRoot` 生成子组件的 VNode 树（subTree）；
     - 递归执行 `patch(null, 子组件subTree)`，继续挂载子组件的真实 DOM；
  4. 最终，整棵 VNode 树会被转换成真实 DOM 树，挂载到页面上

- **触发 mounted 钩子**：真实 DOM 挂载完成后，Vue 会通过 `nextTick` 异步执行 `mounted` 钩子：
  1. 执行顺序：自底向上（最深层的子组件先执行，根组件最后执行）；
  2. 原因：保证执行 `mounted` 时，当前组件及其所有子组件的 DOM 都已挂载完成，你可以安全地操作 DOM；
  3. 执行方式：`nextTick(() => instance.mounted.forEach(hook => hook()))`，`nextTick` 确保 DOM 已完成渲染；

#### 虚拟DOM

虚拟DOM（VDOM）是用于描述 UI 结构和更新信息的轻量级数据结构，他不仅描述标签（div / p）属性（class / id）子节点，还包含：更新标记（PatchFlag），节点类型（组件 / 元素 / 文本），key（diff 关键），动态节点信息（Block Tree）；

- 频繁操作真实DOM，会引发频繁的重排和重绘，而虚拟DOM能够减少不必要的 DOM 操作；
- 提供跨平台能力（VNode 不依赖浏览器的DOM），可以进行SSR（服务端渲染），小程序渲染，移动端原生渲染（Weex、React Native），Canvas / WebGL 渲染；

```html
<div id="app">
  <p class="title">hello</p>
</div>

//对应虚拟DOM { type: 'div', props: { id: 'app' }, children: [ { type: 'p',
props: { class: 'title' }, children: 'hello' } ] }
```

#### Diff算法

用于比较新旧虚拟DOM树，计算最小 DOM 更新集的方法；

在数据变化后，组件重新执行 render 生成新 VNode 后，通过 `patch(oldVNode, newVNode)`进行Diff算法，根据 diff 算法算出的「差异补丁」，只修改需要更新的真实 DOM 节点，完成视图更新：

- **双端比较**（前后置比较）：双指针首尾比较，找出首尾开始不相同的元素，快速跳过两端不需要处理的节点；

```text
旧: a b c d e f
新: a b x y e f

//前置比较，得出前置同步范围
a == a  b == b
//后置同步
f == f  e == e
//只剩中间的乱序
旧: c d
新: x y
```

- **处理头尾的新旧节点**： 新增节点，直接挂载尾部节点；删除节点， 删除多余节点；

- **处理中间区域**：

  首先，对新列表的中间节点建立key → index 映射表，用于快速判断旧节点在新列表中的位置，然后遍历旧列表的中间区域：
  - 如果旧节点在新列表中不存在 → 直接删除
  - 如果存在 → 记录其在新列表中的位置

  接着构建一个新位置索引数组（表示旧节点在新列表中的位置顺序），并基于该数组计算最长递增子序列（LIS）：
  - 在 LIS 中的节点 → 相对顺序未变化，不需要移动
  - 不在 LIS 中的节点 → 需要移动

  最后，从后向前遍历新列表中间区域：
  - 新节点不存在于旧节点中 → 创建并插入
  - 存在但不在 LIS 中 → 移动位置
  - 在 LIS 中 → 复用并跳过

```text
新：e   c   d
旧：c   d   e

//新列表中间区域建的新表
newIndexMap = {
  e: 2,
  c: 3,
  d: 4
}

//旧节点顺序c d e 对应的新位置索引
newIndexSequence = [3, 4, 2] //最长递增子序列为 [3, 4]// 对应 c、d，这两个节点在新旧列表中相对顺序一致DOM 中不需要移动它们，2 e不在 LIS 中，需要移动位置
```

- **比较过程**：Diff 判断节点是否可复用，只看type和key是否一样：
  - 如果 type 或 key 不同 → 直接销毁旧节点，创建新节点
  - 如果相同 → 复用节点，并进一步更新其属性和子节点（而不是重新创建 DOM）

### 虚拟DOM API

#### h函数

h 函数本质是 `createVNode` 的封装，核心作用是创建虚拟 DOM 节点（渲染函数就是调用h函数来创建VNode的），这些 VNode 最终会由渲染器在 `patch()` 阶段转换为真实 DOM；

参数第一种写法：

- 第一个参数为vnode的类型；
- 第二个参数为vnode的属性对象（class，id，type等）；
- 第三个参数为子节点；返回一个虚拟dom；

参数第二种写法：

- 第一个参数为import的组件；
- 第二个参数为传入组件的props参数；

```vue
//第一种写法 const vnode = h( 'div', { class: 'content', onClick(event)
{//点击事件 console.log("点击"); }, }, 'Hello World' ); //第二种写法 import
message from "./components/message.vue"; const vnode = h (message,{ a:13 })
render(vnode,document.body); //message组件
<template>
  <div>
    <p>接收的props值: {{ a }}</p>
  </div>
</template>

<script setup>
// 正确定义props
const props = defineProps({
  a: {
    type: Number,
    default: 0,
  },
});
</script>
```

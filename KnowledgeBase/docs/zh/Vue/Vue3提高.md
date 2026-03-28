# Vue3提高

### 路由

在终端中安装：`npm i vue-router`

Vue Router 本质是一个基于状态驱动的前端路由系统，它通过抽象 History 层统一管理 URL 变化，并利用 matcher 将路径解析为路由记录，再通过响应式的 currentRoute（当前路由对象） 驱动 router-view 渲染组件；同时通过导航守卫构建了一套可中断的异步流程控制机制，从而实现前端无刷新路由切换；

```text
History 层（监听 URL 变化）
        ↓
Matcher 层（路径匹配）
        ↓
Route 状态层（currentRoute）
        ↓
View 层（router-view 渲染）
```

- 普通组件（包括动态组件）的路由切换会销毁旧组件和创建新组件，如果使用`keep-alive` 包裹`<router-view></router-view>`缓存组件，则会被销毁旧组件；
- 如果路由路径相同，但 params 或 query 改变，Vue Router 默认复用组件实例，不会销毁组件（可以通过`<router-view :key="$route.fullPath"></router-view>`强制销毁）
- 路由元信息：为路由配置提供的自定义扩展字段，可以在路由守卫、组件、导航钩子中读取和使用；

#### 基本用法

在src下新建一个router文件里面新建index.ts文件，用于创建路由对象插件，并且导出给main.ts注册；

- 可以将routes数组内的每个对象按照功能拆分成不同的对象，放到不同的模块中；
- 可以使用动态模块导入指定component的组件，实现代码分割；
- 每个路由对象的name都要不同，否则会冲突；

```js
//引入创建路由器的库
import { createRouter,createWebHistory } from 'vue-router'

//创建并默认暴露路由器
export default createRouter({
    history:createWebHistory(),
    routes: [
        {//重定向
            path:'/',
            redirect:'/home',
        },
        {
            name:'zhuye',
            path: '/home',
            component:()=>import('../pages/Home.vue'),
            meta: {
              title: '首页', // 页面标题
              requiresAuth: false, // 是否需要登录
              keepAlive: true, // 是否缓存组件
              role: ['guest', 'user', 'admin'] // 可访问的角色
            }
            children: [//嵌套子路由
                {
                    path: 'detail',
                    component:()=>import('@/pages/Home_detail.vue'),
                },
                {
                    path: 'search',
                    component:()=>import('@/pages/Home_search.vue'),
                }
            ]
        },
        {
            name:'guanyu'
            path: '/about',
            component:()=>import("../pages/About.vue")
        },
    ]
})
```

在main.ts中注册路由器插件：

```vue
import { createApp } from 'vue'
import App from './App.vue'
//引入路由器插件
import router from './router'

const app = createApp(App);
//注册路由器插件
app.use(router);

app.mount('#app');
```

在App组件中展示路由效果：

```vue
<template>
  <div>
    <RouterLink to="/home">首页</RouterLink>
    <RouterLink to="/about">关于</RouterLink>
  </div>
  <div>
    <RouterView></RouterView>
  </div>
</template>

<script setup name="App">
  import { RouterView,RouterLink } from 'vue-router'
</script>
```

#### 路由工作模式

**history模式：**

基于浏览器的 History API（pushState / replaceState） + popstate 事件，当通过路由进行跳转时，Vue Router 会调用 History API 修改 URL，这个过程浏览器不会刷新页面，也不会自动触发事件，之后Vue Router 会解析当前路径，进行路由匹配，并更新内部的当前路由状态，从而驱动视图更新（即 `<router-view>` 重新渲染）

- `http://example.com/user?id=1`
- History 模式下的 URL会被浏览器当作真实资源地址处理，因此当用户刷新页面或直接访问某个路径时，浏览器会向服务器发送对应路径的请求，此时如果服务器没有相应的资源就会返回 404
- 当你在 Vue 应用中进行路由跳转（如点击 `<router-link>` 或调用 `router.push`）时，本质是修改 URL（pushState），更新组件（`<router-view>` 渲染），不会触发后端请求；

**hash模式：**

底层原理：基于浏览器的：`window.location.hash` + `hashchange` 事件，当修改URL时，浏览器不会刷新页面，而是触发hashchange事件，Vue Router监听该事件，解析 hash ，匹配路由，渲染对应组件（`<router-view>` 重新渲染）

- URL带有#，`http://example.com/#/user?id=1`，`#` 后面的部分叫片段标识符，浏览器不会把 `#` 后内容发送到服务器；
- 兼容性好
- 并且不利于SEO优化搜索（`#` 后面的内容不会参与服务器请求，搜索引擎无法可靠获取对应页面内容）

```js
//引入创建路由器方法，history模式方法，hash模式方法
import { createRouter,createWebHistory,createWebHashHistory} from 'vue-router'


export default createRouter({
    history:createWebHistory(),//使用history模式
    routes: [
        {
            name:'zhuye',
            path: '/home',
            component:()=>import('../pages/Home.vue');
        },
        {
            name:'guanyu'
            path: '/about',
            component:()=>import("../pages/About.vue");
        },
    ]
})
```

#### 路由传参

三种路由参数本质都是URL 派生数据，只能通过 router 改变 URL 来更新，不能直接修改；

##### query传参

- ？作为路径分隔符，&作为变量之间分隔符，如`/user?id=123&name=luo`


- 传递参数都会被转化成字符串；数组[1, 2, 3]会被拆分成?id=1&id=2&id=3再解析合并['1', '2', '3']；null / undefined会变成空字符串；对于对象类型要先JSON序列化再传递，否则会传递[object Object]（URL仅支持平铺结构）；
- 长度浏览器限制（约 2KB~8KB）；

```js
//跳转传参
router.push({
  path: '/user', //可以使用路由name来代替path
  query: { id: 123, name: 'luo' }
})
//字符串拼接
router.push('/user?id=123&name=luo')


//获取参数
import { useRoute } from 'vue-router'
const route = useRoute()
console.log(route.query.id)
```

##### params传参

基于路由路径模板（如 `/user/:id`）的占位符填充与正则匹配机制：在跳转时把参数对象按规则填充进路径生成 URL，在解析时再通过路径匹配提取出对应参数，最终映射到响应式的 `route.params`（路径解析的结果），驱动组件更新；

- 不需要?&作为分隔符，可以直接传值并且使用/分隔，如/user/123，对应/user/:id（需要给路由路径占位符）；
- 参数都是字符串类型，不支持对象；
- 使用对象传递params时，要使用路由name + params写法，path + params写法，params会被忽略；
- 可选参数（`path: '/user/:id?'`），剩余参数（`path: '/files/:pathMatch(.*)*'`）；
- 在history模式在，当刷新页面时，刷新页面会请求后端服务器，后端没有处理路径，直接跳转到index，会造成参数丢失；

```vue
//APP组件中
<template>
  <div>
    <RouterLink :to="`/home/aaa/bbb`">首页</RouterLink>
    //对象写法
    <RouterLink :to="{name:'zhuye',params:{a='aaa',b='bbb'}}">首页</RouterLink>
  </div>
  <div>
    <RouterView></RouterView>
  </div>
</template>

//router/index.ts文件中：
export default createRouter({
    history:createWebHashHistory(),
    routes: [
        {
            name:'zhuye',
            path: '/home/:a/:b?',//设置占位符
            component: Home,
        },
    ]
})

//Home路由组件中：
<script setup name="Home">
import { useRoute } from 'vue-router'
const route = useRoute();//通过route.params访问参数
</script>
```

##### props配置

用于把路由参数（params / query）从路由对象依赖转为组件的props；

- 布尔模式：当props设置为trues，传递给该路由的params 参数（不包含query）会被设置为defineProps([])的接收值；
- 对象模式：相当于静态传参；
- 函数模式：return的值作为该路由defineProps([])接收的值，回调函数的参数是该路由实例对象；

```js
//在route/index.ts文件中：
export default createRouter({
    history:createWebHashHistory(),
    routes: [
        {
            name:'zhuye',
            path: '/home/:a/:b',
            component: Home,
            //布尔写法
            props:true,
            //函数写法
            props(route){
                return{
                   route.query;
                   route.params;
                }
            }
        },
    ]
})
```

#### router实例对象

`createRouter` 返回的实例对象，包含：

- 导航（push/replace/back/go）

- 路由表操作（addRoute/removeRoute）

- 全局守卫（beforeEach/afterEach）

- 当前路由信息访问（currentRoute）

```vue
<template>
    <button @click='toHome'>home</button>
    <RouterView></RouterView>
</template>

<script setup name="App">
  import { RouterView,useRouter } from 'vue-router'
  
  const router = useRouter();
  function toHome(){
      //跳转路由并传递参数
      router.push({
          path:"/home",
          query:{
              name:"aaa",
              age:12,
          }
      });
  }
</script>
```

#### route实例对象

当前路由对象，用于专门描述当前匹配路由的信息；

是一个reactive对象，可以用 `watch` 或 `computed` 监听它的属性变化；

| 属性             | 说明                                                 |
| ---------------- | ---------------------------------------------------- |
| `path`           | 当前完整路径（不含 hash/query）                      |
| `fullPath`       | 包含 query/hash 的完整路径 `/user/123?foo=bar#hash`  |
| `hash`           | URL 中的 hash 部分，例如 `#section1`                 |
| `query`          | URL 查询参数对象，例如 `{ foo: 'bar' }`              |
| `params`         | 动态路由参数对象，例如 `/user/:id` → `{ id: '123' }` |
| `name`           | 当前路由名称，使用 `name` 定义路由时可用             |
| `meta`           | 路由元信息对象                                       |
| `matched`        | 当前路由匹配的路由记录数组，用于嵌套路由             |
| `redirectedFrom` | 如果路由被重定向，保存原始路径                       |
| `fullPath`       | 完整路径，包括 query 和 hash                         |

```js
<script setup name="home">
import {useRoute} from "vue-router"

const route = useRoute()
</script>
```

#### 路由守卫

本质是路由导航过程中的钩子函数，能让你在路由跳转的不同阶段插入自定义逻辑（比如权限校验、页面埋点、未保存提示等），通过路由守卫后，会更新 URL、渲染目标组件，触发 `afterEach`（后置守卫）；

- 若钩子返回 `true`/`undefined`：继续执行下一个守卫，直到完成导航
- 若钩子返回 `false`：中断当前导航，停留在原页面
- 若钩子返回路由地址（如 `'/login'`）：中断当前导航，重定向到该地址
- 若钩子抛出错误 / 返回 Promise 被 reject：导航失败，触发 `router.onError()`

##### 全局路由守卫

在整个路由器范围内拦截和处理路由的导航；

- 前置路由守卫beforeEach：在路由发送跳转前调用，第一个参数to为新路由实例对象，第二个参数from为旧路由实例对象，第三个参数为next方法，调用next方法才能进行跳转（推荐返回值替代）；


- 后置路由守卫afterEach：在路由发生跳转后调用，第一个参数to为新路由实例对象，第二个参数from为旧路由实例对象，可以用来把不同路由网页的title改变；


```js
import { createRouter, createWebHistory } from "vue-router";

import About from '../pages/About.vue'
import Home from '../pages/Home.vue'

const router =  createRouter({
    history: createWebHistory(),
    routes: [
        {
            name:'shouye',
            path: '/home',
            component: Home,
        },
        {
            name: 'guanyu',
            path: '/about/:aboutdata',
            component:About,
        }
    ]
})
router.beforeEach((to, from, next) => {
    console.log(to, from);
    //next方法的三种写法
    next();//继续导航
    next(false);//终止导航
    next("/login");//重定向路由
})

router.afterEach((to, from) => {
document.title='to.meta.title' || '原来的title名'
})
export default router;
```

##### 独享路由守卫

作用于单个路由，定义在路由配置的 `beforeEnter` 字段中，优先级高于全局前置守卫（但仍在 `beforeEach` 之后执行）

beforeEnter方法：第一个参数为该路由实例对象，第二个参数为旧路由实例对象，第三个为next方法；

```js
import { createRouter, createWebHistory } from "vue-router";

import About from '../pages/About.vue'
import Home from '../pages/Home.vue'
const router =  createRouter({
    history: createWebHistory(),
    routes: [
        {
            name:'shouye',
            path: '/home',
            component: Home,
        },
        {
            name: 'guanyu',
            path: '/about/:aboutdata',
            component: About,
            beforeEnter(to, from, next) {
                console.log(to, from);
                next();
            }
        }
    ]
})

export default router;
```

##### 组件内路由守卫

组合式API组件的路由只有onBeforeRouteLeave和onBeforeRouteUpdate，没有onBeforeRouteEnter，因为这个钩子时在组件实例对象被创建之前调用的，所以不能在组件内调用；

- onBeforeRouteUpdate：在当前路由路径改变，但是该组件复用时调用；
- onBeforeRouteLeave：离开该路由时调用，第一个参数to为新路由；第二个参数from为当前路由，第三个参数为next方法

```js
<script setup lang="ts" name="About">
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
onBeforeRouteLeave((to, from) => {
    console.log(to, from);
    next();
})
onBeforeRouteUpdate((to, from) => {
    console.log(to, from);
    next();
})
</script>
```

#### 路由设计

##### 路由参数加密

设计路由参数加密架构的核心目标是：对 URL 中暴露的敏感参数（query/params）进行加密 + 防篡改，同时保证架构对业务代码抵抗侵入、密钥安全、异常兜底；

使用 crypto-js库进行加密；

- 最小加密原则：只加密敏感参数（如用户 ID、订单号、token），非敏感参数无需加密，减少性能开销和 URL 长度压力；
- 容错性：解密失败时有明确的兜底逻辑（如重定向、日志上报）；
- 加密算法：AES-256-CBC（对称加密，性能消耗低）；
- 签名算法：HMAC-SHA256（验证参数是否被篡改，比单纯加密更安全，即使密文被破解，篡改后签名也会失效）；
- 使用Base64URL进行编码；
- 密钥管理：加密密钥（secretKey），`iv`（AES-CBC 的初始向量）和 签名密钥（signKey）分离，并且从后端动态获取，存储到pinia中，每次刷新从后端获取；

流程：

- 调用后端接口，获取 `secretKey`（AES 加密密钥）、`signKey`（HMAC 签名密钥）、`iv`（AES-CBC 的初始向量）；
- 封装 `router.push/replace`方法，筛选出需要加密的敏感参数（比如配置白名单：`['userId', 'orderId', 'token']`）；
- 对敏感参数进行 AES-256-CBC 加密，对加密后的密文生成 HMAC 签名，将「密文 + 签名」拼接（比如用`|`分隔），再做 Base64URL 编码，替换原参数为加密后的字符串，执行真实的路由跳转；
- 解密流程：在`beforeEach`守卫中拦截路由，提取 URL 中的加密参数，先 Base64URL 解码，拆分「密文 + 签名」，用`signKey`重新生成签名，与提取的签名对比（验签），验签通过后，用`secretKey`和`iv`对密文进行 AES 解密，将解密后的原始参数挂载到`route.meta.rawParams`（或替换`route.query/params`）；
- 异常处理：验签失败（说明参数被篡改，重定向到 403 / 错误页），解密失败（可能是密钥过期 / 参数损坏，重定向到登录页）

封装：

- 密钥管理（Pinia）
- 加密 / 解密工具函数
- 封装路由跳转方法
- 路由守卫解密

##### 路由权限设计

直接访问不带参数会有问题；

### Pinia

用于在多个组件之间共享和管理数据（全局状态）

安装：`npm i pinia`

Pinia 通过 `createPinia` 创建一个全局容器，用 `Map` 存储所有 store 实例，并保证每个 store 是单例，每个 store 内部基于 Vue3 的响应式系统实现：

- state 使用 `reactive`
- getters 使用 `computed`

当组件访问 store 时，会触发依赖收集；当 state 发生变化时，Vue 的响应式系统会通知所有依赖该 state 的组件重新渲染，从而实现一个地方修改，全局同步更新；

```vue
createPinia()
   ↓
defineStore() 
   ↓
useStore()（创建/获取单例）
   ↓
state → reactive
getter → computed
   ↓
组件使用 store
   ↓
依赖收集（effect）
   ↓
修改 state
   ↓
触发更新（响应式系统）
   ↓
所有组件同步更新
```



#### 基本用法

**创建 Store仓库**

defineStore的参数和返回值：

- 第一个参数是唯一标识符id（必需）；
- 第二个参数可接受两类值：Setup 函数或 Option 对象
- 返回一个函数，通过调用这个函数获得store实例；

```js
// stores/counter.js
//option对象写法
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  getters: {
    double: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++
    }
  }
})

//setup函数写法
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  const double = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, double, increment }
})
```

**在main.ts中注册**

```vue
import { createApp } from 'vue'
import App from './App.vue'

//引入创建pinia实例对象的方法
import { createPinia } from 'pinia'

//创建pinia实例对象
const pinia = createPinia();

const app = createApp(App)

//使用pinia实例对象
app.use(pinia);

app.mount('#app')
```

**在组件中使用**

```js
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()

store.count++           // 修改 state
store.increment()       // 调用方法
console.log(store.double) // 使用 getter
```

#### 修改全局状态

可以直接改状态：Pinia 内部把 store包装成一个reactive对象，当直接执行修改操作时，会触发 Proxy 的 `set` 拦截，通知所有使用该数据的组件进行更新；

##### $patch批量修改

`$patch` 用于批量修改 state；

- 对象形式是浅合并：`Object.assign(store.$state, payload)`，会覆盖原来的state；
- 函数形式是直接修改state；

```js
//对象方式
store.$patch({
  count: 100,
  name: 'Tom'
})

//函数方式
store.$patch((state) => {
  state.count++
  state.list.push(1)
})
```

##### 通过 actions 修改

actions是用来在集中状态中封装业务逻辑和修改状态函数的一个对象；内部可以通过this来访问store实例；

actions是一个对象，内部写各个业务函数，在组件中这些函数可以通过实例调用；

```text
actions: {
  increment() {
    this.count++
  },
  setCount(val) {
    this.count = val
  }
}
```

在Sum组件中：

```vue
<template>
    <h1>{{ sumStore.x }}</h1>
    <button @click="xAdd">xAdd</button>
</template>

<script setup lang="ts" name="Sum">
import { useSumStore } from '../store/Sum'

const sumStore = useSumStore();
function xAdd() {
//使用addAll方法
    sumStore.addAll(1);
}
</script>
```

#### getters计算属性

getter 本质上是store 的计算属性（computed），用于基于 state 派生出新的数据（一个值，而非函数），并具备缓存能力；

- getter 必须是纯函数，不能修改state；
- getter 的值不能在组件中修改

getter 的两种写法：

- 箭头函数：`fullName: (state) => state.firstName + state.lastName`，通过函数参数访问 `state`；

- 普通函数：参数为state，this指向当前 store 实例；

  ```text
  fullInfo() {
    return this.fullName + ' - ' + this.age//访问getter的fullName
  }
  ```

```js
//定义getter
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    firstName: 'Luo',
    lastName: 'Nai',
    age: 20
  }),
  getters: {
    fullName: (state) => {
      return state.firstName + ' ' + state.lastName
    },
    isAdult(state) {
      return state.age >= 18
    }
  }
})

//使用getter
const userStore = useUserStore()

console.log(userStore.fullName) // Luo Nai
console.log(userStore.isAdult)  // true
```



#### storeToRefs解构赋值

直接解构store实例会导致响应式丢失，而使用toRefs又会把actions解构；而storeToRefs只将state / getters 里的数据变为ref响应式数据，不会像toRefs一样把action等内容都转化为ref；

修改解构后的ref会影响store的值；

```vue
<template>
    <h1>{{ x }}</h1>//直接用
    <button @click="xAdd">xAdd</button>
</template>

<script setup lang="ts" name="Sum">
import { useSumStore} from '../store/Sum'
import { storeToRefs } from 'pinia'

const sumStore = useSumStore();
let {x=10,y,z} = storeToRefs(sumStore);
</script>
```

#### store实例

store 实例本质是一个reactive的响应式对象，包含state，action，getter，内置API等；

```text
store = reactive({
  state,
  getters,
  actions
})

//对应
store = {
  // state
  count: 1,

  // getters（computed）
  double: 2,

  // actions（方法）
  increment() {},

  // 内部API
  $patch() {},
  $subscribe() {},
  $reset() {},
  $dispose() {}
}
```

##### $subscribe

 监听 state 变化

直接修改 state，`$patch()`都会触发$subscribe；

参数：

- 第一个参数：变化时执行的回调函数；
- 第二个参数：options 参数；

```js
store.$subscribe((mutation, state) => {
  console.log(mutation)
  console.log(state)
})

//mutation的值
{
  storeId: 'user',
  type: 'direct' | 'patch object' | 'patch function',
  events?: []
}

//state是当前 store 的最新快照
```

##### $reset()

通过重新执行 `state()` （返回初始状态对象）生成一份新的初始数据，然后通过 `$patch` 合并到当前 `$state` 上，实现把 state 恢复到store 第一次创建时的初始状态；

- 不能复用store模块的全局引用，否则不能重置；
- 由于Setup Store有 `state()`，$reset()只能用于Option Store；

```text
store.$reset()
```

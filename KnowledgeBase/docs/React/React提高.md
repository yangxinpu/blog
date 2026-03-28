#  React提高

### 创建React项目

#### cli（不推荐）

React传统的脚手架为create-react-app（CRA），底层通过 react-scripts封装了 Webpack 配置，通过Webpack 负责处理 JSX 转译、ES6+ 语法降级（通过 Babel）、CSS 解析、图片等静态资源处理、代码分割、压缩优化等；

**全局安装cli**：`npm install -g create-react-app` （全局安装可能会导致版本落后的问题）

**使用cli创建React项目**：不支持pnpm；

```
yarn create react-app 项目名称

create react-app 项目名称
```

#### vite

通过vite框架来创建React项目；项目模板会自动携带eslint；

```
yarn create vite 项目名称
npm create vite@latest 项目名称
pnpm create vite@latest 项目名称
```

### 路由

安装：`npm install react-router-dom`

#### 路由组件

**BrowserRouter**：基于 HTML5 的 `History API`（`pushState`、`replaceState`）实现路由；通常用于包裹App组件；

**HashRouter**：基于 URL 中的哈希（`#` 后面的部分）实现路由；通常用于包裹APP组件；

```
//main.js中
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'//引入
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

**Link**：生成路由链接，点击后跳转到指定路径，属性：to设置可以是目标路径，可以是路径对象，replace是否启动replace模式；

**NavLink**：它会在当前 URL 与自身 `to` 属性匹配时，自动添加激活状态的样式或类名，className和style属性可以写成回调形式，接收一个包含isActive属性的对象作为参数，判断是否被激活；

**Routes**：路由容器，用于包裹多个 `Route` 组件，只渲染匹配当前 URL 的第一个Route；

**Route**：定义单条路由规则，属性：path（URL 路径）， element（匹配时渲染的组件），end（是否开启严格匹配，即不匹配任何子路径），caseSensitive（匹配时是否区分大小写，默认false），index（是否标记为默认子路由）

```
//在app组件中
import Home from "./components/Home/Home.jsx"
import About from "./components/About/About.jsx"
import {Route, Routes, Link,NavLink } from "react-router-dom"
import './App.css'

function App() {
  return (
    <>
        <Link to="/home/aaa/12">Home</Link>
        <Link to="/about">About</Link>
      <NavLink to="/home" className={({isActive}) => isActive ? "active" : ""}>Home</NavLink>
      <NavLink to="/about" className={({isActive}) => isActive ? "active" : ""}>About</NavLink>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>        
    </>
  )
}

export default App
```

**Navigate**：用于重定向；属性为to重定向路径，replace是否开启replace模式；

```
  <Routes>
    <Route path="/home" element={<Home />} end/>
    <Route path="/about" element={<About />} />
    <Route path="/" element={<Navigate to="/home" replace/>} />
  </Routes>
```

**Outlet**：渲染子路由组件的位置；Route嵌套子路由时path是相对路径，不需要/开头，可以使用index标记表示默认渲染子路由；

```
//app组件中
import Home from "./components/Home/Home.jsx"
import About from "./components/About/About.jsx"
import News from "./components/Home/pages/news.jsx"
import Mes from "./components/Home/pages/mes.jsx"
import { Route, Routes, Link, NavLink, Navigate } from "react-router-dom"

import './App.css'

function App() {
  return (
    <>
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
      <Routes>
      //嵌套子路由
        <Route path="/home" element={<Home />}>
          <Route path="news" element={<News />} />
          <Route path="mes" element={<Mes />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Navigate to="/home" replace/>} />
      </Routes>
    </>
  )
}
export default App

//父路由中
import { Link, Outlet } from "react-router-dom"
const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            <Link to="/home/news">news</Link>
            <Link to="/home/mes">mes</Link>
            <Outlet/>
        </div>
    );
}
export default Home
```

#### 路由钩子

##### **useRotes**

用于批量注册路由，不用再设置Router和Route；

```
import Home from "./components/Home/Home"
import About from "./components/About/About"
import { useRoutes, Link } from "react-router-dom"

function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Home />,
      children: [
        {
          index: true,
          path: "/mes",
          element: <div>mes</div>,
        },
        {
          path: "/news",
          element: <div>news</div>,
        },
      ],
    },
    {
      path: "/about",
      element: <About />,
    },
  ])
  return (
    <>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      {routes}
    </>
  )
}

export default App

```

##### **useLocation**

用于获取当前路由位置信息，包含路径（pathname，如/home）、查询参数、状态等信息；

```
import {useLocation} from "react-router-dom"
const Home = () => {
    const location = useLocation();//获得路由位置信息
    console.log(location);
    return (
        <div>
            <h1>Home</h1>
        </div>
    );
}
export default Home
```

##### **useNavigate**

用于通过编程式触发路由跳转;

第一个参数可以为字符串表示跳转到对应路由路径，可以为数字表示跳转步数，可以为详细的路径对象（pathname路径，search查询参数，hash哈希值）；

第二个参数为配置对象，包含是否是replace跳转，state传递状态数据；

```
import {useNavigate} from "react-router-dom"

const Home = () => {
    const navigate = useNavigate()
    return (
        <div>
            <h1>Home</h1>
            <button onClick={() => navigate(
                { pathname: '/about', search: '?id=123' },
                { replace: true, state: { from: 'home' } })}>跳转</button>
        </div>
    );
}

export default Home
```

##### **useMatch**

用于检查当前 URL 是否匹配指定的路径模式；

接收一个字符串作为匹配参数，如静态路径（"/home"`、`"/about"），携带参数（"/user/:id"），通配符（`"/admin/*"`，匹配 `/admin` 下的所有子路径）；

返回一个包含匹配详情的对象（包括params，pathname，pathnameBase），不匹配时返回 `null`；

```
import {useLocation, useNavigate,useParams,useMatch} from "react-router-dom"

const Home = () => {
    const match = useMatch("/home");
    console.log(match)
    return (
        <div>
            <h1>Home</h1>
        </div>
    );
}

export default Home
```

##### useNavigationType

用于判断该路由页面是以什么方式跳转到的，有效值：POP（刷新页面），REPLACE，PUSH

```
import { useNavigationType } from "react-router-dom";

const Home = () => {
    console.log(useNavigationType());
    return (
        <>
            <h1>Home</h1>
        </>
    );
}

export default Home
```



#### 路由传参

##### **params参数**：

在Link的to的路径中传递参数，在Route组件中写占位符；在目标路由中使用useParams Hook获得参数对象；

```
//在app组件中
import Home from "./components/Home/Home.jsx"
import About from "./components/About/About.jsx"
import {Route, Routes, Link } from "react-router-dom"

function App() {
  return (
    <>
        <Link to="/home/aaa/12">Home</Link>//传递参数
        <Link to="/about">About</Link>
        <Routes>
          <Route path="/home/:name/:age" element={<Home />} />//配置参数
          <Route path="/about" element={<About />} />
        </Routes>        
    </>
  )
}
export default App

//home组件中
import {useParams} from "react-router-dom"

const Home = () => {
    const {name,age} = useParams();//接收传递的参数
    return (
        <div>
            <h1>Home</h1>
            <h2>{name}</h2>
            <h2>{age}</h2>
        </div>
    );
}
export default Home
```

##### **search参数**：

在Link的to的路径中传递变量和参数（如/product?page=1&size=10&sort=asc）；在目标路由中使用useSearchParams Hook获得参数对象；

useSearchParams：返回查询参数对象，含有get方法（根据键获得值），getAll方法（获得所有值的数组），has方法（判断是否存在指定key）

```
//在app组件中
import Home from "./components/Home/Home.jsx"
import About from "./components/About/About.jsx"
import { Route, Routes, Link } from "react-router-dom"

import './App.css'

function App() {
  return (
    <>
      <Link to={
          {
            pathname: "/home",
            search: "?a=1&b=2",
          }
        }>Home</Link>
        <Link to="/about">About</Link>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  )
}
export default App

//在home组件中
import { useSearchParams } from "react-router-dom"

const Home = () => {
    const [searchParams] = useSearchParams();
    console.log(searchParams);
    return (
        <div>
            <h1>Home</h1>
            <p>{searchParams.get("a")}</p>
            <p>{searchParams.get("b")}</p>
        </div>
    );
}

export default Home
```

##### **state参数**

数据不会显示在 URL 中，而是存储在浏览器的历史记录（`history`）中；

```
//app组件中
import Home from "./components/Home/Home.jsx"
import About from "./components/About/About.jsx"
import { Route, Routes, Link } from "react-router-dom"
function App() {
  return (
    <>
      <Link to="/home" state={{title:"home"}}>Home</Link>
        <Link to="/about">About</Link>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  )
}
export default App

//home组件中
import { useLocation } from "react-router-dom"

const Home = () => {
    const location = useLocation();
    console.log(location.state);
    return (
        <div>
            <h1>Home</h1>
        </div>
    );
}
export default Home
```

### Redux

一个用于集中式状态管理的库，它将整个应用的状态（state）被存储在一个单一的JS对象树中，这个对象树只存在于唯一的 Store中；想要改变状态，必须通过dispatch一个Action给Reducer来返回新状态；

安装：`npm install @reduxjs/toolkit react-redux`

**@reduxjs/toolkit（RTK）**：Redux 官方推出的工具集，提供configureStore，createSlice，createAsyncThunk，createSelector等方法简化 Redux 本身的使用；

**react-redux**：将 Redux 的 store 与 React 组件连接起来，让 React 组件能够访问 Redux 状态、发送 action 修改状态；

**Action**： 一个JS对象，用于描述Reducer的操作，如（`{type: 'todos/add',  payload: { id: 1, text: '学习 Action', completed: false }}`）

**Store**：连接 Action和 Reducer的枢纽，它负责存储应用的所有状态、接收 Action 并通过 Reducer 计算新状态，同时通知组件状态的变化；

**Reducer**： 一个纯函数，接收当前状态和 Action 作为输入，返回一个全新的状态对象

#### 基本用法

配置store：创建 `src/redux/store.js`，整合所有 reducer

```
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice'; 

export const store = configureStore({
  reducer: {
    counter: counterReducer // 注册 reducer，状态会被放在 state.counter 下
  }
});
```

创建切片：创建 `src/redux/slices/counterSlice.js`，使用Redux Toolkit 的 `createSlice` 可自动生成 Action 和 Reducer

```
import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  count: 0
};

// 创建切片
const counterSlice = createSlice({
  name: 'counter', // 切片名称
  initialState,
  reducers: {
    // 定义action
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    // 带参数的 action
    incrementByAmount: (state, action) => {
      state.count += action.payload;
    }
  }
});

// 导出自动生成的 action creators
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// 导出 reducer
export default counterSlice.reducer;
```

在根组件中注入store

```

import { Provider } from 'react-redux'; // 导入 Provider
import { store } from './redux/store'; // 导入 store
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
  </StrictMode>,
)
```

在组件中使用

```

import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, incrementByAmount } from '../redux/slices/counterSlice';
import { useEffect } from "react";

const Home = () => {
    const count = useSelector((state) => state.counter.count);
    console.log(count);
    const dispatch = useDispatch()
    return (
        <div>
            <h1>Home</h1>
            <h2>{count}</h2>
            <button onClick={() => dispatch(increment())}>+1</button>
            <button onClick={() => dispatch(decrement())}>-1</button>
            <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
        </div>
    );
}

export default Home
```

#### redux Toolkit

##### configureStore

configureStore在原生 Redux 的 `createStore` 基础上做了封装，用简化store的创建和配置过程；

参数接收一个对象，对象包含以下属性：

reducer：一个对象，用于配置reducer，键名会成为 state 中的属性（如 state.counter、state.user）；

middleware：自定义或扩展 store 使用的中间件，RTK内置了一些中间件（redux-thunk，immutableCheck等）；

返回一个store对象，包含原生store的核心方法；

```
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice'; 
import userReducer from './slices/userSlice'; 

const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer
  }
});
```

##### createSlice

 用于简化reducer 和action 的创建过程；在传统 Redux 中，定义一个功能模块需要手动完成多步操作：定义 action type 常量（如 `'todos/add'`、`'todos/toggle'`）；编写 action creator 函数（用于生成 action 对象）；编写 reducer 函数（通过 `switch` 语句匹配 action type，处理状态更新）；而 `createSlice` 可以自动整合这三个步骤；

参数：

name：定义切片名称，将作为该切片所有 action type 的前缀，用于区分不同切片的 action（若 `name: 'counter'`，且 reducers 中定义了 `increment` 方法，则生成的 action type 为 `counter/increment`）

initialState：定义该切片管理的初始值，可以是任意数据类型；

reducers：一个对象，定义同步状态处理逻辑，对象中的键是reducer函数名称（同时作为action type的后缀），值为reducer函数体；函数参数为state（当前slice的状态，由Immer包装的草稿状态，可直接修改），action（触发的action对象）；

返回一个对象，包含生成的reducers函数和所有自动生成的actions创建函数；

```
import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  count: 0
};

// 创建切片
const counterSlice = createSlice({
  name: 'counter', 
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    incrementByAmount: (state, action) => {
      state.count += action.payload;
    }
  }
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

##### **Immer** 

是一个专注于简化不可变数据处理的JS库，它的核心设计理念是以可变的方式编写代码，却能得到不可变的结果（已经被RTK内置）；

在Redux中调用reducer修改对象类型的state需要将旧的state和新的state进行合并，然后再return；

Immer使用核心函数produce简化了这一过程：第一个参数为原始数据，第二个参数为修改函数（接收draft原始数据的代理副本，在draft上的修改都会被记录），返回基于draft修改记录的新原始数据；

Immer 内部使用 ES6 的 `Proxy` 机制拦截对 `draft` 的所有操作（赋值、删除、数组方法等），并记录这些修改。当修改函数执行完成后，Immer 会根据记录的修改，基于原始数据生成新对象；

```
//传统方式
const newState = {
  ...oldState,
  user: {
    ...oldState.user,
    address: {
      ...oldState.user.address,
      city: '北京' // 只修改这一个字段
    }
  }
};

//使用immer
import { produce } from 'immer';

const newData = produce(baseData, draft => {
  draft.someProperty = '新值';
  draft.nestedObject.value = 123;
  draft.array.push('新元素');
});
```

##### redux-thunk

RTK已内置，用于解决 Redux 中异步操作的处理问题，它允许action creator返回一个函数；当 redux-thunk被加入store的中间件后，它会拦截所有被派发的 action，如果 action 是普通对象，中间件会让它继续传递到 reducer，如果 action 是函数，中间件会先执行这个函数，并将 dispatch 和 getState 作为参数传入；函数内部执行异步操作（如 API 请求），完成后通过 dispatch派发同步 action，这些 action 最终会到达 reducer 并触发状态更新；

```
//传统写法
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

// 将 thunk 作为中间件应用到 store
const store = createStore(rootReducer, applyMiddleware(thunk));
```

#####  Redux DevTools

RTK已内置，一套用于调试 Redux 应用的工具集，它能帮助开发者追踪状态变化、记录 action 历史、实现时间旅行调试；需要在浏览器安装插件 Redux DevTools；

传统写法要自己安装Redux DevTools包`npm install redux-devtools-extension --save-dev`；并在store中配置；

```
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
// 从 Redux DevTools 包中导入工具函数
import { composeWithDevTools } from 'redux-devtools-extension';

// 结合中间件和 DevTools
const store = createStore(
  rootReducer,
  // 使用 composeWithDevTools 替代默认的 compose
  composeWithDevTools(applyMiddleware(thunk))
);
```

#### react-redux

##### 组件

**Provider**：基于useContext的组件，用将 Redux的 store传递给应用中所有的子组件；原理：在应用的顶层创建一个 Redux 上下文，并将 Redux 的store 放入这个上下文，所有被 `Provider` 包裹的子组件，都可以通过 React-Redux 提供的工具（如 `useSelector`）从上下文中获取 `store`，无需手动通过 props 一层层传递；

```
import { Provider } from 'react-redux'; // 导入 Provider
import { store } from './redux/store'; // 导入 store
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
  </StrictMode>,
)
```

##### useSelector

用于从 store中提取状态数据；接收一个选择器函数，参数为整个应用的store，可以返回需要部分的数据，并订阅该部分状态的变化，当数据更新时自动触发组件重新渲染；

##### useDispatch

获取 store 的 `dispatch` 函数，用于在组件中派发 action；

```
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, incrementByAmount } from '../../redux/slices/counterSlice';

const Home = () => {
    const count = useSelector((state) => state.counter.count);
    const dispatch = useDispatch();
    return (
        <div>
            <h1>Home</h1>
            <h2>{count}</h2>
            <button onClick={() => dispatch(increment())}>+1</button>
            <button onClick={() => dispatch(decrement())}>-1</button>
            <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
        </div>
    );
}
export default Home
```

##### useStore

获取整个应用的 store 实例；

```
const store = useStore();
```

### Zustand

一个轻量级的 React 集中状态管理库，核心通过状态容器和订阅发布模式来实现集中状态管理；

通过 `create` 函数创建一个全局状态容器，容器内部维护一份不可变的状态，并定义修改状态的set方法，组件通过 `useStore` 钩子订阅状态，Zustand 会跟踪组件依赖的状态片段，并在其变化时触发组件重渲染；

安装：`pnpm i zustand`

#### 基本用法

create的参数为状态创建函数；状态创建函数的第一个参数为set方法（用于更新状态），第二个参数为get方法（用于获取当前状态），第三个参数为store（store 自身的引用）；状态创建函数返回一个对象包含状态数据属性和reducer方法；

```
//src/stores/useCountStore.js
import { create } from 'zustand'

const initialState = {
    count: 0,
}

const useCountStore = create((set, get, store) => {
    return {
        ...initialState,
        increment: () => set({ count: get().count + 1 }),
        decrement: () => set({ count: get().count - 1 }),
    }
})
export default useCountStore;
```

在组件中使用

```
import useStore from "../../stores";
const Home = () => {
    const { count, increment, decrement } = useCountStore();
    return (
        <>
            <h1>Home</h1>
            <h2>{count}</h2>
            <button onClick={increment}>+1</button>
            <button onClick={decrement}>-1</button>
        </>
    );
}
export default Home
```




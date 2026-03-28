# React基础

react包： React 核心库，定义了 UI 的抽象模型

- JSX → `React.createElement`（生成虚拟 DOM / React Element）
- 组件模型（函数组件 / 类组件）
- Hooks（`useState`、`useEffect` 等）

React渲染器： 将 React 描述的 UI（React Element / 虚拟 DOM）转化为具体平台视图的执行层实现，负责构建Fiber 树，新旧 Fiber 树 diff，执行响应更新操作；

- Web → `react-dom`
- Native → `react-native`
- SSR → `react-dom/server`

createRoot方法：接收一个 DOM作为参数，创建的是一个Fiber Root（根 Fiber 节点）

render方法：这是由 createRoot() 创建的根容器对象提供的方法，接收一个React组件的虚拟DOM作为参数，向 Fiber Root 提交一个更新（update），触发调度和渲染流程；

```
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <App />
  </StrictMode>
)
```

### jsx语法

用类似 HTML 的写法，描述 UI 结构，最终会被编译成 JavaScript；（如`const element = <h1>Hello</h1>`会被编译成`const element = React.createElement('h1', null, 'Hello')`）

-  必须有一个根节点，可以用Fragment（不生成额外 DOM）；
- 标签名以小写字母开头 → 视为原生 DOM 标签，标签名以大写字母开头 → 视为 React 组件（变量引用）；

#### 插值语法

使用{ }，{ }内可以写任何js表达式（函数调用，三元运算符，变量等，但是不能放语句）；

- 遍历标签时，每个标签都要有唯一的key；
-  false / null 不会渲染；

```
  <div>
    {
      ["Vue", "React", "Angular"].map((item) => {
        return <div key={item}>{item}</div>
      })
    }
  </div>
```

#### 样式相关

- 样式的类名要使用className；


- 内联样式style必须是一个对象；


```
<div style={{ color: "#2c3e50", fontWeight: "bold" }} className="profile-info"></div>
```

### 样式相关

#### CSS Modules + SCSS

SCSS 负责增强 CSS 编写能力，CSS Modules 负责作用域隔离（类名hash，生成对应hash的JS类名映射对象），最终由构建工具把它们编译成浏览器可执行的普通 CSS + 映射对象

安装：`npm install sass --save-dev`

通过import方式引入：全局生效；

```
import "./style.scss"
const Home = () => {
    return (
        <>
            <h1>Home</h1>
        </>
    );
}
export default Home
```

将CSS模块化，通过对象键来使用，样式文件名必须为.module.scss；

```
//Button.module.scss
.container {
  color: red;

  .title {
    font-size: 18px;
  }
}

//组件中
import styles from './Button.module.scss'

function Button() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>按钮</div>
    </div>
  )
}
```

#### styled-components

一个在 React 生态中的 CSS-in-JS 方案，它允许你在 JavaScript/TypeScript 中直接写 CSS，并将样式绑定到组件上；

- styled-components本质上是调用一个函数（标签函数），将模板字符串中的 CSS 代码作为参数传入，并为每个 style 组件生成唯一的哈希类名（如 `sc-bdVaJa`）；styled-components会在运行时，创建一个 `<style>` 标签（或复用已有的）插入到 `<head>` 中，将生成的类名与对应的 CSS 规则写入 `<style>` 标签；

安装：`npm install styled-components`；

##### 基本语法

- `styled-components` 支持在模板字符串中使用插值表达式 `${}`，插值可以是：JS变量，函数（接收 `props`，返回 CSS 值）

- `&` 表示当前组件生成的 class

- `styled(已有组件)` 用于扩展已有样式，类似 CSS 的继承 + 覆盖；

```
import styled from "styled-components";

const BaseButton = styled.button`
    font-size: 20px;
    padding: 10px;
    border-radius: 10px;
`

const PrimaryButton = styled(BaseButton)`
    border:1px solid ${props => props.color || 'black'};
    color:${props => props.color || 'black'};
    &:hover{
        background-color:${props => props.color || 'black'};
        color:white;
    }
`

const Home = () => {
    return (
        <>
            <h1>Home</h1>
            <PrimaryButton color="blue">Primary Button</PrimaryButton>
        </>
    );
}

export default Home
```

##### ThemeProvider

用于向整个组件树注入 theme 对象，使所有 styled 组件可以通过 props.theme 访问统一设计变量；

底层：React Context.Provider，props.theme 注入，styled 组件消费；

```
//顶层组件中
import Home from "./components/Home/Home"
import About from "./components/About/About"
import { ThemeProvider } from "styled-components"
const theme = {
  colors: {
    primary: "#0070f3",
    warn: "#ff0000",
    success: "#00ff00",
  },
  fontSize: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
  },
}
function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Home />
        <About />
      </ThemeProvider>
    </>
  )
}
export default App

//子组件中
import styled from "styled-components";
const PrimaryButton = styled.button`
    padding:10px;
    border:1px solid ${props => props.theme.colors.primary || 'black'};
    color:${props => props.theme.colors.primary || 'black'};
`

const Home = () => {
    return (
        <>
            <h1>Home</h1>
            <PrimaryButton color="blue">Primary Button</PrimaryButton>
        </>
    );
}
export default Home
```

##### createGlobalStyle

用于声明全局 CSS，并在组件挂载时自动注入到 `<style>` 标签中

```
//main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'

import { createGlobalStyle } from 'styled-components'

//style-components部分
const GlobalStyle = createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
`
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalStyle />
    <App />
  </StrictMode>,
)
```

##### attrs组件属性

用于在组件创建阶段统一定义默认属性或根据 props 派生新属性；

```
import styled from "styled-components";

const Input = styled.input.attrs((props) => ({
    type: 'text',
    placeholder: props.placeholder
}))`
    color: red;
    border: 1px solid red;
`
const Home = () => {
    return (
        <>
            <h1>Home</h1>
            <Input placeholder="请输入" />
        </>
    );
}
export default Home
```

##### keyframes

用于定义关键帧动画，语法和css一样；

```
import styled,{keyframes} from "styled-components";

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;
const Spinner = styled.div`
    border: 16px solid #f3f3f3;
    border-top: 16px solid #3498db;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: ${spin} 2s linear infinite;
`;

const Home = () => {
    return (
        <>
            <h1>Home</h1>
            <Spinner />
        </>
    );
}

export default Home
```

### 函数式组件

函数本身作为render函数，接收 props，返回值为渲染的组件；

Hook：用于在函数组件中引入状态管理、副作用处理与逻辑复用能力（自定义hook），本质是一套基于调用顺序的状态存储与副作用调度系统，并挂载和运行在对应的 Fiber 节点上；

- 函数组件本身执行后会销毁局部变量，无法在多次渲染间保持状态，而Hook链将状态移出函数作用域，存储到对应Fiber节点上；
- Hook链的头节点会被保存在当前组件 Fiber 的 `memoizedState` 上；并且每个 Hook 节点保存各自的状态信息，比如：当前状态值，更新队列，副作用依赖，下一个 Hook 节点指针；
- React 中 Hook 的状态复用依赖的是调用顺序，而不是变量名，React 在函数组件重新渲染时，会按照 Hook 的调用顺序，依次从旧的 Hook 链表中取出对应节点，并在此基础上构建新的 Hook 链表（每次更新都会创建新的Hook链），从而实现状态的复用（因此，Hooks 必须在组件顶层按固定顺序调用，不能写在循环、条件或嵌套函数中，否则会导致顺序错乱）；

更新队列：所有setState和dispatch产生的更新不会立即修改状态，而是创建一个更新对象，放进对应 Hook节点 的更新队列里，由React在后续的调度中统一处理这些更新；

#### props

props 是父组件传递给子组件的数据，以对象形式传给子组件函数的参数；

- 子组件接收参数时可以使用解构赋值并设置默认值；
- props 是一个只读对象，不能被修改；
- 父组件可以通过传递函数引用的方式实现子传父；

```
function App() {
  return <User name="Alice" age={25} />;
}

function User(props) {
  return (
    <div>
      <h1>{props.name}</h1>
      <p>{props.age}</p>
    </div>
  );
}
```

####  useState

用于在函数组件中添加状态；参数可以为状态变量初始值，也可以为初始化函数；返回状态变量和状态更新函数组成的数组；

- 初始化函数：首次渲染时才会调用这个函数，得到初始值，后续组件重新渲染时不会再执行，但函数本身会随着组件执行而重新创建；
- 初始化函数必须是纯函数，不能有副作用，避免写成外部函数，不能依赖外部状态；
- 状态更新函数：用于向 React 提交状态变更请求，从而触发组件重新渲染；它既可以接收一个新值，也可以接收一个以旧状态为参数的回调函数；调用状态更新函数时不会立即修改状态，而是由 React 在当前更新周期中对多次调用进行批量合并后再统一更新并渲染；因此，状态更新函数的调用是同步执行的，但状态本身的更新是延迟生效的，表现为类似异步的行为；

在 React中，多个 setState（包括嵌套调用）都会被放入对应 Hook 的更新队列中，并在同一个批处理上下文中统一执行，从而只触发一次渲染；

React 18 引入了自动批处理机制，使得不仅在事件处理函数中，在异步回调（如 setTimeout、Promise）中也会进行批处理，只有当更新跨越不同的任务边界（如 await 之后），才会产生多次渲染；

```
import { useState } from "react";

const Home = () => {
    const [count, setCount] = useState(0);
    const [count,setCount] = useState(()=>handleCount());
    const [count,setCount] = useState(handleCount());//每次组件渲染都会调用一次handleCount()
    return (
        <>
            <div onClick={() => setCount(count + 1)}>按钮{ count }</div>
        </>
    );
};
```

#### useEffect

用于在函数组件中处理带有副作用的操作；

副作用函数：函数执行过程中，除了返回 UI或计算值外，对外部环境产生的额外影响或依赖外部环境的操作，如操作 DOM ，数据请求，事件监听，修改localStorage/sessionStorage，打印日志（`console.log`）等；不应该在副作用函数中使用setState，否则可能循环渲染

```
render → commit → cleanup → effect
```

- 在组件挂载后（即组件渲染出 DOM 并完成浏览器绘制后）异步执行副作用函数；
- 当依赖变化时（依赖不变则不会执行副作用函数），组件会先重新渲染（计算出变化的地方）并提交更新；
- 然后在执行新的副作用函数之前先执行上一次的清理函数；
- 组件卸载时会执行所有 `useEffect` 的清理函数，但不会再执行副作用函数；

参数和返回值：

- 第一个参数为副作用函数；
- 第二个参数为依赖数组（为空数组时只会在初次渲染时调用一次，不写时参数时当组件触发重新渲染时都会重新调用）；
- 返回值为副作用清理函数；

useEffect的闭包问题：

副作用函数会捕获当前渲染周期中的变量值（形成闭包），当副作用中存在异步操作时，即使组件后续重新渲染、状态发生变化，异步回调中访问的仍然是之前渲染周期中的旧值，从而导致读取到过期状态的问题；

解决方式包括正确声明依赖数组以让 effect 重新执行（旧的异步会被清理）、使用 `useRef` 持有最新值，或使用 `useEffectEvent`来避免闭包带来的旧值问题

```
import React, { useState,useEffect } from "react";
import './home.css';
const Home = () => {
    const [count, setCount] = useState(0);
    //模拟挂载
    useEffect(() => {
        console.log("componentDidMount");
    }, [])

    //模拟更新
    useEffect(() => {
        console.log("componentDidUpdate");
    }, [count]);

    //模拟卸载
    useEffect(() => {
        return () => {
            console.log("componentWillUnmount");
        }
    }, [])
    
    return (
        <>
            <div onClick={() => setCount(count + 1)}>按钮{ count }</div>
        </>
    );
};
```

#### useEffectEvent

`useEffectEvent` 用于解决 `useEffect` 中由于闭包导致的旧状态问题，它可以让副作用中的回调在执行时始终访问到最新的状态和 props，同时不会因为这些值的变化而触发 `useEffect` 重新执行，从而避免将其加入依赖数组带来的重复执行问题；

`useEffectEvent` 的本质可以理解为 React 内部封装了一种类似 `useRef` 的机制：在组件每次渲染时，将最新的状态和 props 保存到内部的引用容器中，并返回一个引用稳定的回调函数；该回调函数在执行时会从这个容器中读取最新的值，从而既保证了回调引用不变，又避免了闭包捕获旧状态的问题；

```
import { useState, useEffect, useEffectEvent } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  const logCount = useEffectEvent(() => {//拿去最新的状态，并执行对应的操作
    console.log("count:", count);
  });
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      logCount();
    },3000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [logCount]);
  return (
    <>
      <div>App</div>
      <div>
        <button onClick={() => setCount(count + 1)}>
          click me
        </button>
        <div>count: {count}</div>
      </div>
    </>
  );
}
```

#### useLayoutEffect

`useLayoutEffect` 用于**同步**处理与布局相关的副作用，其用法与 `useEffect` 基本一致，但执行时机是在 DOM 更新完成后、浏览器绘制之前同步执行，

用于读取DOM信息和操作DOM，但也可能阻塞浏览器绘制，影响性能；

```
import { useRef, useState, useLayoutEffect} from 'react';

export default function App() {
  const ref = useRef(null);
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    const animationId = requestAnimationFrame(() => {
      ref.current.style.transform = `translateX(${count}px)`;
      setCount(count + 1);
    });
    return () => cancelAnimationFrame(animationId);
  }, [count]);

  return <div ref={ref}>居中盒子</div>;
}
```

#### useRef

本质是一个容器，内部通过 `current` 属性存储数据，用于：

- 跨渲染保存数据：创建的引用对象在组件整个生命周期中保持不变，且修改其值不会触发组件重渲染；
- 获取DOM元素：操作DOM会直接触发渲染；

跨渲染保存数据作用：

- 保存定时器 ID（用于清理定时器），
- 解决 useEffect 闭包问题（获取最新状态），
- 存储WebSocket、图表实例（ECharts/AntV）、地图实例创建后需要跨渲染复用的数据，不能每次渲染都新建；

```
//操作dom
const Home = () => {
    const div = useRef(null);
    return (
        <>
            <div ref={div}>按钮</div>
        </>
    );
};

//跨渲染保存数据
import { useRef, useEffect, useState } from 'react';
function ClosureFix() {
  const [count, setCount] = useState(0);
  // 用 ref 存储最新 count（每次渲染同步更新）
  const countRef = useRef(count);

  // 每次 count 变化时，同步到 ref.current
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    // 异步任务：1秒后打印最新 count
    setTimeout(() => {
      console.log('最新 count：', countRef.current); // 访问 ref，拿到最新值
    }, 1000);
  }, []); 

  return <button onClick={() => setCount(prev => prev + 1)}>count+1</button>;
}
```

#### useContext

用于跨组件共享状态，能让组件直接访问并修改全局或跨层级的共享状态，使用流程：

- 先使用createContext创建Context；
- 再在父组件中提供Context数据；
- 最后在子组件中使用useContext消费Context；

useContext依赖 createContext 创建的Context带标识的状态容器对象，内部包含三个关键部分：

- Provider组件：用于注入共享数据到组件树，会把当前 `value` 写入 Context 的当前值（_currentValue）并压入上下文栈，从而让其子树在渲染时能够读取到这个值；
- Consumer 消费组件：`useContext` 在渲染时会直接读取当前 Context 的当前值（由最近的 Provider 在渲染过程中设置）；
- _currentValue属性：挂在 Context 对象上的内部字段，用于存储当前渲染环境下该 Context 的值；

原理：

- 当子组件调用 `useContext(Context)` 时，React 会在当前组件的渲染过程中，从 Context 栈中读取来自最近的上层 `Provider`的 Context 当前值；

-  同时，React 会在当前消费者对应的 Fiber 上记录它对该 Context 的依赖。

-  当某个 `Provider` 的 `value` 发生变化时，React 会从这个 Provider 的子树开始传播更新，找到依赖该 Context 的消费者 Fiber，并调度这些组件重新渲染；

  ```
  <A.Provider value={1}>
    <B.Provider value={2}>
      <Child />
    </B.Provider>
  </A.Provider>
  
  进入 A → 设置 value = 1
    进入 B → 设置 value = 2
      渲染 Child（读到 2）
    离开 B → 恢复 value = 1
  离开 A → 恢复默认值
  ```

注意点：

- 当value是对象时，在每次父组件渲染都会生成新的引用，导致所有消费子组件重新渲染，可以使用 useMemo缓存 value，仅当依赖变化时才更新引用；

```
//src/context/ThemeContext.js中
import { createContext } from 'react';
const ThemeContext = createContext('light');
export default ThemeContext;

//父组件中
import { useState } from 'react';
import ThemeContext from './contexts/ThemeContext';
import Home from './components/home';
const App = () => {
  const [theme, setTheme] = useState("light");
  return (
    <div className="App">
      <ThemeContext.Provider value={{theme, setTheme}}>
        <Home />
      </ThemeContext.Provider>
    </div>
  );
};
export default App;

//子组件中
import { useContext } from "react";
import ThemeContext from "../contexts/ThemeContext";
import './home.css';
const Home = () => {
    const {theme, setTheme} = useContext(ThemeContext);
    return (
        <>
            <h1 style={{color: theme === "dark" ? "white" : "black"}}>Home</h1>
            <button onClick={() => setTheme("dark")}>dark</button>
            <button onClick={() => setTheme("light")}>light</button>
        </>
    );
};

export default Home;
```

#### useCallback

解决：函数组件每次渲染时，内部定义的函数都会被重新创建（生成新的引用）如果这个函数作为 props 传递给子组件，即使函数逻辑完全没变，子组件也会认为props 变了（因为引用变了），从而触发子组件的重渲染，造成性能浪费；

使用useCallback可以缓存函数引用，只有依赖变化时才重新创建函数，避免子组件因父组件传递的函数频繁更新而导致的不必要重渲染（可以配合memo）；

useCallback参数和返回值：

- 第一个参数为需要缓存的函数；
- 第二个参数为依赖数组；
- 返回被缓存的函数引用，后续可以通过这个引用调用函数；

```
  const callback = useCallback(() => {
    console.log('callback');
  }, [])
```

#### memo

用于声明存子组件（或组件模块）要缓存渲染结果，避免组件在 props 未发生实质变化时对子组件进行不必要的重渲染；

memo会对子组件收到的props进行浅比较：基本数据类型比较值；复杂数据类型比较引用地址

memo的参数：

- 第一个参数为要缓存的子组件（或组件模块）；
- 第二个参数为自定义比较逻辑函数（参数分别为旧props对象和新props对象）；

```
//子组件中
import { useEffect,memo } from "react";

const Home = ({ callback }) => {
    callback();
    useEffect(() => {
        console.log('home');
    })
    return (
        <>
            <h1>Home</h1>
        </>
    );
};

const memoHome = memo(Home, (prevProps, nextProps) => {
    console.log(prevProps, nextProps);
    return prevProps.callback === nextProps.callback;
});

export default memoHome;
```

#### useMemo

解决：每次渲染时，函数组件的代码会重新执行，如果组件中包含计算成本很高的操作（如处理大型数组、复杂数学运算等），这些操作会随着组件的频繁渲染而重复执行，造成性能浪费；

useMemo 用于记录这些计算的结果，只在依赖项变化重新计算，否则直接复用缓存的结果；

原理：

- 在Hook链中，每个useMemo对应一个独立的Hook节点，节点永久缓存上一次依赖数组，上一次计算结果的值；
- 每次重新渲染时，React会进行新旧依赖进行浅比较，依赖没变，直接返回上一次计算结果值；依赖改变了，重新执行函数，覆盖缓存，并返回新值；

useMemo的参数：

- 第一个参数为昂贵的计算函数；
- 第二参数为依赖数组；

```
import { useEffect,useMemo, useState } from "react";
import './home.css';

const Home = () => {
    const [count, setCount] = useState(0);
    const [list, setList] = useState([1, 2, 3, 4, 5]);

    const expensiveCalculation = useMemo(() => {
        console.log('执行昂贵计算...'); 
        return list
        .filter(num => num % 2 === 0)
        .map(num => num **2)
        .reduce((sum, num) => sum + num, 0);
    }, [list]); 
    return (
        <>
            <h1>Home</h1>
            <button onClick={() => setCount(count + 1)}>count:{count}</button>
            <p>expensiveCalculation:{expensiveCalculation}</p>
        </>
    );
};
```

#### useReducer

用于集中管理某一个复杂状态，如状态存在多值联动、修改逻辑复杂等；

参数和返回值：

- 第一个参数为reducer函数：reducer函数的参数为state（上一个状态）和action（指定操作的类型，dispatch时传递），返回值为新状态值；通常搭配switch使用，配合action的type来执行特定的行为和返回特定的值；reducer必须是纯函数没有副作用；
- 第二个参数为初始状态；
- 第三个参数为惰性初始化函数：参数为初始状态，用于计算出最终的初始状态，且只在组件首次挂载时执行一次；
- 返回值为state和dispatch函数（用于发送一个action指令对象，这个指令对象会被传递给reducer函数，告诉reducer需要对状态做什么操作，dispatch触发的更新是异步的）

```
import {useReducer } from "react"

const Home = () => {
    const [count, dispatch] = useReducer(countReducer, 0);
    function countReducer(state, action) {
        switch (action.type) {
            case 'increment':
                return state + 1;
            case 'decrement':
                return state - 1;
            case 'reset':
                return 0;
        }
    }
    return (
        <div>
        <p>当前计数：{count}</p>
        <button onClick={() => dispatch({ type: 'increment' })}>+1</button>
        <button onClick={() => dispatch({ type: 'decrement' })}>-1</button>
        <button onClick={() => dispatch({ type: 'reset' })}>重置</button>
        </div>
    );
}
export default Home
```

#### useDeferredValue

用于React的并发渲染优化：useDeferredValue会根据原始值（原始值不会延迟更新）衍生出延迟版本的值，当触发重新渲染时，延迟版本的值会先保持旧值，优先让高优先级操作完成渲染；等浏览器主线程空闲后，延迟版本才会更新为新值，触发对应的低优先级渲染；

虽然能够将某些数据的更新变成低优先级，但是高消耗的计算在主线程执行时依然会阻塞主线程，可以配合useMemo和memo来缓存，避免非必要的更新；

参数和返回值：

- 第一个参数为需要延迟更新渲染的原始值（一般是状态/props，可以是普通值），返回带有延迟渲染的值（派生值是只读的，修改原始值会延迟同步到派生值）；
- 第二个参数为配置对象，仅支持一个属性timeoutMs（设置最大延迟时间，即使主线程一直忙碌，超过该时间后，非紧急 UI 也会强制更新，默认值为无）

```
import { useState, useDeferredValue, useMemo, memo } from 'react';

//缓存列表项组件：避免单个条目无意义重渲染
const ListItem = memo(({ item }) => {
  return <li key={item.id}>{item.name}</li>;
});

//缓存整个列表组件：避免列表整体无效重渲染
const FilteredList = memo(({ deferredQuery, items }) => {
  //用 useMemo 缓存过滤结果：仅当 deferredQuery 变化时才重新过滤
  const filteredItems = useMemo(() => {
    return items.filter(item => item.name.includes(deferredQuery));
  }, [deferredQuery, items]); // 依赖变化才重新计算
  return (
    <ul>
      {filteredItems.map(item => (
        <ListItem key={item.id} item={item} /> 
      ))}
    </ul>
  );
});

function App() {
  const items = useMemo(() => 
    Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
    })),
  []); 

  const [query, setQuery] = useState('');
  
  // 创建延迟关键词（低优先级更新）
  const deferredQuery = useDeferredValue(query, {
    timeoutMs: 500, // 最多延迟500ms，避免用户长时间看不到结果
  });

  return (
    <div>
      {/* 紧急UI：输入框（高优先级，实时响应） */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索..."
        style={{ padding: '8px', fontSize: '16px', width: '300px', margin: '10px' }}
      />
      {/* 非紧急UI：用缓存的列表组件，传入延迟值 */}
      <FilteredList deferredQuery={deferredQuery} items={items} />
    </div>
  );
}
export default App;
```

#### useTransition

用于React的并发渲染优化：用于标记非紧急的状态更新操作，让 React 优先处理用户交互（如输入、点击）等紧急操作，避免非紧急更新阻塞 UI 导致卡顿，从而提升应用响应性；

参数和返回值：

- 参数为带有timeoutMs的配置对象；
- 返回带有两个元素的数组：
  - isPending：标记当前过渡更新的执行状态：调用 `startTransition` 后，`isPending` 变为 `true`；过渡更新完成（或超时强制完成）时，`isPending` 变为 `false`； 若过渡更新被紧急更新中断，`isPending` 保持 `true`，直到过渡更新最终恢复并完成）；
  - startTransition：包裹非紧急状态更新逻辑，告知React该更新为低优先级；

和useDeferredValue区别：

- useTransition：包裹非紧急更新的操作，自带isPending标记过度状态
- useDeferredValue：包裹非紧急更新的状态（值），需通过原始值与延迟值是否一致或 `Suspense` 感知加载状态，

```
import { useState, useTransition } from 'react';

function SearchList() {
  const [inputValue, setInputValue] = useState(''); // 紧急更新：输入框值
  const [filteredList, setFilteredList] = useState([]); // 非紧急更新：过滤后的列表
  const [isPending, startTransition] = useTransition({
    timeoutMs: 300, // 300ms 内完成，否则显示加载状态
  });
  
  const allItems = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    //紧急更新：即时更新输入框值，保证输入流畅
    setInputValue(value);
    //非紧急更新：用 startTransition 包裹，避免阻塞输入
    startTransition(() => {
      // 过滤逻辑
      const filtered = allItems.filter(item => item.includes(value));
      setFilteredList(filtered);
    });
  };

  return (
    <div>
      {/* 输入框：紧急更新，无卡顿 */}
      <input 
        type="text" 
        value={inputValue} 
        onChange={handleInputChange} 
        placeholder="搜索..."
      />

      {/* 过渡中显示加载状态 */}
      {isPending && <div>加载中...</div>}

      {/* 非紧急更新：过滤后的列表 */}
      <ul>
        {filteredList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### useSyncExternalStore

React 18 提供的用于安全订阅外部状态源的 Hook，保证在并发渲染下不会发生数据撕裂（不一致）

用于保持外部状态（如 Redux、localStorage、navigator.onLine ）在并发渲染模式下数据一致性；

参数和返回值：

- 第一个参数为订阅函数：接收一个 callback作为参数，当外部状态发生变化时（需要通过特定方法监听），需要手动调用这个回调，以此通知React外部状态已更新，调用callback后React会触发重新渲染；

  返回一个取消订阅函数，当组件卸载、或不再依赖该外部状态时，React 会调用这个函数，用于移除之前的订阅（比如移除事件监听器、取消定时器等），避免内存泄漏；

- 第二个参数为用于获取外部状态当前快照的函数：React会在首次渲染或收到subscribe的callback通知后调用，返回值会作为 useSyncExternalStore的返回值传递给组件；

在渲染过程中，React 会先调用 getSnapshot 获取一个状态快照，并在整个 render 过程中保持这个快照不变，即使期间外部状态发生变化，也不会影响当前渲染；

在 commit 阶段前，React 会再次调用 getSnapshot，如果发现快照发生变化，会放弃当前渲染并重新执行，从而保证 UI 与外部状态始终一致，避免 tearing

```
import { useSyncExternalStore } from 'react';

// 订阅网络状态变化
const subscribe = (callback) => {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  // 取消订阅
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
};

// 获取当前网络状态快照
const getSnapshot = () => navigator.onLine;
function Home() {
  // 使用 useSyncExternalStore 订阅外部状态
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <div>网络状态：{isOnline ? '在线' : '离线'}</div>;
}
export default Home

//集中式状态管理
let externalState = { count: 0 };
const listeners = new Set();
// 外部状态的更新方法
const updateState = (newState) => {
  externalState = { ...externalState, ...newState };
  // 通知所有订阅者
  listeners.forEach(listener => listener());
}; 

//组件内
// 订阅函数
const subscribe = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};
// 获取快照
const getSnapshot = () => externalState.count;
// 组件中使用
function Counter() {
  const count = useSyncExternalStore(subscribe, getSnapshot);
  return (
    <div>
      计数：{count}
      <button onClick={() => updateState({ count: count + 1 })}>加1</button>
    </div>
  );
}
```

#### use

`use` 是 React 提供的一个用于在 render 阶段直接读取异步资源（Promise / context）的 API，它通过抛出 Promise + Suspense实现同步写法的异步数据读取，简化useEffect+useState的异步读取逻辑；

- 在组件内部直接创建 Promise，会导致组件每次渲染时都生成一个新的 Promise 实例，由于这个 Promise 没有被缓存，React 目前不支持在组件渲染过程中对这类未缓存的 Promise 使用 `use` 进行解析；
- `use` 会在渲染阶段同步执行，如果数据尚未就绪，它会抛出一个 `Promise` 让 React 等待；如果数据已经可用，就直接返回读取结果；
- `use` 更适合用于读取数据，不适合处理副作用逻辑；
- 它的优点是写法更简洁，能够减少 `useEffect + useState` 组合带来的额外渲染次数；

```
import { Suspense, use } from "react";

// 模拟请求（注意：在组件外定义，保证缓存）
const dataPromise = fetch("/api/data").then(res => res.json());

function DataComponent() {
  const data = use(dataPromise); // 直接读取 Promise
  return <div>{data.name}</div>;
}

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataComponent />
    </Suspense>
  );
}

```

### 类式组件

需要继承 React.Component，必须定义render() 方法返回React组件的虚拟DOM；

在类中要以赋值语句和箭头函数的方式声明变量或方法，并且要通过this访问变量或方法；

```
import React from 'react';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1 style={{ color: 'red' }}>Hello React</h1>
        <div>
          {
            ["Vue", "React", "Angular"].map((item) => {
              return <div key={item}>{item}</div>
            })
          }
        </div>
      </div>
    );
  }
}

export default App;
```

####   state

用于表示组件内部管理的数据，当 state的数据发生变化时，React会重新调用组件的渲染方法（函数式组件重新执行函数，类组件重新调用 render()），重新渲染依赖该state的地方；

**this.setState**：参数为一个对象，异步的响应式并以合并的方式修改state的数据；

```
class App extends React.Component {  
  state = {
      count: 0,
  };
  countAdd = () => {
    this.setState({
      count: this.state.count + 1,
    });
  }

  render() {
    const { count } = this.state;
    return (
      <div className="App">
        <div>{count}</div>
        <button onClick={this.countAdd}>+1</button>
      </div>
    );
  }
}

export default App;
```

#### props

用于父组件向子组件传递数据，子组件通过this.props可以访问传递的数据，并且this.props是只读的；

在构造函数中可以不用将收到的props传给super，除非想要在构造函数中以this方式访问props；

可以通过defaultProps静态对象设置props的默认值；

```
//在父组件中
<App name="React" age="18" />

//在子组件中
class App extends React.Component {
  static defaultProps = {
    name: 'React',
    age: 18
  }
  render() {
    return (
      <div className="App">
        <div>{this.props.name}</div>
        <div>{this.props.age}</div>
      </div>
    );
  }
}

export default App;
```

#### render Props

一种组件间共享逻辑的设计模式，父组件通过接收一个返回子组件的函数作为 props（通常命名为 `render` 或利用 `children`），将自身的状态或逻辑传递给这个函数；相当于Vue的插槽； 

```
import React from "react";

class Parent extends React.Component {
    render() {
        return (
            <div>
                <h1>Parent</h1>
                <A children={()=><B/>}/>
            </div>
        );
    }
}

class A extends React.Component {
    render() {
        return (
            <div>
                <h1>A</h1>
                {this.props.children()}
            </div>
        );
    }
}

class B extends React.Component {
    render() {
        return (
            <div>
                <h1>B</h1>
            </div>
        );
    }
}

export default Parent
```



#### ref属性

能够获得真实dom元素；

**通过React.createRef**：

React.createRef用于创建一个存储被ref所标识的节点的容器，该对象有一个 current 属性，用于存储dom元素；

```
class App extends React.Component {
  div1 = React.createRef();
  render() {
    return (
      <div className="App">
        <div ref={this.div1}></div>
      </div>
    );
  }
}
```

**通过回调函数：**

回调的参数即为dom元素，可以将dom元素挂载到this上；

内联回调形式在每次组件重新渲染时，先调用旧回调（传入 `null`），再调用新回调（传入 DOM 元素），即每次渲染都会创建新的函数，并额外触发 2 次调用；

绑定类方法形式在每次组件重新渲染时，不会再被调用；

```
class App extends React.Component {
  getDiv2 = el => {
    this.div2 = el
  }
  render() {
    return (
      <div className="App">
        <div ref={el => this.div1 = el}></div>//内联回调
        <div ref={this.getDiv2}></div>//绑定类方法
      </div>
    );
  }
}
```

### 事件处理

React 的事件处理机制是在原生 DOM 事件基础上封装的一套合成事件（SyntheticEvent）系统；

- React 并不是直接把事件绑定到真实 DOM 上，而是通过事件委托（收集路径上的回调，按顺序执行）统一绑定在根节点（React 17 之前是 `document`，之后是 root 容器）；
- React 事件默认是冒泡阶段触发的（类似 DOM 的 bubble），如果需要捕获阶段，可以使用 `onClickCapture` 这类写法；
-  React 会对原生 DOM 事件封装一个SyntheticEvent 对象，用于提供跨浏览器一致的事件 API：在每次事件触发时都会创建SyntheticEvent 对象，传入对应回调函数；

回调函数写法：

- 直接传入函数引用：自动接收 `SyntheticEvent`， 不能直接传自定义参数
- （不能写成函数调用形式，否则会在渲染时执行，而不是点击时执行）；
- 箭头函数：可以传递自定义参数，需要额外创建外层箭头函数；

```
//函数式写法
function Button() {
  const handleClick = () => {
    console.log("按钮被点击了");
  };
  return <button onClick={handleClick}>点击我</button>;
}

//类式写法
class App extends React.Component {
  onClick = () => {
    console.log("click");
  }
  render() {
    return (
      <div className="App">
        <div onClick={this.onClick}>按钮</div>
      </div>
    );
  }
}
```

#### 事件合成对象

SyntheticEvent 是 React 对原生 DOM 事件的封装对象，在事件触发时创建，并且传给对应回调函数；

-  跨浏览器统一：不同浏览器事件行为不一致，React 做统一封装；
- 早期 React 为了性能使用事件池复用机制，会在回调后清空事件对象，需要通过 `event.persist()` 保留（会有异步问题）；而 React 17 之后取消了该机制，事件对象不再复用，可以在异步场景中直接使用；

API：

- e.target
- e.currentTarget
- e.preventDefault()
- e.stopPropagation()
- e.nativeEvent

```
const App = () => {
  const onClick = (event) => {
    console.log(event);
  }
  return (
    <div className="App">
      <div onClick={(event) => onClick(event)}>按钮</div>
    </div>
  );
};
```

#### 受控组件和非受控组件

受控组件：表单数据由 React 状态（state）完全控制，即表单元素的值始终与 React 状态同步；

- 输入变化必须通过 `onChange` 更新 state
- 数据是单向数据流（state → UI）

推荐使用受控组件：因为受控组件符合 React 的“数据驱动 UI”思想，使 UI 完全由 state 决定，从而保证一致性、可预测性和可控性；

```
function App() {
  const [value, setValue] = useState('');

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

非受控组件：表单数据由 DOM 自身控制，React 不直接管理状态，而是通过 `ref` 手动获取 DOM 元素的值；

```
function App() {
  const inputRef = useRef();

  function handleSubmit() {
    console.log(inputRef.current.value);
  }

  return <input ref={inputRef} />;
}
```

### 生命周期

主要是类式组件的生命周期，函数式组件没有生命周期，而是通过useEffect模拟实现；

#### 挂载阶段

constructor()：构造函数，初始化state和绑定事件回调函数；

static getDerivedStateFromProps()：用于根据父组件传递的props派生的或更新组件内部state时调用，参数为更新后的props和state，返回一个对象表示更新state，返回null表示不更新state；

render()：渲染组件，返回 JSX 结构；

componentDidMount()：组件挂载完成后调用；

```
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }
  
  static getDerivedStateFromProps(props, state) {
    console.log(props);
    console.log(state);
    return null;
  }
  
  componentDidMount() {
    fetch("/api/data").then(res => res.json()).then(data => {
      this.setState({ data });
    });
  }

  render() {
    return <div>{this.state.data ? this.state.data : "加载中..."}</div>;
  }
}
```

#### 更新阶段

shouldComponentUpdate(nextProps, nextState)：根据返回值决定是否重新渲染，参数为变化后的props和state；

render()：重新渲染组件；

getSnapshotBeforeUpdate()：在render调用之后，dom渲染之前调用，其返回值会作为componentDidUpdate的第三个参数；

componentDidUpdate(prevProps, prevState)：DOM 更新完成后调用，参数为变化之前的props和state；

```
class App extends React.Component {
  state = {
    count: 0
  }
  onClick = () => {
    this.setState({
      count: this.state.count + 1
    })
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps, nextState);
    console.log("shouldComponentUpdate");
    return true;
  }
  
  getSnapshotBeforeUpdate() {
    console.log("getSnapshotBeforeUpdate");
  }
  
  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps, prevState);
    console.log("componentDidUpdate");
  }
  
  render() {
    console.log("render");
    return (
      <div className="App">
        <div onClick={() => this.onClick()}>按钮{ this.state.count }</div>
      </div>
    );
  }
}
```

#### 卸载阶段

componentWillUnmount()：组件被销毁时执行一次，可用于清理副作用（如取消订阅、清除定时器、移除事件监听）

```
class App extends React.Component {
  componentWillUnmount() {
    console.log("componentWillUnmount");
  }
}
```

### 内置组件

#### Suspense

用来处理异步渲染，它让你能够挂起组件渲染，直到某些条件满足（例如异步加载数据或代码拆分），从而优化了用户体验，特别是在处理需要等待的异步操作时；

lazy： 接受一个动态的 `import()` 表达式作为参数（只能用于默认导出的组件），并返回一个新的 React 组件；当该组件需要渲染时，React 才会异步加载该组件的代码，从而实现懒加载；

```
import { Route, Routes, Link } from "react-router-dom"
import { lazy, Suspense } from "react"
import './App.css'

const Home = lazy(() => import("./components/Home/Home.jsx"))
const About = lazy(() => import("./components/About/About.jsx"))

function App() {
  return (
    <>
      <Link to="/home">Home</Link>
      <Link to="/about">About</Link>
      <Routes>
        <Route path="/home" element={<Suspense fallback={<div>Loading...</div>}><Home /></Suspense>} />
        <Route path="/about" element={<Suspense fallback={<div>Loading...</div>}><About /></Suspense>} />
      </Routes>
    </>
  )
}

export default App
```

#### ErrorBoundary

`ErrorBoundary` 组件本身并不是 React 的内置组件；它是一个由开发者自己实现的组件，用来捕获子组件中的错误并处理它们，防止整个应用崩溃

- 错误边界传统上是一个类组件，因为它依赖于生命周期方法 `componentDidCatch` 和 `getDerivedStateFromError`

- 不能捕获以下情况的错误：只能使用`try-catch`单独处理（可以在catch中再次抛出错误给边界处理）；

  - 事件处理中的错误：例如，点击事件、输入事件等中的错误无法通过错误边界捕获；

  - 异步代码中的错误：如 `setTimeout`、`fetch`、Promise 相关的错误等；
  - 生命周期外的错误：只能捕获渲染阶段 和 生命周期方法*中发生的错误。它不捕获例如构造函数或静态方法中的错误；

```
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }; // 设置错误状态
  }

  componentDidCatch(error, info) {
    // 发送错误信息到日志服务
    this.logErrorToService(error, info);
  }

  logErrorToService(error, info) {
    // 实际生产中可以将错误信息发送到远程日志系统，如 Sentry、LogRocket
    console.error('Logging Error to Service:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>; // 自定义回退 UI
    }

    return this.props.children; // 正常渲染子组件
  }
}

export default ErrorBoundary;


//使用
import React from 'react';
import ErrorBoundary from './ErrorBoundary';

function MyComponent() {
  // 模拟一个错误
  throw new Error('Something went wrong!');
  return <div>My Component</div>;
}

function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}

export default App;
```



#### Fragment

用于在不添加额外DOM 节点的情况下，让组件返回多个同级元素；它解决了 React 组件中必须有一个单一根元素 的限制；现在推荐使用`<>...</>`空标签；

```
import { Fragment } from "react";
const Home = () => {
    return (
        <Fragment>
            <h1>Home</h1>
            <p>Home</p>
        </Fragment>
    );
}
export default Home
```

#### Profiler 

用于测量组件渲染性能的工具，它可以监控被包裹组件及其子组件的渲染次数，记录每次渲染的耗时，提供渲染触发的原因；

属性：id（唯一标识），onRender（被包裹组件渲染时触发的回调）；

```
import Home from "./components/Home/Home"
import About from "./components/About/About"

import { Routes, Route, Link } from "react-router-dom"
import { Profiler } from "react"

function App() {
  const about = (id, phase, actualDuration, baseDuration) => {
    console.log(id, phase, actualDuration, baseDuration)
  }
  return (
    <>
      <Link to="/" state={{ title: "Home" }}>Home</Link>
      <Link to="/about">About</Link>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Profiler id="about" onRender={about}><About /></Profiler>} />
      </Routes>
    </>
  )
}

export default App
```

#### StrictMode

一个开发环境专用的工具组件，用于帮助开发者检测组件中潜在的问题；

为了检测不纯的代码（如在渲染阶段产生副作用、依赖不稳定值的计算等），`<StrictMode>` 会在开发环境中故意执行两次以下操作，如组件的渲染函数，`useState`、`useMemo`、`useReducer` 的初始化函数。`useEffect` 的清理函数；

React 中某些生命周期方法（如 `componentWillMount`、`componentWillReceiveProps`、`componentWillUpdate`）由于设计缺陷，容易导致 bug，已被标记为不安全`<StrictMode>` 会在检测到这些方法时在控制台抛出警告；

#### PureComponent（类）

  React提供的一个类组件基类（继承自 React.Component）；它的核心特性是自动实现了 `shouldComponentUpdate` 方法，通过对 `props` 和 `state` 进行浅比较来决定是否需要重新渲染组件，从而避免不必要的渲染操作；类似函数式组件的memo；

```
// 父组件
class Parent extends React.Component {
  state = {
    count: 0,
    user: { name: '张三', age: 20 }
  };
  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };
  render() {
    return (
      <div>
      //点击按钮时，父组件因 count 变化重新渲染，但 UserCard 接收的 props（name 和 age）没有变化，因此 UserCard 不会重新渲染
        <button onClick={this.handleClick}>计数：{this.state.count}</button>
        <UserCard {...this.state.user} />
      </div>
    );
  }
}

//子组件
import React, { PureComponent } from 'react';

// 继承 PureComponent 而非 Component
class UserCard extends PureComponent {
  render() {
    const { name, age } = this.props;
    return (
      <div>
        <p>姓名：{name}</p>
        <p>年龄：{age}</p>
      </div>
    );
  }
}
```


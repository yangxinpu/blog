# React Advanced

### Creating React Projects

#### CLI (Not Recommended)

React's traditional scaffold is create-react-app (CRA), which wraps Webpack configuration through react-scripts, handling JSX transpilation, ES6+ syntax downgrade (via Babel), CSS parsing, static asset handling, code splitting, and compression optimization through Webpack;

**Global CLI Installation**: `npm install -g create-react-app` (Global installation may lead to version lag issues)

**Create React Project with CLI**: Does not support pnpm;

```bash
yarn create react-app project-name

create react-app project-name
```

#### Vite

Create React projects using the Vite framework; Project templates automatically include eslint;

```bash
yarn create vite project-name
npm create vite@latest project-name
pnpm create vite@latest project-name
```

### Routing

Install: `npm install react-router-dom`

#### Route Components

**BrowserRouter**: Implements routing based on HTML5's `History API` (`pushState`, `replaceState`); Usually wraps the App component;

**HashRouter**: Implements routing based on the hash part (after `#`) in the URL; Usually wraps the APP component;

```jsx
//In main.js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

**Link**: Generates route links, navigates to specified path on click; Properties: to (can be target path or path object), replace (whether to enable replace mode);

**NavLink**: Automatically adds active state styles or class names when current URL matches its `to` property; className and style properties can be written as callbacks, receiving an object with isActive property as parameter;

**Routes**: Route container, wraps multiple `Route` components, only renders the first Route matching current URL;

**Route**: Defines single route rule; Properties: path (URL path), element (component to render when matched), end (whether to enable strict matching), caseSensitive (whether to be case-sensitive when matching, default false), index (whether to mark as default child route)

```jsx
//In app component
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

**Navigate**: Used for redirection; Properties: to (redirect path), replace (whether to enable replace mode);

```html
  <Routes>
    <Route path="/home" element={<Home />} end/>
    <Route path="/about" element={<About />} />
    <Route path="/" element={<Navigate to="/home" replace/>} />
  </Routes>
```

**Outlet**: Position where child route components render; When Route has nested child routes, path is relative path, no need for / prefix, can use index to mark default child route;

```js
//In app component
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

//In parent route
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

#### Route Hooks

##### useRoutes

Used to batch register routes, no need to set Router and Route;

```js
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

##### useLocation

Used to get current route location information, including path (pathname, like /home), query parameters, state, etc.;

```js
import {useLocation} from "react-router-dom"
const Home = () => {
    const location = useLocation();
    console.log(location);
    return (
        <div>
            <h1>Home</h1>
        </div>
    );
}
export default Home
```

##### useNavigate

Used to trigger route navigation programmatically;

First parameter can be string (navigate to corresponding route path), number (navigation steps), or detailed path object (pathname, search, hash);

Second parameter is configuration object, including replace mode, state data;

```js
import {useNavigate} from "react-router-dom"

const Home = () => {
    const navigate = useNavigate()
    return (
        <div>
            <h1>Home</h1>
            <button onClick={() => navigate(
                { pathname: '/about', search: '?id=123' },
                { replace: true, state: { from: 'home' } })}>Navigate</button>
        </div>
    );
}

export default Home
```

##### useMatch

Used to check if current URL matches specified path pattern;

Receives a string as matching parameter, like static path ("/home", "/about"), with parameters ("/user/:id"), wildcard ("/admin/*", matches all sub-paths under /admin);

Returns an object containing match details (including params, pathname, pathnameBase), returns `null` when not matching;

```js
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

Used to determine how the route page was navigated to, valid values: POP (page refresh), REPLACE, PUSH

```js
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

#### Route Parameter Passing

##### params Parameters

Pass parameters in Link's to path, write placeholders in Route component; Use useParams Hook in target route to get parameter object;

```js
//In app component
import Home from "./components/Home/Home.jsx"
import About from "./components/About/About.jsx"
import {Route, Routes, Link } from "react-router-dom"

function App() {
  return (
    <>
        <Link to="/home/aaa/12">Home</Link>
        <Link to="/about">About</Link>
        <Routes>
          <Route path="/home/:name/:age" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>        
    </>
  )
}
export default App

//In home component
import {useParams} from "react-router-dom"

const Home = () => {
    const {name,age} = useParams();
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

##### search Parameters

Pass variables and parameters in Link's to path (like /product?page=1&size=10&sort=asc); Use useSearchParams Hook in target route to get parameter object;

useSearchParams: Returns query parameter object, contains get method (get value by key), getAll method (get array of all values), has method (check if specified key exists)

```js
//In app component
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

//In home component
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

##### state Parameters

Data doesn't display in URL, but is stored in browser's history (`history`);

```js
//In app component
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

//In home component
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

A library for centralized state management, it stores the entire application's state in a single JS object tree, which only exists in the unique Store; to change state, must dispatch an Action to Reducer to return new state;

Install: `npm install @reduxjs/toolkit react-redux`

**@reduxjs/toolkit (RTK)**: Official Redux toolset, provides configureStore, createSlice, createAsyncThunk, createSelector methods to simplify Redux usage;

**react-redux**: Connects Redux store with React components, allowing React components to access Redux state and dispatch actions to modify state;

**Action**: A JS object describing Reducer operation, like `{type: 'todos/add', payload: { id: 1, text: 'Learn Action', completed: false }}`

**Store**: Hub connecting Action and Reducer, responsible for storing all application state, receiving Action and calculating new state through Reducer, while notifying components of state changes;

**Reducer**: A pure function, receives current state and Action as input, returns a brand new state object

#### Basic Usage

Configure store: Create `src/redux/store.js`, integrate all reducers

```js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice'; 

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
});
```

Create slice: Create `src/redux/slices/counterSlice.js`, use Redux Toolkit's `createSlice` to auto-generate Actions and Reducers

```js
import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  count: 0
};

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

Inject store in root component

```jsx
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
  </StrictMode>,
)
```

Use in component

```jsx
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, incrementByAmount } from '../redux/slices/counterSlice';

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

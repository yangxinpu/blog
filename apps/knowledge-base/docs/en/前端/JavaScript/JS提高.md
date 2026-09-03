# JavaScript Advanced

### Event Loop

JavaScript is single-threaded, while browsers are multi-threaded. Capabilities like network requests, timers, and DOM events are handled by other browser threads. When JavaScript calls these Web APIs to initiate tasks, it doesn't block the main thread. When async tasks complete, their callbacks are placed in task queues. The event loop mechanism is responsible for taking these callbacks and executing them when the call stack is empty, enabling JavaScript to work with the browser's multi-threading capabilities.

Why JS isn't designed as multi-threaded: To avoid complex concurrency issues (data races, deadlocks) that multi-threading brings. For example, if multiple threads simultaneously manipulate the DOM, it would lead to inconsistent states.

- The essence of the event loop: scheduling between a single-threaded execution stack and multiple task queues, enabling JavaScript to handle async tasks in a non-blocking way;
- Event loop execution order: Execute sync code → Clear microtasks → Execute one macrotask → Clear microtasks again, repeating the cycle;

#### Sync and Async

**Sync tasks**: Execute in order in the execution stack;

**Async tasks**: Async tasks don't block the main thread. When the JS engine encounters an async operation, it calls browser-provided Web APIs (or libuv in Node.js) to handle the async operation. The JS engine continues executing subsequent sync code. When the async task completes, its callback is placed in task queues and scheduled into the main thread for execution when the execution stack is empty via the event loop mechanism;

Task queues are divided into microtask queue and macrotask queue:

- **Macrotasks**: Such as script (overall script, first macrotask), network requests (fetch), `setTimeout`, `setInterval`, DOM events, requestAnimationFrame, etc. Each event loop executes only one macrotask;

- **Microtasks**: Such as `Promise.then / catch / finally`, `queueMicrotask`, `MutationObserver`. Execute immediately after current sync task completes, and are cleared all at once. If new microtasks are generated during microtask execution, these new microtasks are placed in the current microtask queue and continue executing in this round until the microtask queue is completely empty;

```js
setTimeout(() => {
  console.log('macro');
  Promise.resolve().then(() => {
    console.log('micro');
    Promise.resolve().then(() => {
      console.log('micro2');
    });
  });
  Promise.resolve().then(() => {
    console.log('micro3');
  });
});
// Output order: macro, micro, micro3, micro2 (micro2 is a microtask added to queue later)

queueMicrotask(() => {
  // Standard microtask API
  console.log('microtask');
});

// Microtask in Node.js
process.nextTick(() => {
  console.log('nextTick');
});
```

#### Async Scheduling Mechanism

A mechanism that, without blocking the main thread, hands over tasks that cannot be completed immediately to the underlying system for processing, and reschedules them back to the main thread at an appropriate time according to established priority rules;

- When the JS engine encounters an async task, it doesn't execute the async task itself, but hands it to the browser's Web APIs or Node.js's libuv for underlying system processing (e.g., timer timing, network requesting, etc.);
- Then the JS engine continues executing sync tasks;
- After the async task itself completes, its callback is placed in the macrotask or microtask queue;
- When the execution stack is empty, the event loop schedules the task's callback into the execution stack (microtask queue is cleared all at once, macrotask queue takes only one at a time)

### Iterators & Generators

#### Iterators

**Iteration**: Accessing data by extracting one by one from an ordered and continuous target source; (traversal is usually implemented based on iteration);

**Iterator Protocol**: Must implement the `next()` method, and `next` returns `{value, done}`; objects conforming to the iterator protocol are iterators;

**Iterable Objects**: Objects that implement the `Symbol.iterator` method, such as arrays, strings, Set, Map; can be traversed by `for...of` and spread operator;

Native `Object` doesn't implement `Symbol.iterator` by default, so it's not iterable and can't be traversed by `for...of`. You can manually implement `Symbol.iterator` to make it iterable;

```js
let arr = [1, 2, 3];
console.log(arr[Symbol.iterator]().next());

// Custom iterator for custom object
let obj = {
  a: 1,
  b: 2,
  c: 3,
  [Symbol.iterator]() {
    var index = 0;
    let map = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    return {
      // Return next() method
      next() {
        var mapEntries = [...map.entries()];
        if (index < map.size) {
          return {
            value: mapEntries[index++],
            done: false,
          };
        }
        return { value: undefined, done: true };
      },
    };
  },
};

for (let i of obj) {
  console.log(i);
}
```

#### Generators

Generator is a function that can pause execution and resume later, defined by `function*`, returning a generator object when called;

**Generator Object**:

- `next` method: Starts or resumes generator execution, executes to the next `yield / return`;
- `return` method: Terminates the generator, returns `{ value: value, done: true }`;
- `throw` method: Throws an exception into the generator

**In Generator**:

- Calling `next` once executes to one `yield / return`, and the `yield / return` value becomes the iterator return object's value;
- `next(value)`'s parameter becomes the previous `yield` expression's return value;
- If `return` is encountered, returns `{ value: return's value, done: true }`, all subsequent `next` calls return `{ value: undefined, done: true }`;

```js
function* gen() {
  const a = yield 1;
  console.log('a:', a);

  const b = yield 2;
  console.log('b:', b);

  return 3;
}
// Get generator object
const g = gen();
g.next(); // Returns { value: 1, done: false }, stops at: yield 1, a not assigned yet
g.next('X'); // "X" assigned to a, outputs 'X', executes yield 2, returns { value: 2, done: false }
g.next('Y'); // "Y" assigned to b, outputs 'Y', executes return 3, returns { value: 3, done: true }
// Subsequent g.next calls all return { value: undefined, done: true }
g.return(100); // { value: 100, done: true } // Can directly terminate generator

// Use generator to create iterator
let obj = {
  a: 1,
  b: 2,
  c: 3,
  [Symbol.iterator]: function* () {
    var index = 0;
    let map = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    var mapEntries = [...map.entries()];
    while (index < mapEntries.length) {
      yield mapEntries[index++];
    }
  },
};
for (let i of obj) {
  console.log(i);
}
```

### ES Modules

A module represents an independent JavaScript file that can define variables, functions, or classes internally, then expose them to other files through exports;

- **Static Structure**: Module dependencies are determined at code parsing stage (ESM's import must be at module top level, can't be inside functions, can't be in conditional statements, can't dynamically concatenate paths);
- ES modules execute only once; when a module is imported in multiple places, JavaScript loads the module only once, and all subsequent imports share the same module instance;
- **Module Scope**: Strict mode by default, `this` is `undefined`, variables declared inside module don't attach to global object;
- `import` gets a live binding reference to exported variables (including ordinary variables), not a copy of values; if module variable value changes, all imported values also change;
- For browser environment: ES modules can only be loaded via http/https, data:, blob: protocols, not file:// protocol; (Node environment doesn't have this restriction);

**Module Loading Process**:

- Parse module: Browser reads module file, parses import and export, builds module dependency graph;
- Instantiate module: Creates module record and export bindings for each module;
- Execute module: Executes modules in dependency order (depth-first execution of dependency modules), and saves module to module registry;

```js
// Named export
export const fn = function () {
  console.log('module');
};
// Import
import { fn } from './jsmodule.js';

// Default export
export default function () {
  console.log('module1');
}
// Import
import fn from './jsmodule.js';

// Alias import
import { fn as Fn } from './jsmodule.js';
// Namespace import
import * as Fn from './jsmodule.js'; // Collects exports into an Fn object
```

#### Dynamic Module Loading

Allows runtime on-demand loading of modules in local scope; dynamic import returns a Promise;

- Not imported at first screen load, only loaded when needed;
- Can be used anywhere, supports conditional loading;
- Supports code splitting: bundlers (like Webpack / Vite) split dynamic modules into independent chunks;

```js
if (1) {
  import('./jsmodule.js').then((module) => {
    module.default(); // Default exported object
    module.fn();
  });
}
```

### JS Runtime Model

```
// JS code execution core flow

1. Create Execution Context
2. Push onto stack (Execution Context Stack)
3. Creation Phase
   ├── Create Lexical Environment
   ├── Create Variable Environment
   ├── Bind this
   ├── Establish scope chain (outer)
   └── Variable/function hoisting
4. Execution Phase
   └── Execute code line by line (variable lookup, assignment, etc.)
5. Pop from stack (execution complete)
```

#### Execution Context

JS code execution environment, defines how variables, functions, and objects are accessed and managed during code execution; includes global context and function context;

Execution context contains:

- **Lexical Environment**: Used to store `let / const` declared variables and block scope; contains environment record and outer reference (for forming scope chain);
- **Variable Environment**: Used to store `var` declared variables and function declarations; essentially also a lexical environment, but usually doesn't change as frequently during execution;
- **this object**: In global context, `this` points to global object; in function context, `this` points to the object calling the function;

Related mechanisms:

- **Scope Chain**: Composed of multiple lexical environments linked together, usually the current execution context's lexical environment plus outer environment references;
- **Call Stack**: During execution, whenever a new execution context is created, it's pushed onto the call stack. When that context finishes executing, the top context is popped.

#### Lexical Environment

Lexical Environment is a data structure JavaScript uses to implement lexical scope, composed of Environment Record and reference to outer lexical environment (outer);

- **Environment Record**: Used to store current scope's let/const variables, function declarations, function parameters, etc.; two types:
  1. Declarative Environment Record: Uses "variable table" to store variables, not JS objects (can't access via `this.xxx`), like let/const declared variables, function parameters, etc.
  2. Object Environment Record: Uses "object" as scope, variables stored directly on an object, like with-declared scope, global scope (window);
- **outer**: Used to form scope chain, enabling stepwise variable lookup;

```js
{
  Environment Record: stores variables
  outer: points to outer lexical environment
}

function fn() {
  let a = 1;
}

fn Lexical Environment
   ├── a: 1
   └── outer → Global Lexical Environment
```

#### Variable Environment

Variable Environment is essentially a lexical environment (also has environment record and outer), used to store `var` declared variables and function declarations;

At execution context creation time `VariableEnvironment === LexicalEnvironment`, but when code executes to block scope, a new LexicalEnvironment is created;

Features:

- Only effective in "function-level scope", no block scope;
- "Variable hoisting" occurs;
- Function declaration has higher priority;

```js
VariableEnvironment = {
  EnvironmentRecord: {
    // Stores var and function
  },
  outer: outer reference
}
```

#### VO/AO

Variable Object (VO) is an abstract model used in ES5 and earlier specifications to describe variable storage in execution context, used to save variable declarations, function declarations, and function parameter identifier bindings (now replaced by environment records);

- In global context, variable object usually appears as global object (window in browsers);
- In function context, variable object is activated as Activation Object (AO), containing function parameters, arguments object, function declarations, and variable declarations;

Variable object completes initialization during creation phase (variables are undefined, functions already assigned), and continuously updates its values during execution phase;

#### Scope

Scope refers to the range where variables and functions are accessible, used to specify identifier visibility;

JavaScript's scope uses lexical scope (static scope), determined at code definition time, unrelated to function call position;

- Includes global scope, function scope, block scope, module scope
- Scope chain is a structure formed by multiple lexical environments connected through outer references, used for variable access lookup
- When accessing a variable, lookup starts from current scope; if not found, looks up the scope chain level by level until global scope; if still not found, returns undefined or throws error;

### Garbage Collection (GC)

Garbage collection refers to: the process of deleting objects in heap memory that are not used or cannot be accessed by other objects; if an object cannot be accessed from root objects (global variables), it will be collected;

- JS engine periodically triggers garbage collection, and triggers more frequently when system available memory is low;
- Whether objects pointed to by strong references are collected depends on GC's reachability analysis: if closures, event callbacks, timers, etc. still hold references to certain objects, and these reference chains can be accessed from root objects, these objects won't be garbage collected, potentially causing memory leaks;
- WeakMap and WeakSet use weak references, don't affect stored objects' reachability judgment; when objects are only held by weak references and not by other strong reference objects, they will be garbage collected;

```js
let obj = {};
let wm = new WeakMap();

wm.set(obj, 'data'); // When GC judges whether obj is reachable, it won't count the WeakMap reference
```

**Garbage Collection Methods**:

Modern JavaScript engines mainly use mark-and-sweep based garbage collection algorithms, combined with generational collection, incremental marking, and other optimization methods to improve collection efficiency and reduce main thread blocking;

- **Mark-and-Sweep**: Starts from root objects, traverses and marks all reachable objects; then traverses heap memory, clears all unmarked objects. This algorithm is based on reachability judgment, can effectively solve circular reference problems;
- **Reference Counting**: Maintains a reference count for each object; when new reference points to the object, count increases by one; when reference becomes invalid, count decreases by one; when count is 0, object is immediately collected. But this algorithm cannot handle circular reference problems;

### Browser Rendering Principles

#### Browser Engines

**webkit**: (Apple) Core is modular rendering, mainly composed of WebCore and JSCore; WebCore responsible for parsing HTML and CSS (supports modern Web standards like FlexBox, WebGL, mobile, etc.), building DOM tree and CSSOM tree, and generating final page through layout and painting; JSCore responsible for JIT compiling JS code, supports ES6+, WebAssembly;

Browsers using: Safari (Apple's Mac, iPhone, iPad);

**Blink+V8**: (Google) Blink is developed from webkit's WebCore branch; core function is parsing HTML and CSS for rendering; uses multi-threading (rendering process and browser main process separated); V8 engine responsible for JS JIT compilation; when Blink parses to script tag, it calls V8's compilation interface for JS compilation;

Browsers using: Chrome, Edge, Opera;

#### Process and Thread

**Process**: Process is the basic unit for operating system to allocate resources (like memory, CPU time, etc.), is an execution instance of a program; for example, opening a browser starts a browser process; opening an app opens a process;

Browser is multi-process, has one main process, GPU process, third-party plugin process; each opened page starts a new process (browser kernel rendering process);

**Thread**: Thread is the smallest execution unit within a process; a process can contain multiple threads that share the process's resources;

In browser rendering process (kernel), contains multiple threads:

- **GUI Thread**: Responsible for rendering browser pages, parsing HTML, CSS, building render tree, layout and painting, etc.;
- **JS Engine Thread**: Main thread responsible for parsing and executing JS code; JS engine keeps waiting for tasks in task queue, then processes JS code;
- **Event Trigger Thread**: Mainly controls event triggering; when event triggers, pushes event callback function into event queue, waiting for JS engine thread to execute;
- **Timer Trigger Thread**: Mainly controls setInterval and setTimeout; after timing completes, pushes timer's callback function into task queue, waiting for JS engine thread to execute;
- **Async HTTP Request Thread**: Monitors HTTP request status; when status changes, pushes corresponding callback function into task queue, waiting for JS engine thread to execute;

Note: Microtasks don't start a separate thread, but are processed uniformly by JS engine thread at specific times; after main thread finishes executing current sync code, it first clears microtask queue, then checks macrotask queue (like `setTimeout`, `DOM events`, etc.);

GUI thread and JS engine thread are mutually exclusive, cannot execute simultaneously (since JS can manipulate DOM, if modifying elements while rendering page, it would cause inconsistent rendering results; to prevent this, when JS engine executes, GUI thread is suspended, waiting for JS engine to be idle before being executed);

#### Browser Rendering Principle

When browser receives an HTML file, it generates a rendering process task and passes it to the main thread's message queue; under event loop mechanism, rendering main thread gets the rendering task from message queue and starts the rendering flow;

**First step of rendering is parsing HTML file**:

Browser starts a pre-parsing thread before parsing: scans resource references in advance, initiates network requests to download external resource files (like JS, CSS, images, videos, etc.) ahead of time. Of course, if main thread parses to style tag and CSS file hasn't finished downloading, it won't wait here but continues parsing subsequent HTML; but if it parses to script tag and JS file hasn't finished downloading, main thread will wait for JS file to download and parse JS code before continuing to parse subsequent HTML (because JS DOM operations may change initial DOM tree, JS code executes after initial DOM tree is built, then generates DOM tree);

After parsing HTML, DOM tree (tree structure of all formed DOM nodes) and CSSOM tree (tree structure generated after parsing CSS) are produced; browser maps CSSOM tree's style rules to DOM tree's DOM nodes to generate render tree (render tree only contains elements that need to be displayed, not including nodes with display set to none);

**Second step of rendering is layout (reflow)**, calculates element positions based on each node's geometric information in render tree (like element size, margin border, layer relationship (z-index), float, positioning) to generate layout tree;

**Third step of rendering is painting (repaint)**, after getting layout tree, layers the page based on layout tree (i.e., divides page content into multiple independent layers; when modifying layer content, only need to repaint that layer); browser then blocks each layer (e.g., a 2000px high layer might be divided into 8 blocks of 256px height), and rasterizes each block (converts each vector description to screen pixels), generating pixel data;

**Fourth step of rendering is compositing**: Browser merges all independent layers' pixel data through GPU according to visual hierarchy, and outputs to screen through display system;

### JS Engine Architecture

```
┌─────────────────────────────────────────┐
│            JavaScript Runtime            │
│     (Event Loop / Web API / Node API)   │
└─────────────────────────────────────────┘
                    ▲
                    │
┌─────────────────────────────────────────┐
│              JavaScript Engine           │
│                                         │
│  ┌────────── Frontend Code ───────────┐ │ (Compilation)
│  │ Lexer / Tokenizer                  │ │
│  │ Parser                             │ │
│  │ AST Builder                        │ │
└─────────────────────────────────────────┘
```

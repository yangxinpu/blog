# React Principles

### Fiber Architecture

The original React architecture was synchronous rendering (stack reconciler, through tree structure + recursive comparison of old and new DOM), meaning all DOM updates and calculations were completed in the main thread until all tasks finished; this process couldn't be interrupted, so if complex calculations or long synchronous tasks occurred during rendering, the UI would freeze, resulting in poor user experience;

Fiber architecture splits tasks into multiple small units (Fiber nodes), so React can pause current tasks during rendering, and dynamically adjust task execution order based on different task priorities, ensuring critical tasks complete as soon as possible without affecting user experience due to long calculations;

- Fiber Node: Each Fiber node represents a task unit (a Fiber node usually corresponds to a component), containing component state, UI element information, and other associated tasks; each node stores important properties like `effectTag` (indicating DOM update type), `nextEffect` (next update node), `return` (parent node pointer), Hook chain;

  ```text
  //Fiber node structure
  type Fiber = {
    tag: WorkTag;              // Type (Function component / Class component / DOM)
    type: any;                 // Component definition
    stateNode: any;            // DOM or instance

    return: Fiber | null;      // Parent node
    child: Fiber | null;       // Child node
    sibling: Fiber | null;     // Sibling node

    pendingProps: any;
    memoizedProps: any;

    memoizedState: any;        // hooks/state
    updateQueue: any;          // Update queue

    alternate: Fiber | null;   // Double buffering pointer

    flags: Flags;              // Side effect flags
    subtreeFlags: Flags;
  }
  ```

Fiber workflow:

1. Initialization Phase:
   - React starts rendering component tree, creating a Fiber node for each component; each Fiber node represents a component and holds that component's state, virtual DOM, and context information;
   - Fiber tree construction: React builds a Fiber tree based on virtual DOM structure;
     - Parent-child relationship: A Fiber node's `return` pointer points to its parent node, so React can backtrack to parent node when needed;
     - Sibling relationship: Each node's `next` pointer points to its sibling node, enabling React to traverse nodes at the same level in order;

     After creating these nodes, React puts them into work queue, ready for next phase processing;

2. Scheduling Phase: Also called reconciliation, diff phase
   - Task scheduling and priority: Each task (Fiber node) has a priority, React's scheduler dynamically decides when to execute which tasks based on these priorities, and can pause current task to execute higher priority tasks:
     1. Time slicing: It splits long tasks into small fragments and executes them gradually across multiple browser frames (a cycle of browser rendering page), thus avoiding blocking main thread;
     2. Task interruption: If higher priority task needs processing, React can interrupt current task and immediately execute high priority task;
   - Work loop: In scheduling phase, React traverses Fiber nodes and executes reconciliation process. Main tasks of reconciliation are:
     1. Calculate new virtual DOM: React calculates each component's update based on current state and props, generating new virtual DOM;
     2. Compare virtual DOM: React compares new virtual DOM with old virtual DOM, uses Diff algorithm to find differences, and sets `effectTag` for parts needing update;

3. Commit Phase:
   - React's commit phase executes synchronously and cannot be interrupted, completing in one go. It can be subdivided into three sub-phases:
     1. before mutation: Preparation phase before DOM changes
     2. mutation: Execute real DOM updates (insert, delete, update)
     3. layout: Synchronously execute `useLayoutEffect`, at this point DOM has been updated but not yet painted

     Additionally, `useEffect` belongs to passive effects, doesn't execute synchronously in commit phase, but is executed asynchronously by scheduler after browser completes painting

Double Buffering Mechanism:

By first calculating a new virtual DOM tree and comparing with current tree, finally synchronizing updates to real DOM; because React always maintains two Fiber trees during updates, it can compare, interrupt or resume operations at any time;

1. Create new virtual DOM tree: When React receives state update or props change, it doesn't directly modify current virtual DOM tree, but generates a new virtual DOM tree based on new state or props. This new tree is usually called `Next Tree`;
2. Compare virtual DOM trees: React uses virtual DOM's Diff algorithm to compare differences between `Current Tree` and `Next Tree`, calculating minimal update path. This process is called reconciliation;
3. Apply updates: In reconciliation phase, React calculates which parts need updating and generates an update plan. This plan is saved in `Next Tree`. Only after all updates are calculated and confirmed correct, React applies updates to real DOM;
4. Switch render tree: After updates complete, React replaces `Next Tree` (new virtual DOM tree) as `Current Tree`, using new virtual DOM tree as basis for next render;

### Diff Algorithm

Core mechanism for efficiently updating DOM; it calculates minimal DOM operations by comparing differences between old and new virtual DOM trees, thus avoiding performance loss from full DOM updates;

React Diff adopts depth-first, level-by-level traversal strategy, starting from root node and comparing level by level:

- Tree Diff (Level comparison): Only compares nodes at same level, doesn't compare across levels. If node moves across levels, React deletes old node and creates new node, rather than moving node;
- Component Diff: Different type components, directly destroy old component, create new component; Same type components: Update component props, recursively compare child nodes;
- Element Diff: For child element lists at same level, is the core and difficulty of Diff algorithm, divided into three situations:
  1. List comparison without key: React defaults to using index as key, has serious performance issues (when inserting elements at list head/middle, all subsequent elements are re-rendered, component state may be misplaced);
  2. List comparison with key: Establish mapping relationship between old and new nodes through key, achieving efficient add/delete/move operations;
  3. List Diff double-end comparison optimization: Compare head and tail nodes of old and new lists, find reusable nodes and mark move positions, finally process remaining nodes, greatly reducing move operations;

### Reactivity

React's reactivity is not automatic dependency collection like Vue (based on Proxy/getter-setter), but based on a more explicit, controllable model: State changes → Trigger re-render (render) → Generate new UI → Diff → Minimize DOM updates;

- Reactive trigger sources are only State / Props
- Explicit updates (call API to modify state), no automatic dependency collection, component-level re-render;

### React vs Vue Rendering Principles

**Virtual DOM and Diffing**

- **React**: Uses **JSX** (JavaScript + XML) syntax to describe component structure. Each component returns a virtual DOM through `render` method. React performs diffing based on new virtual DOM and current virtual DOM, then efficiently updates virtual DOM through **Fiber architecture**. React's Diff algorithm optimizes performance by splitting component tree into work units, making minimal updates based on node **key** and **type**.
- **Vue**: Vue also uses virtual DOM and diffing, but its implementation is relatively simple. Vue's **reactivity system** (based on `getter` and `setter`) triggers view updates by intercepting data changes, working with React's virtual DOM. Vue's Diff algorithm prioritizes comparing node differences from **key** and **tag**, but compared to React, Vue's virtual DOM updates may be simpler, Vue doesn't have work unit management like React's Fiber.

**Reactive Data and Dependency Tracking**

- **React**: React's updates are based on **state** and **props** changes. When component's state or props change, React triggers re-render. React itself doesn't have built-in reactive data system, it updates state through `setState`, and re-render triggering is controlled by virtual DOM comparison and scheduling system; When a component's **`state`** or **`props`** change, only that component and its downstream components are re-rendered;
- **Vue**: Vue is reactive, it tracks data changes through data proxy (reactivity system). Vue intercepts access to data through getter and setter on component's data object, thus implementing dependency tracking. When data changes, Vue knows which components need updating, avoiding unnecessary re-renders. Therefore, Vue usually doesn't need to do full virtual DOM comparison like React when data changes, it can directly and precisely know which parts need updating;

**Rendering Process: Synchronous vs Asynchronous**

- **React**: React 16 introduced **Fiber architecture**, making rendering process support asynchronous operations. React splits rendering tasks into multiple small work units (Fiber), these tasks execute across multiple browser frames. React uses **time-slicing** technology to allocate CPU time, ensuring high-priority tasks (like user interaction) execute first, avoiding long blocking. This enables React to respond more smoothly to user input when handling complex UI updates.
- **Vue**: Vue defaults to **synchronous rendering**, meaning when data changes, it immediately executes virtual DOM update and reflects on UI. However, Vue also provides **asynchronous rendering** support, mainly through `nextTick` method to implement delayed updates. Vue defers update tasks to next tick through event loop queue, thus avoiding updating DOM in same round of events, but Vue's asynchronous rendering mechanism isn't a multi-task scheduling system based on Fiber architecture like React;

**Update Mechanism: Batch Updates vs Single Updates**

- **React**: React uses **batch updates** when updating, merging multiple `setState` operations into one render task through scheduler queue. React schedules based on each task's priority, merging multiple updates into same batch, reducing unnecessary re-renders. This batch update mechanism makes React's UI updates more efficient.
- **Vue**: Vue also uses batch update mechanism, especially in multiple reactive data updates, Vue merges multiple data changes into one update task. Vue delays DOM updates through `nextTick` for batch updates in next event loop. Vue's mechanism makes view updates not execute repeatedly when reactive data is updated multiple times in short time.

**Performance Optimization: Differentiation Strategy**

- **React**: React uses **virtual DOM** and **Fiber** architecture to optimize performance. During virtual DOM comparison, React minimizes updates, and improves performance through asynchronous rendering and time-slicing technology. React also provides `shouldComponentUpdate` and `React.memo` methods, allowing developers to control when re-render is needed.
- **Vue**: Vue's performance optimization relies on its **reactivity system** and **virtual DOM**. Vue can avoid unnecessary rendering through precise dependency tracking. When data changes, Vue updates only the parts that need changing without re-rendering entire component. Vue also provides **computed** and **watchers** mechanisms to optimize view updates and reactive data flow.

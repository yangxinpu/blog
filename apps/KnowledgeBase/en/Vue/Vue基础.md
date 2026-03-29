# Vue Basics

### MVVM Architecture

MVVM is an architectural pattern that divides an application into three parts: Model (data layer), View (UI layer), and ViewModel (bridge layer between View and Model);

In Vue, the ViewModel is the Vue instance, which implements two-way data binding between View and Model through data binding and event listening mechanisms;

- **Model**: Represents the data model, can also be defined in Model for data modification and operations
- **View**: Represents the UI component, is responsible for displaying data to the user
- **ViewModel**: Listens for Model data changes and controls View updates, handles user interactions

### Compilation Principles

Vue's template compilation is the process of converting template strings into render functions;

1. **Parsing**: Parse the template string into an AST (Abstract Syntax Tree), which is a tree structure representing the template's syntax structure;
2. **Optimization**: Traverse the AST, mark static nodes (nodes that don't change), for static node skipping during subsequent updates, improving performance;
3. **Code Generation**: Convert the AST into a render function string, which is ultimately used to generate the Virtual DOM;

### Rendering Principles

Vue's rendering process is the process of converting Virtual DOM to real DOM;

1. **Create Virtual DOM**: Call the render function to generate Virtual DOM;
2. **Diff Algorithm**: Compare the differences between old and new Virtual DOM;
3. **Patch**: Apply the differences to the real DOM;

### Virtual DOM

Virtual DOM is a lightweight JavaScript object that represents the real DOM structure; it uses JavaScript objects to describe DOM structure, then generates real DOM through specific methods;

Advantages of Virtual DOM:

- **Cross-platform**: Virtual DOM is JavaScript objects, can run on any platform that supports JavaScript;
- **Performance optimization**: Through Diff algorithm, minimize DOM operations, improving performance;
- **Batch updates**: Multiple data updates can be merged into one DOM operation;

### Diff Algorithm

Vue's Diff algorithm is an algorithm for comparing differences between old and new Virtual DOM; it uses a **double-end comparison** strategy, comparing from both ends of the old and new Virtual DOM;

**Comparison strategy**:

1. Compare old start node with new start node
2. Compare old end node with new end node
3. Compare old start node with new end node
4. Compare old end node with new start node

If none of the above comparisons match, then search for a matching node by key;

**Key's role**:

- **Identify nodes**: Through key, Vue can more accurately determine whether a node is reusable;
- **Improve performance**: With key, Vue can minimize DOM operations;

### Component Communication

#### Parent to Child (Props)

Parent component passes data to child component through props;

```vue
<!-- Parent component -->
<template>
  <div>
    <Child :message="parentMessage" />
  </div>
</template>

<script>
import Child from './Child.vue';

export default {
  components: { Child },
  data() {
    return {
      parentMessage: 'Hello from parent',
    };
  },
};
</script>

<!-- Child component -->
<template>
  <div>
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
  },
};
</script>
```

#### Child to Parent ($emit)

Child component passes data to parent component through events;

```vue
<!-- Child component -->
<template>
  <button @click="sendMessage">Send Message</button>
</template>

<script>
export default {
  methods: {
    sendMessage() {
      this.$emit('message-sent', 'Hello from child');
    },
  },
};
</script>

<!-- Parent component -->
<template>
  <div>
    <Child @message-sent="handleMessage" />
  </div>
</template>

<script>
import Child from './Child.vue';

export default {
  components: { Child },
  methods: {
    handleMessage(message) {
      console.log(message);
    },
  },
};
</script>
```

#### Sibling Components (Event Bus or Vuex)

Sibling components can communicate through Event Bus or Vuex;

**Event Bus**:

```javascript
// event-bus.js
import Vue from 'vue';
export const EventBus = new Vue();

// Component A
import { EventBus } from './event-bus';
EventBus.$emit('event-name', data);

// Component B
import { EventBus } from './event-bus';
EventBus.$on('event-name', (data) => {
  console.log(data);
});
```

#### Cross-level Components (provide/inject)

Ancestor components provide data through provide, descendant components inject data through inject;

```vue
<!-- Ancestor component -->
<script>
export default {
  provide() {
    return {
      theme: 'dark',
    };
  },
};
</script>

<!-- Descendant component -->
<script>
export default {
  inject: ['theme'],
  created() {
    console.log(this.theme); // 'dark'
  },
};
</script>
```

### Lifecycle Hooks

Each Vue instance goes through a series of initialization steps when created;

#### Creation Phase

- **beforeCreate**: Called after instance initialization, before data observation and event/watcher setup
- **created**: Called after instance creation, at this point data observation, property and method operations, watch/event callbacks are completed, but the mounting phase hasn't started, `$el` property is not yet available

#### Mounting Phase

- **beforeMount**: Called before mounting begins, render function is about to be called for the first time
- **mounted**: Called after instance is mounted, at this point `el` is replaced by the newly created `vm.$el`

#### Update Phase

- **beforeUpdate**: Called when data changes, before the virtual DOM re-renders and applies patches
- **updated**: Called after virtual DOM re-renders and patches due to data changes

#### Destruction Phase

- **beforeDestroy**: Called before instance destruction, at this point the instance is still fully available
- **destroyed**: Called after instance destruction, all event listeners and child components are destroyed

### Computed Properties and Watchers

#### Computed Properties

Computed properties are derived values based on their dependencies, cached, only re-evaluated when dependencies change;

```vue
<template>
  <div>
    <p>Original: {{ message }}</p>
    <p>Reversed: {{ reversedMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello',
    };
  },
  computed: {
    reversedMessage() {
      return this.message.split('').reverse().join('');
    },
  },
};
</script>
```

#### Watchers

Watchers are used to perform asynchronous or expensive operations in response to data changes;

```vue
<script>
export default {
  data() {
    return {
      question: '',
    };
  },
  watch: {
    question(newQuestion, oldQuestion) {
      if (newQuestion.indexOf('?') > -1) {
        this.getAnswer();
      }
    },
  },
  methods: {
    getAnswer() {
      // Asynchronous operation
    },
  },
};
</script>
```

### Directives

Vue directives are special attributes starting with `v-`;

#### v-bind

Dynamically bind one or more attributes to expressions;

```vue
<template>
  <img v-bind:src="imageSrc" />
  <img :src="imageSrc" />
</template>
```

#### v-on

Listen to DOM events;

```vue
<template>
  <button v-on:click="handleClick">Click</button>
  <button @click="handleClick">Click</button>
</template>
```

#### v-model

Create two-way binding on form input elements;

```vue
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script>
export default {
  data() {
    return {
      message: '',
    };
  },
};
</script>
```

#### v-if / v-else / v-else-if

Conditionally render elements;

```vue
<template>
  <div v-if="type === 'A'">A</div>
  <div v-else-if="type === 'B'">B</div>
  <div v-else>C</div>
</template>
```

#### v-show

Toggle element's display CSS property;

```vue
<template>
  <div v-show="isVisible">Visible</div>
</template>
```

#### v-for

Render a list based on an array;

```vue
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</template>
```

### Custom Directives

In addition to default directives, Vue allows registration of custom directives;

```javascript
// Global registration
Vue.directive('focus', {
  inserted: function (el) {
    el.focus();
  },
});

// Local registration
export default {
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      },
    },
  },
};
```

### Filters

Filters are used for text formatting;

```vue
<template>
  <p>{{ message | capitalize }}</p>
</template>

<script>
export default {
  filters: {
    capitalize(value) {
      if (!value) return '';
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
};
</script>
```

### Mixins

Mixins are a flexible way to distribute reusable functionality in Vue components;

```javascript
// mixin.js
export const myMixin = {
  data() {
    return {
      mixinData: 'from mixin',
    };
  },
  methods: {
    mixinMethod() {
      console.log('mixin method');
    },
  },
};

// Component
import { myMixin } from './mixin';

export default {
  mixins: [myMixin],
  created() {
    console.log(this.mixinData);
    this.mixinMethod();
  },
};
```

### Plugins

Plugins are used to add global-level functionality to Vue;

```javascript
// plugin.js
const MyPlugin = {
  install(Vue, options) {
    Vue.globalMethod = function () {
      console.log('global method');
    };

    Vue.directive('my-directive', {
      bind(el, binding, vnode, oldVnode) {
        // Directive logic
      },
    });

    Vue.mixin({
      created: function () {
        // Mixin logic
      },
    });

    Vue.prototype.$myMethod = function (methodOptions) {
      console.log('instance method');
    };
  },
};

export default MyPlugin;

// Use plugin
import MyPlugin from './plugin';
Vue.use(MyPlugin, { someOption: true });
```

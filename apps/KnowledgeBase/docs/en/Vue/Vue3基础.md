# Vue3 Basics

### Building Vue3 Projects

#### Using Vite

```bash
npm create vite@latest my-vue-app -- --template vue
cd my-vue-app
npm install
npm run dev
```

#### Using Vue CLI

```bash
npm install -g @vue/cli
vue create my-vue-app
cd my-vue-app
npm run serve
```

### Style Configuration

#### Scoped Styles

Vue3 supports scoped styles, styles only apply to current component;

```vue
<template>
  <div class="container">
    <h1>Hello Vue3</h1>
  </div>
</template>

<style scoped>
.container {
  color: red;
}
</style>
```

#### CSS Modules

```vue
<template>
  <div :class="$style.container">
    <h1>Hello Vue3</h1>
  </div>
</template>

<style module>
.container {
  color: red;
}
</style>
```

### Composition API

Composition API is a new feature in Vue3, it allows better organization and reuse of component logic;

#### setup Function

The setup function is the entry point for Composition API;

```vue
<script>
import { ref, reactive } from 'vue';

export default {
  setup() {
    const count = ref(0);
    const state = reactive({
      name: 'Vue3',
    });

    function increment() {
      count.value++;
    }

    return {
      count,
      state,
      increment,
    };
  },
};
</script>
```

#### Script Setup

`<script setup>` is a compile-time syntactic sugar that simplifies the use of Composition API;

```vue
<script setup>
import { ref, reactive } from 'vue';

const count = ref(0);
const state = reactive({
  name: 'Vue3',
});

function increment() {
  count.value++;
}
</script>

<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

### Lifecycle

Vue3's lifecycle hooks are similar to Vue2, but with some changes in naming and usage;

#### Options API

- `beforeCreate` → Use `setup()`
- `created` → Use `setup()`
- `beforeMount` → `onBeforeMount`
- `mounted` → `onMounted`
- `beforeUpdate` → `onBeforeUpdate`
- `updated` → `onUpdated`
- `beforeUnmount` → `onBeforeUnmount`
- `unmounted` → `onUnmounted`

#### Composition API

```vue
<script setup>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'vue';

onBeforeMount(() => {
  console.log('Before mount');
});

onMounted(() => {
  console.log('Mounted');
});

onBeforeUpdate(() => {
  console.log('Before update');
});

onUpdated(() => {
  console.log('Updated');
});

onBeforeUnmount(() => {
  console.log('Before unmount');
});

onUnmounted(() => {
  console.log('Unmounted');
});
</script>
```

### Reactivity Principles

Vue3 uses Proxy to implement the reactivity system, which is more powerful and efficient than Vue2's Object.defineProperty;

#### ref

Used to create reactive primitive values;

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

function increment() {
  count.value++;
}
</script>

<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

#### reactive

Used to create reactive objects;

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({
  name: 'Vue3',
  count: 0,
});

function increment() {
  state.count++;
}
</script>

<template>
  <div>
    <p>{{ state.name }}</p>
    <p>{{ state.count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

#### computed

Used to create computed properties;

```vue
<script setup>
import { ref, computed } from 'vue';

const count = ref(0);
const doubledCount = computed(() => count.value * 2);
</script>
```

#### watch and watchEffect

Used to listen for reactive data changes;

```vue
<script setup>
import { ref, watch, watchEffect } from 'vue';

const count = ref(0);

watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

watchEffect(() => {
  console.log(`Count is ${count.value}`);
});
</script>
```

### toRef and toRefs

Used to create refs for reactive object properties;

```vue
<script setup>
import { reactive, toRef, toRefs } from 'vue';

const state = reactive({
  name: 'Vue3',
  count: 0,
});

const nameRef = toRef(state, 'name');
const { name, count } = toRefs(state);
</script>
```

### Provide and Inject

Used for cross-component data passing;

```vue
<!-- Parent component -->
<script setup>
import { provide, ref } from 'vue';

const theme = ref('dark');
provide('theme', theme);
</script>

<!-- Child component -->
<script setup>
import { inject } from 'vue';

const theme = inject('theme');
</script>
```

### Template Refs

Used to get DOM element references;

```vue
<script setup>
import { ref, onMounted } from 'vue';

const inputRef = ref(null);

onMounted(() => {
  inputRef.value.focus();
});
</script>

<template>
  <input ref="inputRef" />
</template>
```

### Custom Hooks

Custom hooks are a way to reuse logic in Vue3;

```javascript
// useCounter.js
import { ref } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  return {
    count,
    increment,
    decrement,
  };
}
```

```vue
<script setup>
import { useCounter } from './useCounter';

const { count, increment, decrement } = useCounter(10);
</script>

<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>
```

### Suspense

Suspense is used to handle asynchronous components;

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(
  () => import('./AsyncComponent.vue')
);
</script>
```

### Teleport

Teleport is used to render component content to a specified DOM node;

```vue
<template>
  <Teleport to="body">
    <div class="modal">This will be rendered in body</div>
  </Teleport>
</template>
```

### Fragments

Vue3 supports multiple root nodes;

```vue
<template>
  <header>Header</header>
  <main>Main content</main>
  <footer>Footer</footer>
</template>
```

### v-model Changes

Vue3's v-model has some changes;

```vue
<!-- Vue2 -->
<CustomInput v-model="value" />

<!-- Vue3 -->
<CustomInput v-model="value" />
<CustomInput v-model:title="title" />
```

```vue
<!-- CustomInput.vue -->
<script setup>
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

### v-bind Changes

Vue3 supports binding all attributes of an object;

```vue
<script setup>
const attrs = {
  id: 'container',
  class: 'wrapper',
};
</script>

<template>
  <div v-bind="attrs"></div>
</template>
```

# Vue3 Advanced

### Routing

Vue Router is the official router for Vue.js;

#### Installation

```bash
npm install vue-router@4
```

#### Basic Configuration

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

#### Route Components

```vue
<template>
  <div>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-view />
  </div>
</template>
```

#### useRoute and useRouter

```vue
<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

console.log(route.params)
console.log(route.query)

function navigate() {
  router.push('/about')
}
</script>
```

#### Route Guards

```javascript
const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  console.log('Before each')
  next()
})

router.afterEach((to, from) => {
  console.log('After each')
})
```

### Pinia

Pinia is the official state management library for Vue;

#### Installation

```bash
npm install pinia
```

#### Basic Configuration

```javascript
// stores/counter.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  return { count, doubleCount, increment }
})
```

```javascript
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

#### Using Store in Components

```vue
<script setup>
import { useCounterStore } from '../stores/counter'

const counter = useCounterStore()

console.log(counter.count)
console.log(counter.doubleCount)
counter.increment()
</script>

<template>
  <div>
    <p>{{ counter.count }}</p>
    <p>{{ counter.doubleCount }}</p>
    <button @click="counter.increment">Increment</button>
  </div>
</template>
```

#### Actions

```javascript
// stores/user.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  
  async function login(credentials) {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    user.value = await response.json()
  }
  
  function logout() {
    user.value = null
  }
  
  return { user, login, logout }
})
```

#### Getters

```javascript
// stores/products.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  
  const availableProducts = computed(() => 
    products.value.filter(p => p.stock > 0)
  )
  
  const getProductById = computed(() => {
    return (id) => products.value.find(p => p.id === id)
  })
  
  return { products, availableProducts, getProductById }
})
```

#### Persisting State

```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const savedUser = localStorage.getItem('user')
  const user = ref(savedUser ? JSON.parse(savedUser) : null)
  
  function setUser(newUser) {
    user.value = newUser
    localStorage.setItem('user', JSON.stringify(newUser))
  }
  
  return { user, setUser }
})
```

### TypeScript Support

Vue3 provides excellent TypeScript support;

#### Component Definition

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

const user = ref<User | null>(null)
const userName = computed(() => user.value?.name ?? 'Guest')

function updateUser(newUser: User) {
  user.value = newUser
}
</script>
```

#### Props Definition

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})
</script>
```

#### Emits Definition

```vue
<script setup lang="ts">
interface Emits {
  (e: 'update', value: number): void
  (e: 'delete', id: string): void
}

const emit = defineEmits<Emits>()

function handleUpdate() {
  emit('update', 10)
}
</script>
```

### Performance Optimization

#### Lazy Loading Components

```javascript
const AsyncComponent = defineAsyncComponent(() => 
  import('./components/AsyncComponent.vue')
)
```

#### v-memo

Used to cache sub-trees;

```vue
<template>
  <div v-for="item in list" :key="item.id" v-memo="[item.selected]">
    {{ item.name }}
  </div>
</template>
```

#### Virtual Scrolling

For long lists, use virtual scrolling to improve performance;

```vue
<script setup>
import { ref } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const items = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`
})))
</script>

<template>
  <RecycleScroller
    :items="items"
    :item-size="50"
    key-field="id"
  >
    <template #default="{ item }">
      <div>{{ item.name }}</div>
    </template>
  </RecycleScroller>
</template>
```

### Testing

#### Unit Testing with Vitest

```javascript
// counter.test.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

describe('Counter', () => {
  it('renders properly', () => {
    const wrapper = mount(Counter)
    expect(wrapper.text()).toContain('0')
  })
  
  it('increments on click', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('1')
  })
})
```

### Best Practices

#### Component Organization

```
components/
  ├── common/
  │   ├── Button.vue
  │   └── Input.vue
  ├── layout/
  │   ├── Header.vue
  │   └── Footer.vue
  └── features/
      ├── UserCard.vue
      └── ProductList.vue
```

#### Naming Conventions

- Components: PascalCase (e.g., `UserProfile.vue`)
- Props: camelCase in JavaScript, kebab-case in templates
- Events: kebab-case (e.g., `@update-user`)

#### Code Style

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  title: String
})

const emit = defineEmits(['update'])

const count = ref(0)
const doubledCount = computed(() => count.value * 2)

onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <div>
    <h1>{{ props.title }}</h1>
    <p>{{ count }}</p>
    <button @click="emit('update')">Update</button>
  </div>
</template>

<style scoped>
div {
  padding: 20px;
}
</style>
```

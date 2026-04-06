import { ssrRenderAttrs } from 'vue/server-renderer';
import { useSSRContext } from 'vue';
import { _ as _export_sfc } from './plugin-vue_export-helper.1tPrXgE0.js';
const __pageData = JSON.parse(
  '{"title":"React原理","description":"","frontmatter":{},"headers":[],"relativePath":"zh/React/React原理.md","filePath":"zh/React/React原理.md"}'
);
const _sfc_main = { name: 'zh/React/React原理.md' };
function _sfc_ssrRender(
  _ctx,
  _push,
  _parent,
  _attrs,
  $props,
  $setup,
  $data,
  $options
) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="react原理" tabindex="-1">React原理 <a class="header-anchor" href="#react原理" aria-label="Permalink to &quot;React原理&quot;">​</a></h1><h3 id="fiber-架构" tabindex="-1">Fiber 架构 <a class="header-anchor" href="#fiber-架构" aria-label="Permalink to &quot;Fiber 架构&quot;">​</a></h3><p>原来的React架构是同步渲染的（堆栈协调器，通过树形结构 + 递归对比新旧DOM），即所有的DOM更新和计算都在主线程中完成，直到所有任务完成；这个过程无法打断，因此如果渲染过程中发生复杂计算或者长时间的同步任务，UI就会卡顿，用户体验较差；</p><p>Fiber架构则将任务切分成多个小的单元（Fiber节点），这样，React可以在渲染过程中暂停当前任务，并根据不同任务的优先级来动态调整任务执行的顺序，确保关键任务能够尽快完成，而不会因为长时间的计算而影响用户体验；</p><ul><li><p>Fiber节点：每个Fiber节点表示一个任务单元（一个Fiber节点通常对应一个组件），包含组件的状态、UI元素的信息以及与其关联的其他任务；每个节点存储着一些重要的属性，如<code>effectTag</code>（表示需要更新的DOM类型），<code>nextEffect</code>（下一个更新节点），<code>return</code>（指向父节点），Hook链；</p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//Fiber节点的结构</span></span>
<span class="line"><span>type Fiber = {</span></span>
<span class="line"><span>  tag: WorkTag;              // 类型（函数组件 / 类组件 / DOM）</span></span>
<span class="line"><span>  type: any;                 // 组件定义</span></span>
<span class="line"><span>  stateNode: any;            // DOM 或实例</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return: Fiber | null;      // 父节点</span></span>
<span class="line"><span>  child: Fiber | null;       // 子节点</span></span>
<span class="line"><span>  sibling: Fiber | null;     // 兄弟节点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  pendingProps: any;</span></span>
<span class="line"><span>  memoizedProps: any;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  memoizedState: any;        // hooks/state</span></span>
<span class="line"><span>  updateQueue: any;          // 更新队列</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  alternate: Fiber | null;   // 双缓存指针</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  flags: Flags;              // 副作用标记</span></span>
<span class="line"><span>  subtreeFlags: Flags;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br></div></div></li></ul><p>Fiber的工作流程：</p><ol><li><p>初始化阶段：</p><ul><li><p>React开始渲染组件树，并为每个组件创建一个Fiber节点；每个Fiber节点代表一个组件，并且会持有该组件的状态、虚拟DOM及上下文信息；</p></li><li><p>Fiber树的构建：React会根据虚拟DOM的结构构建一棵Fiber树；</p><ul><li>父节点和子节点关系：一个Fiber节点的<code>return</code>指针指向它的父节点，这样React可以在需要的时候回溯到父节点进行操作；</li><li>兄弟节点关系：每个节点的<code>next</code>指针指向其兄弟节点，这使得React能够按顺序遍历同一级别的节点；</li></ul><p>在创建完这些节点后，React会将其放入工作队列中，准备进入下一阶段的处理；</p></li></ul></li><li><p>调度阶段：又称协调，diff阶段</p><ul><li>任务调度与优先级：每个任务（Fiber节点）都有一个优先级，React的调度器会根据这些优先级动态地决定何时执行哪些任务，并且可以暂停当前任务，执行更高优先级的任务： <ol><li>时间切片：它将长时间任务拆分成小的片段，并在多个浏览器帧之间逐步执行（浏览器中渲染页面的一个周期），从而避免阻塞主线程；</li><li>任务中断：如果有更高优先级的任务需要处理，React可以中断当前的任务，并立即执行高优先级任务；</li></ol></li><li>工作循环：在调度阶段，React会遍历Fiber节点并执行协调过程。协调过程的主要任务是： <ol><li>计算新的虚拟DOM：React会根据当前的状态和props计算每个组件的更新，生成新的虚拟DOM；</li><li>比较虚拟DOM：React会将新的虚拟DOM与旧的虚拟DOM进行比较，使用Diff算法找出两者之间的差异，并为需要更新的部分设置<code>effectTag</code>；</li></ol></li></ul></li><li><p>提交阶段：</p><ul><li><p>React 的提交阶段是同步执行的，并且不可中断，一次性完成，它可以细分为三个子阶段：</p><ol><li>before mutation：DOM 变更前的准备阶段</li><li>mutation：执行真实 DOM 更新（插入、删除、更新）</li><li>layout：同步执行 <code>useLayoutEffect</code>，此时 DOM 已更新但尚未绘制</li></ol><p>此外，<code>useEffect</code> 属于被动副作用（passive effects），不会在 commit 阶段同步执行，而是由调度器在浏览器完成绘制后异步执行</p></li></ul></li></ol><p>双缓存机制：</p><p>通过先计算出一个新的虚拟DOM树并与当前树进行比较，最终才将更新同步到真实DOM中；因为React更新时总是维护两课Fiber树，所有可以随时进行比较，中断或恢复等操作；</p><ol><li>创建新的虚拟DOM树：当React收到状态更新或props变化时，它不会直接修改当前的虚拟DOM树，而是会根据新的状态或props生成一棵新的虚拟DOM树。这个新的树通常称为<code>Next Tree</code>；</li><li>比较虚拟DOM树：React使用虚拟DOM的Diff算法对比<code>Current Tree</code>和<code>Next Tree</code>之间的差异，计算出最小的更新路径。这一过程被称为协调；</li><li>应用更新：在协调阶段，React会计算出哪些部分需要更新，并生成一份更新计划。这个计划会被保存在<code>Next Tree</code>中。只有在所有的更新都被计算完毕并确定无误后，React才会将更新应用到真实的DOM中；</li><li>切换渲染树：更新完成后，React会将<code>Next Tree</code>（新的虚拟DOM树）替换为<code>Current Tree</code>，即使用新的虚拟DOM树作为下次渲染的基础；</li></ol><h3 id="diff-算法" tabindex="-1">diff 算法 <a class="header-anchor" href="#diff-算法" aria-label="Permalink to &quot;diff 算法&quot;">​</a></h3><p>用于高效更新DOM的核心机制；它通过对比新旧虚拟 DOM树的差异，计算出最小的 DOM 操作量，从而避免全量更新 DOM 带来的性能损耗；</p><p>React Diff 采用深度优先、分层遍历策略，从根节点开始逐层比对：</p><ul><li>Tree Diff（层级比对）：只比较同一层级的节点，不跨层级比较，若节点跨层级移动，React 会删除旧节点并创建新节点，而非移动节点</li><li>Component Diff（组件比对）：不同类型组件，直接销毁旧组件，创建新组件；相同类型组件：更新组件 props，递归比对子节点；</li><li>Element Diff（元素比对）：针对同一层级的子元素列表，是 Diff 算法的核心与难点，分为三种情况： <ol><li>无 key 的列表比对：React 默认使用索引 index作为 key，存在严重性能问题（列表头部 / 中间插入元素时，所有后续元素都会被重新渲染，组件状态可能错位）</li><li>有 key 的列表比对：通过 key 建立新旧节点的映射关系，实现高效增删改移：</li><li>列表 Diff 的双端比对优化：比较新旧列表的首尾节点，寻找可复用节点并标记移动位置，最后处理剩余节点，大幅减少移动操作次数；</li></ol></li></ul><h3 id="响应式" tabindex="-1">响应式 <a class="header-anchor" href="#响应式" aria-label="Permalink to &quot;响应式&quot;">​</a></h3><p>React 的响应式并不是像 Vue（基于 Proxy / getter-setter）那样的自动依赖收集，而是基于一种更明确、可控的模型：状态变化 → 触发重新渲染（render） → 生成新 UI → Diff → 最小化更新 DOM；</p><ul><li>响应式触发源只有State / Props</li><li>显式更新（调用 API 修改状态），无自动依赖收集，组件级重渲染；</li></ul><h3 id="react和vue渲染原理区别" tabindex="-1">React和vue渲染原理区别 <a class="header-anchor" href="#react和vue渲染原理区别" aria-label="Permalink to &quot;React和vue渲染原理区别&quot;">​</a></h3><p><strong>虚拟 DOM 和差异比较（Diffing）</strong></p><ul><li><p><strong>React</strong>：使用 <strong>JSX</strong>（JavaScript + XML）语法来描述组件结构。每个组件通过 <code>render</code> 方法返回一个虚拟 DOM。React 会根据新的虚拟 DOM 和当前的虚拟 DOM 进行差异比较（diffing），然后通过 <strong>Fiber 架构</strong>来高效更新虚拟 DOM。React 的 Diff 算法通过将组件树拆分成工作单元来优化性能，它根据节点的 <strong>key</strong> 和 <strong>类型</strong> 来做最小化更新。</p></li><li><p><strong>Vue</strong>：Vue 也使用虚拟 DOM 和差异比较，但它的实现相对简洁。Vue 的 <strong>响应式系统</strong>（基于 <code>getter</code> 和 <code>setter</code>）通过拦截数据的变化来触发视图更新，和 React 的虚拟 DOM 配合工作。Vue 的 Diff 算法会优先从 <strong>key</strong> 和 <strong>tag</strong> 来比较节点差异，但相较于 React，Vue 的虚拟 DOM 更新可能会更简单，Vue 没有类似 React 中的 Fiber 这样的工作单元管理。</p><p><strong>响应式数据和依赖追踪</strong></p></li><li><p><strong>React</strong>：React 的更新是基于 <strong>state</strong> 和 <strong>props</strong> 的变化。当组件的 state 或 props 发生变化时，React 会触发重新渲染。React 本身没有内建的响应式数据系统，它通过 <code>setState</code> 更新状态，而重新渲染的触发是由虚拟 DOM 的比较和调度系统控制的；当某个组件的 <strong><code>state</code></strong> 或 <strong><code>props</code></strong> 发生变化时，只有这个组件和其下游组件会被重新渲染；</p></li><li><p><strong>Vue</strong>：Vue 是响应式的，它通过数据代理（reactivity system）来追踪数据的变化。Vue 会在组件的 data 对象上通过 getter 和 setter 拦截对数据的访问，从而实现依赖追踪。当数据变化时，Vue 知道哪些组件需要更新，避免不必要的重新渲染。因此，Vue 在数据变动时通常不需要像 React 一样做完全的虚拟 DOM 对比，它可以直接精确地知道哪些部分需要更新；</p><p><strong>渲染流程：同步 vs 异步</strong></p></li><li><p><strong>React</strong>：React 16 引入了 <strong>Fiber 架构</strong>，使得渲染流程支持异步操作。React 会将渲染任务分成多个小的工作单元（Fiber），这些任务会在多个浏览器帧之间执行。React 使用 <strong>时间切片</strong> 技术（time-slicing）来分配 CPU 时间，确保高优先级任务（如用户交互）能够优先执行，避免长时间的阻塞。这使得 React 在处理复杂 UI 更新时，能够更流畅地响应用户输入。</p></li><li><p><strong>Vue</strong>：Vue 默认使用 <strong>同步渲染</strong>，即在数据变化时，会立即执行虚拟 DOM 更新并反映在 UI 上。然而，Vue 也提供了 <strong>异步渲染</strong> 的支持，主要通过 <code>nextTick</code> 方法来实现延迟更新。Vue 通过事件循环队列将更新任务推迟到下一个 tick，从而避免在同一轮事件中更新 DOM，但 Vue 的异步渲染机制并不像 React 那样基于 Fiber 架构的多任务调度系统；</p></li></ul><p><strong>更新机制：批量更新 vs 单次更新</strong></p><ul><li><strong>React</strong>：React 在更新时使用 <strong>批量更新</strong>，通过调度队列（scheduler）将多个 <code>setState</code> 操作合并成一个渲染任务。React 会根据每个任务的优先级进行调度，并将多个更新合并到同一个批次中，减少不必要的重渲染。这种批量更新机制使得 React 的 UI 更新更加高效。</li><li><strong>Vue</strong>：Vue 也使用批量更新机制，尤其是在多个响应式数据的更新中，Vue 会将多个数据变化合并成一个更新任务。Vue 通过 <code>nextTick</code> 来延迟 DOM 更新，以便在下一次事件循环时进行批量更新。Vue 的这种机制使得在短时间内多次更新响应式数据时，视图的更新不会重复执行。</li></ul><p><strong>性能优化：差异化策略</strong></p><ul><li><strong>React</strong>：React 使用 <strong>虚拟 DOM</strong> 和 <strong>Fiber</strong> 架构来优化性能。在虚拟 DOM 的比较过程中，React 尽量将更新的最小化，并通过异步渲染和时间切片技术提升性能。React 还提供了 <code>shouldComponentUpdate</code> 和 <code>React.memo</code> 等手段，允许开发者控制何时需要重新渲染。</li><li><strong>Vue</strong>：Vue 的性能优化依赖于其 <strong>响应式系统</strong> 和 <strong>虚拟 DOM</strong>。Vue 通过精确追踪依赖，能够避免不必要的渲染。当数据发生变化时，Vue 会更新仅需变化的部分而不重新渲染整个组件。Vue 还提供了 <strong>computed</strong> 和 <strong>watchers</strong> 等机制来优化视图更新和响应式数据流。</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    'zh/React/React原理.md'
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const React__ = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['ssrRender', _sfc_ssrRender],
]);
export { __pageData, React__ as default };

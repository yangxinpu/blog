import { ssrRenderAttrs } from 'vue/server-renderer';
import { useSSRContext } from 'vue';
import { _ as _export_sfc } from './plugin-vue_export-helper.1tPrXgE0.js';
const __pageData = JSON.parse(
  '{"title":"","description":"","frontmatter":{"layout":"home","hero":{"name":"NaiLuo 知识库","text":"前端技术学习笔记","tagline":"React · Vue","actions":[{"theme":"brand","text":"React 笔记","link":"/zh/React/React基础"},{"theme":"alt","text":"Vue 笔记","link":"/zh/Vue/Vue基础"}]},"features":[{"icon":{"src":"https://cdn.simpleicons.org/react/61DAFB"},"title":"React","details":"React 基础、React 提高、React 原理","link":"/zh/React/React基础"},{"icon":{"src":"https://cdn.simpleicons.org/vuedotjs/4FC08D"},"title":"Vue","details":"Vue 基础、Vue3 基础、Vue3 提高","link":"/zh/Vue/Vue基础"}]},"headers":[],"relativePath":"zh/index.md","filePath":"zh/index.md"}'
);
const _sfc_main = { name: 'zh/index.md' };
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
  _push(`<div${ssrRenderAttrs(_attrs)}></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    'zh/index.md'
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['ssrRender', _sfc_ssrRender],
]);
export { __pageData, index as default };

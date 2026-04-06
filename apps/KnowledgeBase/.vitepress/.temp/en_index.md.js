import { ssrRenderAttrs } from 'vue/server-renderer';
import { useSSRContext } from 'vue';
import { _ as _export_sfc } from './plugin-vue_export-helper.1tPrXgE0.js';
const __pageData = JSON.parse(
  '{"title":"","description":"","frontmatter":{"layout":"home","hero":{"name":"NaiLuo Knowledge Base","text":"Frontend Tech Learning Notes","tagline":"React · Vue","actions":[{"theme":"brand","text":"React Notes","link":"/en/React/React基础"},{"theme":"alt","text":"Vue Notes","link":"/en/Vue/Vue基础"}]},"features":[{"icon":{"src":"https://cdn.simpleicons.org/react/61DAFB"},"title":"React","details":"React Basics, React Advanced, React Principles","link":"/en/React/React基础"},{"icon":{"src":"https://cdn.simpleicons.org/vuedotjs/4FC08D"},"title":"Vue","details":"Vue Basics, Vue3 Basics, Vue3 Advanced","link":"/en/Vue/Vue基础"}]},"headers":[],"relativePath":"en/index.md","filePath":"en/index.md"}'
);
const _sfc_main = { name: 'en/index.md' };
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
    'en/index.md'
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['ssrRender', _sfc_ssrRender],
]);
export { __pageData, index as default };

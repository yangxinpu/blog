import { ssrRenderAttrs } from 'vue/server-renderer';
import { useSSRContext } from 'vue';
import { _ as _export_sfc } from './plugin-vue_export-helper.1tPrXgE0.js';
const __pageData = JSON.parse(
  '{"title":"公共资源目录","description":"","frontmatter":{},"headers":[],"relativePath":"public/README.md","filePath":"public/README.md"}'
);
const _sfc_main = { name: 'public/README.md' };
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
  _push(
    `<div${ssrRenderAttrs(_attrs)}><h1 id="公共资源目录" tabindex="-1">公共资源目录 <a class="header-anchor" href="#公共资源目录" aria-label="Permalink to &quot;公共资源目录&quot;">​</a></h1><p>将静态资源放在此目录，如：</p><ul><li>logo.png - 站点 Logo</li><li>favicon.ico - 网站图标</li><li>images/ - 图片资源</li></ul><p>这些资源可以通过 <code>/logo.png</code> 直接访问。</p></div>`
  );
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    'public/README.md'
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['ssrRender', _sfc_ssrRender],
]);
export { __pageData, README as default };

/// <reference types="vitepress/client" />

interface ImportMetaEnv {
  readonly VITEPRESS_BASE: string
  readonly VITEPRESS_KB_URL: string
  readonly VITEPRESS_BLOG_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

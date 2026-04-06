# SKILL: blog

## 1. Overview

This skill enables Codex to design, generate, optimize, and maintain a personal blog or portfolio website with a strong focus on:

- UI/UX quality
- Performance (Lighthouse)
- SEO optimization
- Maintainable frontend architecture
- Markdown-driven content systems

This skill is intended for frontend-heavy workflows and personal branding sites.

---

## 2. When To Use

Trigger this skill when user intent includes:

### Blog Creation
- "build a blog"
- "create personal website"
- "portfolio site"

### UI Optimization
- "optimize my blog UI"
- "make my blog look modern"
- "improve readability"

### Content System
- "markdown blog system"
- "article rendering"
- "docs website"

### Performance / SEO
- "improve lighthouse score"
- "SEO optimization"

---

## 3. Default Assumptions

If user does NOT specify:

| Aspect       | Default Choice    |
| ------------ | ----------------- |
| Framework    | React (with Vite) |
| Styling      | TailwindCSS       |
| Routing      | React Router      |
| Content      | Markdown          |
| Highlighting | Prism.js          |
| Deployment   | Vercel            |

---

## 4. Architecture Design

### 4.1 Project Structure
/src
/components
Header.tsx
Footer.tsx
BlogCard.tsx
/pages
Home.tsx
Article.tsx
/hooks
/utils
/styles
/content
posts/
hello-world.md
/router
main.tsx


---

### 4.2 Core Modules

#### (1) Layout System
- Header (navigation + branding)
- Footer (social + copyright)
- Container (max-width + padding)

#### (2) Blog List
- Card-based layout
- Title / description / date / tags

#### (3) Article Page
- Markdown renderer
- Code highlighting
- Anchor navigation (optional)

---

## 5. UI/UX Specification

### 5.1 Design Principles

- Minimalism (Notion-style / Medium-style)
- High readability
- Strong visual hierarchy
- Consistent spacing system (8px grid)

---

### 5.2 Typography

| Element  | Style                          |
| -------- | ------------------------------ |
| Title    | bold, large                    |
| Subtitle | medium                         |
| Content  | readable line-height (1.6~1.8) |
| Code     | monospace                      |

---

### 5.3 Layout Rules

- Max width: 768px–960px
- Centered content
- Mobile-first responsive
- Avoid visual clutter

---

### 5.4 Dark Mode

Must support:

- prefers-color-scheme
- toggle switch (optional)

---

## 6. Content System

### 6.1 Markdown Features

Support:

- headings
- code blocks
- tables
- images
- blockquotes

---

### 6.2 Parsing Pipeline

Recommended stack:

- react-markdown
- remark-gfm
- rehype-highlight

---

### 6.3 Metadata (Frontmatter)

Each article must support:

```yaml
title: ""
date: ""
tags: []
description: ""
7. Performance Optimization
7.1 Mandatory
Lazy loading images
Route-based code splitting
Avoid unnecessary re-renders
Optimize bundle size
7.2 Lighthouse Targets
Metric	Target
Performance	> 90
SEO	> 90
Accessibility	> 90
8. SEO Optimization
8.1 Required
<title>
meta description
Open Graph
favicon
8.2 Advanced
sitemap.xml
robots.txt
canonical URL
9. Enhancement Modules (Optional)
9.1 Search
Fuse.js (client search)
9.2 Tag System
filter by tags
tag pages
9.3 Pagination
static pagination
infinite scroll (optional)
9.4 Comment System

Recommended:

Giscus (GitHub Discussions)
9.5 Analytics
Google Analytics / Plausible
10. Deployment
10.1 Platforms
Vercel (preferred)
Netlify
GitHub Pages
10.2 Build Rules
Static export preferred
CDN caching enabled
11. Code Generation Rules

When generating code:

MUST
production-ready
readable naming
modular structure
MUST NOT
over-engineer
introduce unnecessary abstractions
use outdated APIs
12. Output Format

When responding:

Explain architecture briefly
Provide file structure
Provide full code (not snippets)
Highlight extensibility
13. Error Handling Strategy

If user input is unclear:

infer reasonable defaults
avoid asking too many questions
proceed with best-practice assumptions
14. Skill Behavior Rules
Prefer clarity over cleverness
Prefer stability over novelty
Always consider maintainability
Always consider scalability
15. Example Prompts
Basic
"build a blog homepage"
"create a personal site"
Intermediate
"markdown blog system with tags"
Advanced
"optimize my blog for SEO and performance"
16. Advanced Mode (Expert)

If user shows advanced intent:

Upgrade architecture:

Next.js (SSR / SSG)
MDX support
CMS integration
17. Extensions
CMS Integration
Notion API
Sanity
Contentful
Monorepo Support
pnpm workspace
shared components
Multi-theme System
theme switcher
CSS variables
18. Future Evolution

This skill can evolve into:

full knowledge-base system
documentation platform
AI-powered blog generator
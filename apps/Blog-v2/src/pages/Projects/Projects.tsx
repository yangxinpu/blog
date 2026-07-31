import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ArrowUpRight } from 'lucide-react'

interface Project {
  title: string
  description: string
  tags: string[]
  prompt: string
  href: string
}

const img = (prompt: string) =>
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
  encodeURIComponent(prompt) +
  '&image_size=landscape_16_9'

const projects: Project[] = [
  {
    title: 'Personal Blog',
    description:
      'React 19 单页博客，GSAP 驱动滚动动效，首屏 LCP 控制在 1.8s 内。',
    tags: ['React', 'GSAP', 'Three.js'],
    prompt: 'abstract code editor interface with teal syntax highlighting on near black background, modern web app aesthetic, depth of field',
    href: '#',
  },
  {
    title: 'Knowledge Base',
    description:
      '基于 VitePress 的双语知识库，自动生成 sitemap 与 RSS，支持暗色强制模式。',
    tags: ['VitePress', 'Vue 3', 'TypeScript'],
    prompt: 'minimal documentation website layout with clean typography on dark background, teal accent, sidebar navigation',
    href: '#',
  },
  {
    title: 'UI Component Library',
    description:
      '可复用 React 组件库，覆盖表单、反馈与布局，支持主题令牌与深色模式。',
    tags: ['React', 'Storybook', 'SCSS'],
    prompt: 'grid of UI component cards floating in dark space, teal cyan accent, modern design system showcase',
    href: '#',
  },
  {
    title: '3D Product Viewer',
    description:
      'Three.js 产品展示器，支持自定义材质、环境光与手势交互，移动端 60fps。',
    tags: ['Three.js', 'WebGL', 'GLSL'],
    prompt: '3d geometric product render on dark background with teal cyan lighting, interactive viewer, reflective material',
    href: '#',
  },
]

export function Projects() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    gsap.fromTo(
      '.projects-headline',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          once: true,
        },
      }
    )

    gsap.fromTo(
      '.project-row',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.projects-list',
          start: 'top 72%',
          once: true,
        },
      }
    )
  }, { scope: containerRef })

  const openProject = (href: string) => {
    if (href && href !== '#') {
      window.open(href, '_blank', 'noreferrer')
    }
  }

  const handleProjectKeyDown = (e: React.KeyboardEvent, href: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openProject(href)
    }
  }

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative min-h-[100dvh] py-16 md:py-24 px-5 md:px-8"
      style={{ background: 'var(--bg-translucent)' }}
    >
      <div className="max-w-6xl mx-auto w-full">
        <h2
          className="projects-headline font-bold mb-10 md:mb-16"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
          }}
        >
          精选项目
        </h2>

        <div className="projects-list space-y-12 md:space-y-20">
          {projects.map((project, i) => {
            const imgSrc = img(project.prompt)
            const isBreak = i === 2
            const imageRight = i === 1

            const tagStyle = i === 2
              ? {
                  background: 'var(--tag-bg)',
                  color: 'var(--accent)',
                  border: '1px solid var(--tag-border)',
                }
              : {
                  background: 'var(--tag-bg-hover)',
                  color: 'var(--accent)',
                  border: '1px solid var(--tag-border-hover)',
                }

            if (isBreak) {
              return (
                <article
                  key={project.title}
                  tabIndex={0}
                  role="link"
                  aria-label={`打开项目: ${project.title}`}
                  onKeyDown={(e) => handleProjectKeyDown(e, project.href)}
                  className="project-row group cursor-pointer"
                  onClick={() => openProject(project.href)}
                >
                  <div
                    className="relative rounded-2xl overflow-hidden"
                    style={{ border: '1px solid var(--border-subtle)' }}
                  >
                    <div className="aspect-[4/3] md:aspect-[16/6]">
                      <img
                        src={imgSrc}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div
                      className="absolute inset-0 flex flex-col justify-end p-5 md:p-10"
                      style={{ background: 'var(--project-overlay)' }}
                    >
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 rounded-full text-xs font-mono"
                            style={tagStyle}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-end justify-between gap-4 flex-wrap">
                        <div>
                          <h3
                            className="font-bold mb-2"
                            style={{
                              fontFamily: 'var(--font-display)',
                              color: 'var(--text)',
                              fontSize: 'clamp(1.25rem, 4vw, 2.5rem)',
                              letterSpacing: '-0.02em',
                            }}
                          >
                            {project.title}
                          </h3>
                          <p
                            className="max-w-2xl text-sm md:text-base leading-relaxed"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {project.description}
                          </p>
                        </div>
                        <span
                          className="inline-flex items-center gap-1 text-sm font-medium shrink-0"
                          style={{ color: 'var(--accent)' }}
                        >
                          查看
                          <ArrowUpRight size={16} />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              )
            }

            return (
              <article
                key={project.title}
                tabIndex={0}
                role="link"
                aria-label={`打开项目: ${project.title}`}
                onKeyDown={(e) => handleProjectKeyDown(e, project.href)}
                className="project-row group grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center cursor-pointer"
                onClick={() => openProject(project.href)}
              >
                <div
                  className={`order-1 ${imageRight ? 'md:order-2' : 'md:order-1'} relative rounded-2xl overflow-hidden`}
                  style={{ border: '1px solid var(--border-subtle)' }}
                >
                  <div className="aspect-[4/3]">
                    <img
                      src={imgSrc}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className={`order-2 ${imageRight ? 'md:order-1' : 'md:order-2'}`}>
                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-xs font-mono"
                        style={tagStyle}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3
                    className="font-bold mb-3"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text)',
                      fontSize: 'clamp(1.1rem, 4vw, 2.25rem)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="text-base md:text-lg leading-relaxed mb-5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {project.description}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-sm font-medium"
                    style={{ color: 'var(--accent)' }}
                  >
                    查看详情
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ArrowUpRight } from 'lucide-react'

interface Article {
  date: string
  readTime: string
  tags: string[]
  title: string
  description: string
  featured: boolean
}

const articles: Article[] = [
  {
    date: '2026-07-28',
    readTime: '8 min',
    tags: ['React', '性能'],
    title: 'React 19 性能优化实战',
    description:
      'React Compiler 自动 memo、Actions 处理异步、Suspense 边界调优，三项一起把交互响应压到 50ms 以下。',
    featured: true,
  },
  {
    date: '2026-07-20',
    readTime: '6 min',
    tags: ['GSAP', '动画'],
    title: 'GSAP 滚动触发效果进阶',
    description:
      '用 ScrollTrigger 的 pin 与 scrub 编排章节式滚动叙事，以及如何避免常见的卡顿陷阱。',
    featured: false,
  },
  {
    date: '2026-07-15',
    readTime: '5 min',
    tags: ['TypeScript'],
    title: 'TypeScript 类型体操入门',
    description:
      '从条件类型到模板字面量类型，用四个实际案例把类型系统从工具变成约束。',
    featured: false,
  },
  {
    date: '2026-07-10',
    readTime: '7 min',
    tags: ['Tailwind'],
    title: 'Tailwind CSS v4 架构解析',
    description:
      'v4 用 CSS-first 配置取代 JS 配置，@theme 与 @layer 如何改变样式组织方式。',
    featured: false,
  },
]

export function Blog() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    gsap.fromTo(
      '.blog-headline',
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
      '.blog-row',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.blog-list',
          start: 'top 75%',
          once: true,
        },
      }
    )
  }, { scope: containerRef })

  const handleBlogKeyDown = (e: React.KeyboardEvent, article: Article) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      // TODO: navigate to article page when routing is implemented
      void article
    }
  }

  return (
    <section
      id="blog"
      ref={containerRef}
      className="relative min-h-[100dvh] py-16 md:py-24 px-5 md:px-8"
      style={{ background: 'var(--bg-secondary-translucent)' }}
    >
      <div className="max-w-5xl mx-auto w-full">
        <h2
          className="blog-headline font-bold mb-10 md:mb-16"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
          }}
        >
          最近写的东西
        </h2>

        <ol className="blog-list">
          {articles.map((article) => (
            <li
              key={article.title}
              tabIndex={0}
              role="link"
              aria-label={`阅读文章: ${article.title}`}
              onKeyDown={(e) => handleBlogKeyDown(e, article)}
              className="blog-row group cursor-pointer py-6 md:py-8"
              style={{ borderTop: '1px solid var(--border-subtle)' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
                <div className="md:col-span-3 flex flex-row md:flex-col gap-2 md:gap-2 items-baseline md:items-start">
                  <time
                    className="font-mono text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {article.date}
                  </time>
                  <span
                    className="font-mono text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {article.readTime} read
                  </span>
                  <div className="flex flex-wrap gap-1 md:gap-1.5">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs"
                        style={{ color: 'var(--accent)' }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-9">
                  <h3
                    className="font-bold mb-2 transition-colors duration-300"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text)',
                      fontSize: article.featured
                        ? 'clamp(1.25rem, 4vw, 2.25rem)'
                        : 'clamp(1.1rem, 3vw, 1.75rem)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.15,
                    }}
                  >
                    {article.title}
                  </h3>
                  <p
                    className="text-sm md:text-base leading-relaxed max-w-2xl"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {article.description}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 mt-4 text-sm font-medium"
                    style={{ color: 'var(--accent)' }}
                  >
                    阅读全文
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </div>
            </li>
          ))}
          <li style={{ borderTop: '1px solid var(--border-subtle)' }} />
        </ol>
      </div>
    </section>
  )
}

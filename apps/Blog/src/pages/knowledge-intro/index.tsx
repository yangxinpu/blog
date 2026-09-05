import React, { useEffect, useRef } from 'react';
import CursorGrid from './components/cursor-grid';
import BorderGlow from './components/border-glow';
import KnowledgeLogo from '../../assets/Images/common/knowlege-base-logo.png';
import './index.css';

type Category = {
  icon: string;
  title: string;
  titleEn: string;
  links: { label: string; href: string }[];
};

const KB_BASE = import.meta.env.VITE_KB_BASE_URL ?? 'https://nailuo-knowledge-base.vercel.app';

const kb = (path: string): string => `${KB_BASE}${path}`;

const categories: Category[] = [
  {
    icon: 'https://cdn.simpleicons.org/javascript/17FBC6',
    title: '前端',
    titleEn: 'Frontend',
    links: [
      { label: 'JavaScript', href: kb('/zh/前端/JavaScript/JS基础') },
      { label: 'React', href: kb('/zh/前端/React/React基础') },
      { label: 'Vue', href: kb('/zh/前端/Vue/Vue基础') },
    ],
  },
  {
    icon: 'https://cdn.simpleicons.org/nodedotjs/17FBC6',
    title: '后端',
    titleEn: 'Backend',
    links: [
      { label: 'Node.js', href: kb('/zh/后端/') },
      { label: '数据库', href: kb('/zh/后端/') },
    ],
  },
  {
    icon: 'https://cdn.simpleicons.org/vitest/17FBC6',
    title: '测试',
    titleEn: 'Testing',
    links: [
      { label: '单元测试', href: kb('/zh/测试/单元测试') },
      { label: '端到端测试', href: kb('/zh/测试/端到端测试') },
    ],
  },
  {
    icon: 'https://cdn.simpleicons.org/docker/17FBC6',
    title: '运维',
    titleEn: 'DevOps',
    links: [
      { label: 'Docker', href: kb('/zh/运维/') },
      { label: 'Nginx', href: kb('/zh/运维/') },
    ],
  },
  {
    icon: 'https://cdn.simpleicons.org/anthropic/17FBC6',
    title: 'AI',
    titleEn: 'AI',
    links: [
      { label: 'Ollama', href: kb('/zh/AI/Ollama/Ollama基础') },
      { label: 'Opencode', href: kb('/zh/AI/Opencode/Opencode基础') },
    ],
  },
  {
    icon: 'https://cdn.simpleicons.org/linear/17FBC6',
    title: '产品',
    titleEn: 'Product',
    links: [
      { label: '产品设计', href: kb('/zh/产品/') },
      { label: '产品方法论', href: kb('/zh/产品/') },
    ],
  },
  {
    icon: 'https://cdn.simpleicons.org/python/17FBC6',
    title: 'Python',
    titleEn: 'Python',
    links: [
      { label: 'Python 基础', href: kb('/zh/Python/') },
      { label: 'Python 进阶', href: kb('/zh/Python/') },
    ],
  },
  {
    icon: 'https://cdn.simpleicons.org/git/17FBC6',
    title: '其他',
    titleEn: 'Other',
    links: [
      { label: 'Git', href: kb('/zh/其他/Git/') },
      { label: '算法', href: kb('/zh/其他/算法/') },
      { label: '计算机网络', href: kb('/zh/其他/计算机网络/') },
    ],
  },
];

const getAccentColor = (): string => {
  if (typeof window === 'undefined') return '#17FBC6';
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--accent')
    .trim() || '#17FBC6';
};

const KnowledgeIntro: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const accentColor = getAccentColor();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add('animate-in');
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      },
    );

    const elements = [headerRef.current, categoriesRef.current].filter(Boolean);
    elements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="ki-section">
      <div className="ki-grid">
        <CursorGrid
          cellSize={70}
          color={accentColor}
          radius={140}
          falloff="smooth"
          holdTime={400}
          fadeDuration={800}
          lineWidth={1.2}
          maxOpacity={1}
          fillOpacity={0}
          gridOpacity={0}
          cellRadius={0}
          clickPulse
          pulseSpeed={600}
        />
      </div>

      <div className="ki-container">
        <div ref={headerRef} className="ki-header animate-delay-0">
          <h2 className="ki-title">
            <span>NaiLuo知识库</span>
            <img src={KnowledgeLogo} alt="NaiLuo知识库" />
          </h2>
          <p className="ki-subtitle">
            系统化的技术学习笔记，覆盖前端、后端、AI、运维、产品、测试等领域，如果你对其中任何一个领域感兴趣，都可以点击进入学习
          </p>
        </div>

        <div ref={categoriesRef} className="ki-categories animate-delay-1">
          {categories.map((category, index) => (
            <a
              key={category.title}
              href={kb(`/zh/${category.title}/`)}
              className="ki-category-link"
              target="_blank"
              rel="noopener noreferrer"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <BorderGlow
                edgeSensitivity={0}
                glowColor="165 97 70"
                backgroundColor="#120F17"
                borderRadius={10}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated={true}
                colors={['#17FBC6', '#8DFBDE', '#0EB890']}
                className="ki-category-card"
              >
                <div className="ki-category-content">
                  <div className="ki-category-header">
                    <span className="ki-category-icon">
                      <img src={category.icon} alt={category.title} />
                    </span>
                    <div className="ki-category-title-group">
                      <h3 className="ki-category-title">{category.title}</h3>
                      <span className="ki-category-title-en">{category.titleEn}</span>
                    </div>
                  </div>
                  <div className="ki-category-links">
                    {category.links.map((link) => (
                      <span key={link.label} className="ki-category-link-tag">
                        {link.label}
                      </span>
                    ))}
                  </div>
                </div>
              </BorderGlow>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KnowledgeIntro;

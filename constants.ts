import { Content, Language } from './types';

export const COLORS = {
  black: '#0f0f0e',
  darkGreen: '#366454',
  midGreen: '#38967a',
  lightGreen: '#3bc8a0',
  neonGreen: '#19fac6',
};

const TECH_DATA_RAW = [
  { id: 'js', name: 'JavaScript', color: '#F7DF1E', logo: '/images/javascript.png' },
  { id: 'html', name: 'HTML5', color: '#E34F26', logo: '/images/html.png' },
  { id: 'css', name: 'CSS3', color: '#1572B6', logo: '/images/css.png' },
  { id: 'vue', name: 'Vue.js', color: '#4FC08D', logo: '/images/Vue.png' },
  { id: 'react', name: 'React', color: '#61DAFB', logo: '/images/React.png' },
  { id: 'vite', name: 'Vite', color: '#646CFF', logo: '/images/vitejs.png' },
  { id: 'webpack', name: 'Webpack', color: '#8DD6F9', logo: '/images/webpack.png' },
  { id: 'next', name: 'Next.js', color: '#FFFFFF', logo: '/images/nextjs.png' },
  { id: 'babel', name: 'Babel', color: '#F9DC3E', logo: '/images/babel.png' },
  { id: 'eslint', name: 'ESLint', color: '#4B32C3', logo: '/images/eslint.png' },
  { id: 'prettier', name: 'Prettier', color: '#F7B93E', logo: '/images/prettier.png' },
  { id: 'uniapp', name: 'Uniapp', color: '#2B9939', logo: '/images/uniapp.png' },
];

export const CONTENT: Record<Language, Content> = {
  en: {
    hero: {
      motto: "Thinking in Code, Designing with Soul.",
      name: "NaiLuo",
      subtitle: "A frontend development enthusiast, crafting immersive web experiences with modern technology and pixel-perfect precision.",
      scroll: "Scroll to Explore",
    },
    stack: {
      title: "Tech Stack",
      subtitle: "",
      items: TECH_DATA_RAW.map(t => ({
        ...t,
        description: `Proficient in ${t.name}. I use it to build scalable, maintainable, and high-performance applications.`
      }))
    },
    projects: {
      title: "Featured Projects",
      items: [
        {
          id: 1,
          title: "E-Commerce Dashboard",
          description: "A comprehensive analytics dashboard with real-time data visualization.",
          tech: ["React", "D3.js", "Next.js"],
        },
        {
          id: 2,
          title: "SaaS Landing Page",
          description: "High-conversion landing page with complex scroll animations.",
          tech: ["Vue", "GSAP", "Vite"],
        },
        {
          id: 3,
          title: "Mobile Travel App",
          description: "Cross-platform mobile application built for seamless travel booking.",
          tech: ["Uniapp", "Vue", "CSS3"],
        }
      ]
    },
    thoughts: {
      title: "Thoughts & Insights",
      subtitle: "Musings on code, design, and the digital world.",
      items: [
        {
          id: 1,
          title: "The Art of Minimalism in Code",
          date: "Oct 24, 2023",
          summary: "Why writing less code is often harder but infinitely better. Exploring the benefits of clean architecture.",
          tags: ["Architecture", "Clean Code"]
        },
        {
          id: 2,
          title: "Embracing React Server Components",
          date: "Sep 15, 2023",
          summary: "A dive into the future of React and how RSCs are changing the way we think about data fetching.",
          tags: ["React", "Performance"]
        },
        {
          id: 3,
          title: "Designing for Accessibility First",
          date: "Aug 02, 2023",
          summary: "Accessibility shouldn't be an afterthought. It is the foundation of a truly inclusive web experience.",
          tags: ["A11y", "UX Design"]
        },
        {
          id: 4,
          title: "The State of CSS in 2024",
          date: "Jul 10, 2023",
          summary: "From Tailwind to CSS-in-JS, checking out the modern landscape of styling web applications.",
          tags: ["CSS", "Frontend"]
        }
      ]
    },
    manifesto: [
      "en",
      "In the digital realm🔮, we are the architects of the invisible Every line of code is a brick🧱, every function a doorway🚪",
      "We don't just build websites; we create journeys🚀, inspire emotions🎈, and bridge the gap between human imagination and machine logic🎯",
      "Precision is our tool🪀, creativity is our fuel🔥 We believe great design is not just seen—it is felt✨",
      "This is where innovation breathes🌬️ This is where the future is written🌟 Like a rainbow🌈 after rain, or a glimmer in the darkness"
    ],
    hobbies: {
      title: "Personal Interests",
      subtitle: "Fueling creativity away from the keyboard.",
      items: [
        {
          id: "reading",
          name: "Reading",
          description: "Immersing myself in sci-fi novels and technical literature to broaden my horizon.",
          iconKey: "book"
        },
        {
          id: "photography",
          name: "Photography",
          description: "Capturing the interplay of light and shadow in urban environments.",
          iconKey: "camera"
        },
        {
          id: "sports",
          name: "Sports",
          description: "Staying active through running and badminton to maintain a sharp mind.",
          iconKey: "activity"
        },
        {
          id: "travel",
          name: "Travel",
          description: "Exploring new cultures and landscapes to find inspiration for design.",
          iconKey: "plane"
        },
        {
          id: "movies",
          name: "Movies",
          description: "Analyzing visual storytelling and cinematography in modern cinema.",
          iconKey: "film"
        },
        {
          id: "music",
          name: "Music",
          description: "Finding rhythm in code and melody in life. I love electronic and lo-fi beats.",
          iconKey: "music"
        }
      ]
    },
    videos: {
          title: "Visual Experience",
          subtitle: "Motion, Animation, and Interaction",
          items: [
            {
              id: 1,
              src: "https://gsap.com/community/uploads/monthly_2025_11/11-19-2025-themonolithproject-video-sow.mp4.89ee2c4a5e4ec03979d826779855ae3b.mp4",
              title: "The Monolith Project",
              category: "Interactive 3D"
            },
            {
              id: 2,
              src: "https://gsap.com/community/uploads/monthly_2025_11/11-19-2025-themonolithproject-video-sow.mp4.89ee2c4a5e4ec03979d826779855ae3b.mp4",
              title: "Abstract Flow",
              category: "Creative Coding"
            },
            {
              id: 3,
              src: "https://gsap.com/community/uploads/monthly_2025_11/11-19-2025-themonolithproject-video-sow.mp4.89ee2c4a5e4ec03979d826779855ae3b.mp4",
              title: "Neon City",
              category: "WebGl Shader"
            }
          ]
    }
  },
  zh: {
    hero: {
      motto: "以代码思考，注灵魂于设计。",
      name: "NaiLuo",
      subtitle: "一个前端开发爱好者，使用现代技术和像素级的精度打造沉浸式网络体验。",
      scroll: "向下滚动探索",
    },
    stack: {
      title: "技术栈",
      subtitle: "",
      items: TECH_DATA_RAW.map(t => ({
        ...t,
        description: t.id === 'js' ? "JavaScript 是我技能的核心。深入理解 ES6+ 规范，闭包，原型链和异步编程。" :
                     t.id === 'react' ? "精通 React 生态系统，包括 Hooks, Context API 和 Redux。擅长构建复杂的单页应用。" :
                     t.id === 'vue' ? "拥有丰富的 Vue 2/3 开发经验，熟悉 Composition API 和 Vuex/Pinia 状态管理。" :
                     t.id === 'html' ? "编写语义化、可访问的 HTML5 标记，确保 SEO 友好和跨设备兼容性。" :
                     t.id === 'css' ? "熟练运用 CSS3，Flexbox, Grid 布局，以及 Tailwind CSS 等现代样式库进行复杂 UI 还原。" :
                     `熟练使用 ${t.name} 进行高效开发，构建高性能、可维护的前端应用。`
      }))
    },
    projects: {
      title: "精选项目",
      items: [
        {
          id: 1,
          title: "电商数据仪表盘",
          description: "具有实时数据可视化的综合分析仪表盘。",
          tech: ["React", "D3.js", "Next.js"],
        },
        {
          id: 2,
          title: "SaaS 落地页",
          description: "具有复杂滚动动画的高转化率落地页。",
          tech: ["Vue", "GSAP", "Vite"],
        },
        {
          id: 3,
          title: "移动旅行应用",
          description: "为无缝旅行预订而构建的跨平台移动应用程序。",
          tech: ["Uniapp", "Vue", "CSS3"],
        }
      ]
    },
    thoughts: {
      title: "个人感想",
      subtitle: "关于代码、设计和数字世界的思考。",
      items: [
        {
          id: 1,
          title: "代码中的极简艺术",
          date: "2023年10月24日",
          summary: "为什么写更少的代码往往更难，但却好得多。探索整洁架构的益处。",
          tags: ["架构", "Clean Code"]
        },
        {
          id: 2,
          title: "拥抱 React 服务端组件",
          date: "2023年9月15日",
          summary: "深入探讨 React 的未来，以及 RSC 如何改变我们对数据获取的思考方式。",
          tags: ["React", "性能优化"]
        },
        {
          id: 3,
          title: "无障碍设计优先",
          date: "2023年8月2日",
          summary: "无障碍不应是事后的想法。它是真正包容性网络体验的基础。",
          tags: ["A11y", "用户体验"]
        },
        {
          id: 4,
          title: "2024 年的 CSS 现状",
          date: "2023年7月10日",
          summary: "从 Tailwind 到 CSS-in-JS，看看现代 Web 应用样式的全景。",
          tags: ["CSS", "前端开发"]
        }
      ]
    },
    manifesto: [
      "zh",
      "在数字领域🔮，我们是无形的建筑师 每一行代码都是砖块🧱，每一个函数都是门口🚪",
      "我们不仅构建网站；我们创造旅程🚀，激发情感🎈，并在人类想象力与机器逻辑之间架起桥梁🎯",
      "精确是我们的工具🪀，创造力是我们的燃料🔥 我们相信伟大的设计不仅是被看到的——更是被感受到的✨",
      "这是创新呼吸的地方🌬️ 这是未来被书写的地方🌟 如同雨后的彩虹🌈，或是黑暗中的微光"
    ],
    hobbies: {
      title: "兴趣爱好",
      subtitle: "键盘之外的灵感源泉。",
      items: [
        {
          id: "reading",
          name: "阅读",
          description: "沉浸在科幻小说和技术文献中，以开阔我的视野。",
          iconKey: "book"
        },
        {
          id: "photography",
          name: "摄影",
          description: "捕捉城市环境中的光影交错。",
          iconKey: "camera"
        },
        {
          id: "sports",
          name: "运动",
          description: "通过跑步和羽毛球保持活跃，保持敏锐的头脑。",
          iconKey: "activity"
        },
        {
          id: "travel",
          name: "旅行",
          description: "探索新的文化和风景，为设计寻找灵感。",
          iconKey: "plane"
        },
        {
          id: "movies",
          name: "电影",
          description: "分析现代电影中的视觉叙事和摄影技巧。",
          iconKey: "film"
        },
        {
          id: "music",
          name: "音乐",
          description: "在代码中寻找节奏，在生活中寻找旋律。我喜欢电子和 Lo-fi 音乐。",
          iconKey: "music"
        }
      ]
    },
    videos: {
        title: "视觉体验",
        subtitle: "动效、动画与交互",
        items: [
          {
            id: 1,
            src: "https://gsap.com/community/uploads/monthly_2025_11/11-19-2025-themonolithproject-video-sow.mp4.89ee2c4a5e4ec03979d826779855ae3b.mp4",
            title: "巨石计划",
            category: "交互式3D"
          },
          {
            id: 2,
            src: "https://gsap.com/community/uploads/monthly_2025_11/11-19-2025-themonolithproject-video-sow.mp4.89ee2c4a5e4ec03979d826779855ae3b.mp4",
            title: "抽象流动",
            category: "创意编程"
          },
          {
            id: 3,
            src: "https://gsap.com/community/uploads/monthly_2025_11/11-19-2025-themonolithproject-video-sow.mp4.89ee2c4a5e4ec03979d826779855ae3b.mp4",
            title: "霓虹都市",
            category: "WebGl着色器"
          }
        ]
      }
    }
};
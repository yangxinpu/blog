import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Code2, Activity, Zap } from 'lucide-react';
import styles from './Home.module.scss';

const TECH_STACKS = [
  {
    name: 'React',
    icon: <Zap size={36} />,
    description: '组件化开发，生态强大，适合大型应用。',
    color: '#61DAFB'
  },
  {
    name: 'Vue',
    icon: <Activity size={36} />,
    description: '渐进式框架，轻量高效，生态完善。',
    color: '#4FC08D'
  },
  {
    name: 'JavaScript',
    icon: <Code2 size={36} />,
    description: 'Web核心语言，驱动现代前端。',
    color: '#F7DF1E'
  },
  {
    name: 'Node.js',
    icon: <Zap size={36} />,
    description: '服务器端运行JavaScript，构建高性能后端。',
    color: '#339933'
  },
  {
    name: 'Next.js',
    icon: <Code2 size={36} />,
    description: 'React框架，支持服务端渲染和静态生成。',
    color: '#000000'
  },
  {
    name: 'Vite',
    icon: <Zap size={36} />,
    description: '现代前端构建工具，快速开发和构建。',
    color: '#646CFF'
  },
  {
    name: 'Uniapp',
    icon: <Activity size={36} />,
    description: '跨平台应用框架，一次开发多端运行。',
    color: '#007AFF'
  }
];

const Home: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const mouse = { x: width / 2, y: height / 2 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });

    // 粒子
    const particles: any[] = [];
    const count = 100;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 绘制粒子
      particles.forEach((p) => {
        // 鼠标引力
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          p.x -= dx * 0.01;
          p.y -= dy * 0.01;
        }

        p.x += p.vx;
        p.y += p.vy;

        // 边界反弹
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,255,200,0.8)';
        ctx.fill();
      });

      // 连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,255,200,${1 - dist / 120})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <div className={styles.home}>
      {/* Canvas背景 */}
      <canvas ref={canvasRef} className={styles.canvas}></canvas>

      {/* 🚀 Hero - 最顶部 */}
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={styles.title}>Overthinker</h1>
        <p className={styles.subtitle}>Build · Think · Create</p>
        <p className={styles.desc}>这是我的个人博客，记录技术与思考</p>
      </motion.div>

      {/* 📦 内容 */}
      <section className={styles.content}>
        <div className={styles.gridLayout}>
          {/* 左上和中上 - Message Board */}
          <motion.div
            className={styles.card}
            style={{ gridColumn: '1 / 3', gridRow: '1 / 3' }}
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>Message Board</h3>
            <p className={styles.text}>快来留言吧 (≧▽≦)</p>
            <div className={styles.divider}></div>

            <div className={styles.messageItem}>
              <h4>简单自我介绍</h4>
              <span>2025-03-08 · OverThinker</span>
            </div>
          </motion.div>

          {/* 右上 - React */}
          <motion.div
            className={styles.techCard}
            whileHover={{ scale: 1.05, y: -8 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className={styles.icon}
              style={{ background: `${TECH_STACKS[0].color}22` }}
            >
              {TECH_STACKS[0].icon}
            </div>
            <h4>{TECH_STACKS[0].name}</h4>
            <p>{TECH_STACKS[0].description}</p>
          </motion.div>

          {/* 右下 - Vue */}
          <motion.div
            className={styles.techCard}
            whileHover={{ scale: 1.05, y: -8 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              className={styles.icon}
              style={{ background: `${TECH_STACKS[1].color}22` }}
            >
              {TECH_STACKS[1].icon}
            </div>
            <h4>{TECH_STACKS[1].name}</h4>
            <p>{TECH_STACKS[1].description}</p>
          </motion.div>

          {/* 左下 - Vite */}
          <motion.div
            className={styles.techCard}
            whileHover={{ scale: 1.05, y: -8 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className={styles.icon}
              style={{ background: `${TECH_STACKS[5].color}22` }}
            >
              {TECH_STACKS[5].icon}
            </div>
            <h4>{TECH_STACKS[5].name}</h4>
            <p>{TECH_STACKS[5].description}</p>
          </motion.div>

          {/* 中下 - Uniapp */}
          <motion.div
            className={styles.techCard}
            whileHover={{ scale: 1.05, y: -8 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className={styles.icon}
              style={{ background: `${TECH_STACKS[6].color}22` }}
            >
              {TECH_STACKS[6].icon}
            </div>
            <h4>{TECH_STACKS[6].name}</h4>
            <p>{TECH_STACKS[6].description}</p>
          </motion.div>

          {/* 右下 - JavaScript */}
          <motion.div
            className={styles.techCard}
            whileHover={{ scale: 1.05, y: -8 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div
              className={styles.icon}
              style={{ background: `${TECH_STACKS[2].color}22` }}
            >
              {TECH_STACKS[2].icon}
            </div>
            <h4>{TECH_STACKS[2].name}</h4>
            <p>{TECH_STACKS[2].description}</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
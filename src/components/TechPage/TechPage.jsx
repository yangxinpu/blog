import './style.scss';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function TechPage() {
    // 内容相关引用
    const techItemsRef = useRef([]);
    const techObserver = useRef(null);

    const { t } = useTranslation();

    const techStacks = [
        {
            name: 'JavaScript',
            description: t('TechPage.techStacks.JavaScript.description'),
            subTechs: [t('TechPage.techStacks.JavaScript.subTechs.TypeScript')],
            logoUrl: 'https://pic1.imgdb.cn/item/69256bdb3203f7be003126b2.None',
            color: '#f7df1e',
        },
        {
            name: 'CSS',
            description: t('TechPage.techStacks.CSS.description'),
            subTechs: [
                t('TechPage.techStacks.CSS.subTechs.TailwindCSS'),
                t('TechPage.techStacks.CSS.subTechs.SCSS'),
                t('TechPage.techStacks.CSS.subTechs.LESS'),
            ],
            logoUrl: 'https://pic1.imgdb.cn/item/69256b323203f7be003121ac.None',
            color: '#1572b6',
        },
        {
            name: t('TechPage.techStacks.HTML.name'),
            description: t('TechPage.techStacks.HTML.description'),
            subTechs: [
                t('TechPage.techStacks.HTML.subTechs.SVG'),
                t('TechPage.techStacks.HTML.subTechs.Canvas'),
                t('TechPage.techStacks.HTML.subTechs.DOM'),
                t('TechPage.techStacks.HTML.subTechs.BOM'),
            ],
            logoUrl: 'https://pic1.imgdb.cn/item/69256bdb3203f7be003126b1.png',
            color: '#e34c26',
        },
        {
            name: 'React',
            description: t('TechPage.techStacks.React.description'),
            subTechs: [
                t('TechPage.techStacks.React.subTechs.AntDesign'),
                t('TechPage.techStacks.React.subTechs.ReactRouter'),
                t('TechPage.techStacks.React.subTechs.Redux'),
                t('TechPage.techStacks.React.subTechs.Zustand'),
                t('TechPage.techStacks.React.subTechs.Shadcn'),
            ],
            logoUrl: 'https://pic1.imgdb.cn/item/69256bea3203f7be0031271d.None',
            color: '#61dafb',
        },
        {
            name: 'Vue',
            description: t('TechPage.techStacks.Vue.description'),
            subTechs: [
                t('TechPage.techStacks.Vue.subTechs.Pinia'),
                t('TechPage.techStacks.Vue.subTechs.VueRouter'),
                t('TechPage.techStacks.Vue.subTechs.Vuex'),
                t('TechPage.techStacks.Vue.subTechs.ElementPlus'),
            ],
            logoUrl: 'https://pic1.imgdb.cn/item/69256cb53203f7be00312e1e.None',
            color: '#4fc08d',
        },
        {
            name: 'Next.js',
            description: t('TechPage.techStacks.NextJS.description'),
            subTechs: [],
            logoUrl: 'https://pic1.imgdb.cn/item/69256c5e3203f7be00312ad5.None',
            color: '#000000',
        },
        {
            name: 'Node.js',
            description: t('TechPage.techStacks.NodeJS.description'),
            subTechs: [
                t('TechPage.techStacks.NodeJS.subTechs.Express'),
                t('TechPage.techStacks.NodeJS.subTechs.MySQL'),
                t('TechPage.techStacks.NodeJS.subTechs.JWT'),
                t('TechPage.techStacks.NodeJS.subTechs.Nodemailer'),
            ],
            logoUrl: 'https://pic1.imgdb.cn/item/69256bb33203f7be0031256d.None',
            color: '#339933',
        },
        {
            name: 'Webpack',
            description: t('TechPage.techStacks.Webpack.description'),
            subTechs: [t('TechPage.techStacks.Webpack.subTechs.Loaders'), t('TechPage.techStacks.Webpack.subTechs.Plugins')],
            logoUrl: 'https://pic1.imgdb.cn/item/6925728d3203f7be0031882a.None',
            color: '#8dd6f9',
        },
        {
            name: 'Vite',
            description: t('TechPage.techStacks.Vite.description'),
            subTechs: [t('TechPage.techStacks.Vite.subTechs.Rollup'), t('TechPage.techStacks.Vite.subTechs.ESBuild')],
            logoUrl: 'https://pic1.imgdb.cn/item/692572693203f7be003185f9.None',
            color: '#646cff',
        },
        {
            name: 'Babel',
            description: t('TechPage.techStacks.Babel.description'),
            subTechs: [t('TechPage.techStacks.Babel.subTechs.Presets'), t('TechPage.techStacks.Babel.subTechs.Plugins')],
            logoUrl: 'https://pic1.imgdb.cn/item/69256b323203f7be003121ab.None',
            color: '#f9dc3e',
        },
        {
            name: 'ESLint',
            description: t('TechPage.techStacks.ESLint.description'),
            subTechs: [t('TechPage.techStacks.ESLint.subTechs.Presets'), t('TechPage.techStacks.ESLint.subTechs.Plugins')],
            logoUrl: 'https://pic1.imgdb.cn/item/69256b323203f7be003121a8.None',
            color: '#4b32c3',
        },
        {
            name: 'Prettier',
            description: t('TechPage.techStacks.Prettier.description'),
            subTechs: [t('TechPage.techStacks.Prettier.subTechs.Presets')],
            logoUrl: 'https://pic1.imgdb.cn/item/69256bea3203f7be0031271a.None',
            color: '#f7b93e',
        },
        {
            name: 'PostCSS',
            description: t('TechPage.techStacks.PostCSS.description'),
            subTechs: [t('TechPage.techStacks.PostCSS.subTechs.Plugins')],
            logoUrl: 'https://pic1.imgdb.cn/item/69256bea3203f7be00312718.None',
            color: '#dd3a0a',
        },
        {
            name: t('TechPage.techStacks.AnimationLib.name'),
            description: t('TechPage.techStacks.AnimationLib.description'),
            subTechs: [
                t('TechPage.techStacks.AnimationLib.subTechs.AnimateCSS'),
                t('TechPage.techStacks.AnimationLib.subTechs.GSAP'),
                t('TechPage.techStacks.AnimationLib.subTechs.Lottie'),
                t('TechPage.techStacks.AnimationLib.subTechs.Motion'),
            ],
            color: '#f7b93e',
        },
        {
            name: 'UniApp',
            description: t('TechPage.techStacks.UniApp.description'),
            subTechs: [
                t('TechPage.techStacks.UniApp.subTechs.Vue3'),
                t('TechPage.techStacks.UniApp.subTechs.WeChatMiniProgram'),
                t('TechPage.techStacks.UniApp.subTechs.App'),
                t('TechPage.techStacks.UniApp.subTechs.WebView'),
            ],
            logoUrl: 'https://pic1.imgdb.cn/item/692572ca3203f7be00318bdc.None',
            color: '#2ea14b',
        },
        {
            name: 'Git',
            description: t('TechPage.techStacks.Git.description'),
            subTechs: [
                t('TechPage.techStacks.Git.subTechs.GitHub'),
                t('TechPage.techStacks.Git.subTechs.GitLab'),
                t('TechPage.techStacks.Git.subTechs.Gitee'),
                t('TechPage.techStacks.Git.subTechs.Husky'),
                t('TechPage.techStacks.Git.subTechs.LintStaged'),
                t('TechPage.techStacks.Git.subTechs.CommitLint'),
            ],
            logoUrl: 'https://pic1.imgdb.cn/item/69256b323203f7be003121aa.None',
            color: '#f05032',
        },
        {
            name: t('TechPage.techStacks.Network.name'),
            description: t('TechPage.techStacks.Network.description'),
            subTechs: [
                t('TechPage.techStacks.Network.subTechs.HTTP'),
                t('TechPage.techStacks.Network.subTechs.TCPIP'),
                t('TechPage.techStacks.Network.subTechs.DNS'),
            ],
            color: '#00bcd4',
        },
    ];

    useEffect(() => {
        // 交叉观察器 - 实现技术项激活效果
        techObserver.current = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('tech-item-active');
                    }
                });
            },
            {
                root: null,
                rootMargin: '200px 0px', // 上下各留出100px边距
                threshold: 0.5, // 当10%的元素可见时触发
            }
        );
        techItemsRef.current.forEach(item => {
            if (item) {
                techObserver.current.observe(item);
            }
        });

        // 清理函数
        return () => {
            if (techObserver.current) {
                techObserver.current.disconnect();
            }
        };
    }, []);

    return (
        <section id="Tech-page">
            <div className="header">
                <div className="title-tech-stack">
                    {techStacks.map((tech, index) => (
                        <span key={index} style={{ color: tech.color }}>
                            {tech.name}
                        </span>
                    ))}
                </div>
            </div>
            <div className="content">
                <div className="tech-stack-container">
                    {techStacks.map((tech, index) => (
                        <div
                            key={index}
                            className={`tech-item ${index % 2 === 0 ? 'tech-item-left' : 'tech-item-right'}`}
                            data-index={index}
                            ref={el => (techItemsRef.current[index] = el)}
                            style={{
                                borderLeft: index % 2 === 0 ? `4px solid ${tech.color}` : 'none',
                                borderRight: index % 2 === 0 ? 'none' : `4px solid ${tech.color}`,
                                background: `rgba(${parseInt(tech.color.slice(1, 3), 16)}, ${parseInt(tech.color.slice(3, 5), 16)}, ${parseInt(tech.color.slice(5, 7), 16)}, 0.1)`,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className="tech-name" style={{ color: tech.color }}>
                                    {tech.name}
                                </div>
                                {tech.logoUrl && (
                                    <img
                                        src={tech.logoUrl}
                                        alt={t('TechPage.logoAlt', { name: tech.name })}
                                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                                    />
                                )}
                            </div>
                            <div className="tech-description">{tech.description}</div>
                            {tech.subTechs.length > 0 && (
                                <div
                                    className="tech-subtechs"
                                    style={{
                                        color: tech.color,
                                        borderLeft: `2px dashed ${tech.color}`,
                                        background: `rgba(${parseInt(tech.color.slice(1, 3), 16)}, ${parseInt(tech.color.slice(3, 5), 16)}, ${parseInt(tech.color.slice(5, 7), 16)}, 0.1)`,
                                    }}
                                >
                                    {tech.subTechs.join(', ')}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

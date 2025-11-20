import './style.scss';
import { useEffect, useRef } from 'react';

export default function WaterfallPage() {
    const observerRef = useRef([]); //将要观察的元素存储在ref中

    const leftContent = [
        {
            title: '阅读',
            content: ['《红楼梦》', '《海底两万里》', '《三体》', '《微纪元》', '《球状闪电》'],
        },
        {
            title: '旅行',
            content: ['《你好，世界》', '《你好，世界》', '《你好，世界》'],
        },
        {
            title: '最后一个',
            content: [],
        },
    ];
    const rightContent = [
        {
            title: '第一个',
            content: [],
        },
        {
            title: '运动',
            content: ['《你好，世界》', '《你好，世界》', '《你好，世界》'],
        },
        {
            title: '音乐',
            content: ['《你好，世界》', '《你好，世界》', '《你好，世界》'],
        },
    ];
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('itemActive');
            }
        });
    });

    useEffect(() => {
        observerRef.current.forEach(item => {
            if (item instanceof Element) {
                observer.observe(item);
            }
        });
    }, []);

    return (
        <section id="Waterfall-page">
            <div className="left-wrap">
                {leftContent.map((item, index) => (
                    <div
                        className={index === leftContent.length - 1 ? 'item item-last' : 'item'}
                        key={index}
                        ref={el => observerRef.current.push(el)}
                    >
                        <div className="title">{item.title}</div>
                        <div className="content">
                            {item.content.map((content, index) => (
                                <p key={index}>{content}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="right-wrap">
                {rightContent.map((item, index) => (
                    <div className={index === 0 ? 'item item-first' : 'item'} key={index} ref={el => observerRef.current.push(el)}>
                        <div className="title">{item.title}</div>
                        <div className="content">
                            {item.content.map((content, index) => (
                                <p key={index}>{content}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

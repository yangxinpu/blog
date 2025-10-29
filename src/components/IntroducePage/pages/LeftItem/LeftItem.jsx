import './style.scss';
import { useRef, useEffect } from 'react';

export default function LeftItem() {
    //创建全局观察器
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('showActive');
            } else {
                entry.target.classList.remove('showActive');
            }
        });
    });
    const observerRef = useRef([]); //将观察器存储在ref中

    useEffect(() => {
        observerRef.current.forEach(el => {
            if (el instanceof Element) {
                observer.observe(el);
            }
        }); //开始观察所有元素
        return () => {
            observerRef.current.forEach(el => {
                if (el instanceof Element) {
                    observer.unobserve(el);
                }
            }); //组件卸载时断开观察
        };
    }, []);

    return <div id="IntroduceLeftItem"></div>;
}

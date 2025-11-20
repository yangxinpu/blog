import './style.scss';
import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import img from '../../../../assets/images/cat.webp';

export default function LeftItem() {
    const { t } = useTranslation();
    //创建全局观察器
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
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

    return (
        <div id="Introduce-left-item">
            <div className="name" ref={el => observerRef.current.push(el)}>
                <span className="text">NaiLu</span>
                <img src={img} alt="" />
            </div>
            <div className="college" ref={el => observerRef.current.push(el)}>
                <span>{t('IntroducePage.LeftItem.collegePart1')}</span>
                <span>🌸</span>
                <span>{t('IntroducePage.LeftItem.collegePart2')}</span>
            </div>
            <div className="persue" ref={el => observerRef.current.push(el)}>
                <span>{t('IntroducePage.LeftItem.persuePart1')}</span>
                <span>{t('IntroducePage.LeftItem.persuePart2')}</span>
            </div>
            <div className="dream" ref={el => observerRef.current.push(el)}>
                <span>{t('IntroducePage.LeftItem.dreamPart1')}</span>
                <span>⭐️</span>
                <span>{t('IntroducePage.LeftItem.dreamPart2')}</span>
                <span>🍀</span>
                <span>{t('IntroducePage.LeftItem.dreamPart3')}</span>
            </div>
        </div>
    );
}

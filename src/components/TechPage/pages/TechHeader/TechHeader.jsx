import './style.scss';

import { useTranslation } from 'react-i18next';
import { useRef, useEffect } from 'react';

export default function TechHeader() {
    const titleRef = useRef(null); //将要观察的元素存储在ref中
    const { t } = useTranslation();
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    });
    useEffect(() => {
        observer.observe(titleRef.current);
    }, []);
    return (
        <div id="TechPage-Header">
            <div className="title" ref={titleRef}>
                {t('TechPage.title')}
            </div>
        </div>
    );
}

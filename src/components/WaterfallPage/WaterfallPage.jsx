import './style.scss';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function WaterfallPage() {
    const observerRef = useRef([]); //将要观察的元素存储在ref中
    const { t } = useTranslation();
    const leftContent = [
        {
            title: t('WaterfallPage.LeftItem.readingTitle'),
            content: [
                t('WaterfallPage.LeftItem.readingContent.0'),
                t('WaterfallPage.LeftItem.readingContent.1'),
                t('WaterfallPage.LeftItem.readingContent.2'),
                t('WaterfallPage.LeftItem.readingContent.3'),
            ],
        },
        {
            title: t('WaterfallPage.LeftItem.travelTitle'),
            content: [
                t('WaterfallPage.LeftItem.travelContent.0'),
                t('WaterfallPage.LeftItem.travelContent.1'),
                t('WaterfallPage.LeftItem.travelContent.2'),
                t('WaterfallPage.LeftItem.travelContent.3'),
            ],
        },
        {
            description: t('WaterfallPage.LeftItem.description'),
        },
    ];

    const rightContent = [
        {
            description: t('WaterfallPage.LeftItem.description'),
        },
        {
            title: t('WaterfallPage.RightItem.musicTitle'),
            content: [
                t('WaterfallPage.RightItem.musicContent.0'),
                t('WaterfallPage.RightItem.musicContent.1'),
                t('WaterfallPage.RightItem.musicContent.2'),
                t('WaterfallPage.RightItem.musicContent.3'),
            ],
        },
        {
            title: t('WaterfallPage.RightItem.sportsTitle'),
            content: [
                t('WaterfallPage.RightItem.sportsContent.0'),
                t('WaterfallPage.RightItem.sportsContent.1'),
                t('WaterfallPage.RightItem.sportsContent.2'),
                t('WaterfallPage.RightItem.sportsContent.3'),
            ],
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

        // 清理函数
        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <section id="Waterfall-page">
            <div className="left-wrap">
                {leftContent.map((item, index) => (
                    <div
                        className={index === leftContent.length - 1 ? 'item item-last' : 'item'}
                        key={index}
                        ref={el => {
                            if (el) observerRef.current.push(el);
                        }}
                    >
                        {item.title && <div className="title">{item.title}</div>}
                        <div className="content">
                            {item.description ? (
                                <p className="description">{item.description}</p>
                            ) : (
                                item.content.map((content, idx) => <p key={idx}>{content}</p>)
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="right-wrap">
                {rightContent.map((item, index) => (
                    <div
                        className={index === 0 ? 'item item-first' : 'item'}
                        key={index}
                        ref={el => {
                            if (el) observerRef.current.push(el);
                        }}
                    >
                        {item.title && <div className="title">{item.title}</div>}
                        <div className="content">
                            {item.description ? (
                                <p className="description">{item.description}</p>
                            ) : (
                                item.content.map((content, idx) => <p key={idx}>{content}</p>)
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

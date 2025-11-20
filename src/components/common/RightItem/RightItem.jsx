import './style.scss';

import { useRef, useEffect } from 'react';

import hill from '../../../../assets/images/introduce/hill.webp';
import aurora from '../../../../assets/images/introduce/aurora.webp';
import grass from '../../../../assets/images/introduce/grass.webp';
import forest from '../../../../assets/images/introduce/forest.webp';
const images = [hill, aurora, grass, forest];

export default function RightItem() {
    const itemRef = useRef([]); // 图片元素引用数组
    const wrapRef = useRef(null); // 包裹元素引用
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('wrapActive');
            } else {
                entry.target.classList.remove('wrapActive');
            }
        });
    });

    // 鼠标移动入事件处理函数
    const handleMouseMove = e => {
        itemRef.current.forEach(el => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.setProperty('--x', `${x}px`);
            el.style.setProperty('--y', `${y}px`);
        });
    };
    //鼠标移除事件处理函数
    const handleMoverLeave = () => {
        itemRef.current.forEach(el => {
            if (!el) return;
            el.style.setProperty('--x', '-1000px');
            el.style.setProperty('--y', '-1000px');
        });
    };

    useEffect(() => {
        wrapRef.current.addEventListener('mousemove', handleMouseMove); //添加事件监听器
        wrapRef.current.addEventListener('mouseleave', handleMoverLeave); //添加事件监听器
        observer.observe(wrapRef.current); // 观察包裹元素
        // 清理函数
        return () => {
            if (wrapRef.current) {
                wrapRef.current.removeEventListener('mousemove', handleMouseMove); //移除事件监听器
                wrapRef.current.removeEventListener('mouseleave', handleMoverLeave); //移除事件监听器
            }
        };
    }, []);
    return (
        <div id="Introduce-right-item">
            <div className="wrap" ref={wrapRef}>
                {images.map((img, index) => (
                    <div className="item" draggable={false} key={index} ref={el => itemRef.current.push(el)}>
                        <div className="inner">
                            <img className="img" src={img} alt="" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

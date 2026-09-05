import { useEffect, useState, useCallback } from 'react';
import './index.css';

interface PreloaderProps {
  /** 需要预加载的图片 URL 列表 */
  images: string[];
  /** 加载完成回调 */
  onComplete: () => void;
  /** 最小展示时长（ms），避免加载太快导致闪烁，默认 600 */
  minDuration?: number;
  /** 兜底超时（ms），超时后强制完成，默认 15000 */
  timeout?: number;
}

/**
 * 预加载单张图片，加载失败也不阻塞
 */
const preloadImage = (src: string): Promise<void> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });

/**
 * 首屏加载动画
 * 等待所有图片 + 字体 + window.load 就绪后才隐藏
 */
const Preloader: React.FC<PreloaderProps> = ({
  images,
  onComplete,
  minDuration = 600,
  timeout = 15000,
}) => {
  const [exiting, setExiting] = useState(false);

  const finish = useCallback(() => {
    setExiting(true);
    // 等退场动画结束后再卸载
    const timer = window.setTimeout(() => {
      onComplete();
    }, 700);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  useEffect(() => {
    const startTime = performance.now();
    let cancelled = false;

    // 兜底超时：无论如何都要在 timeout 后结束
    const timeoutTimer = window.setTimeout(() => {
      if (!cancelled) finish();
    }, timeout);

    // 并行等待：所有图片 + 字体 + window.load
    const imagesPromise = Promise.all(images.map(preloadImage));
    const fontsPromise = document.fonts?.ready ?? Promise.resolve();

    // window.load 兜底（含 CSS、iframe 等所有资源）
    const loadPromise = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', () => resolve(), { once: true });
      }
    });

    Promise.all([imagesPromise, fontsPromise, loadPromise]).then(() => {
      if (cancelled) return;
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);
      window.setTimeout(() => {
        if (!cancelled) finish();
      }, remaining);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutTimer);
    };
  }, [images, minDuration, timeout, finish]);

  return (
    <div className={`preloader${exiting ? ' preloader--exit' : ''}`}>
      <div className="preloader__inner">
        {/* 旋转加载动画 */}
        <div className="preloader__spinner" aria-hidden="true">
          <span className="preloader__ring" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;

// 节流
export default function throttle(fn, delay = 16) {
    let lastTime = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastTime >= delay) {
            fn.apply(this, args);
            lastTime = now;
        }
    };
}

import './style.scss';
import { useEffect, useRef, useState } from 'react';

export default function StarryBk() {
    const canvasRef = useRef(null);
    const [colors, setColors] = useState({
        bkColor: '#0f0f0e',
        fontColor: '#ffffff',
        primaryColor4: '#19fac6',
    });

    // 监听CSS变量变化
    useEffect(() => {
        const updateColors = () => {
            setColors({
                bkColor: getComputedStyle(document.documentElement).getPropertyValue('--bk-color').trim(),
                fontColor: getComputedStyle(document.documentElement).getPropertyValue('--font-color').trim(),
                primaryColor4: getComputedStyle(document.documentElement).getPropertyValue('--primary-color4').trim(),
            });
        };
        // 初始更新
        updateColors();

        // 创建一个MutationObserver来监听CSS变量的变化
        const observer = new MutationObserver(() => {
            updateColors();
        });

        // 开始观察document.documentElement的属性变化
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['style'],
        });

        // 清理函数
        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = Math.min(1600, document.documentElement.clientWidth);
        canvas.height = document.documentElement.clientHeight - 60;

        // 流星类
        class Meteor {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * (canvas.width + canvas.width / 2);
                this.y = 0;
                this.length = Math.random() * 50 + 30;
                this.speed = Math.random() * 5 + 3;
                this.angle = 60;
                this.rad = (this.angle * Math.PI) / 180; //角度转弧度
            }
            draw() {
                ctx.save();
                const gradient = ctx.createLinearGradient(
                    this.x,
                    this.y,
                    this.x - Math.cos(this.rad) * this.length,
                    this.y + Math.sin(this.rad) * this.length
                );
                gradient.addColorStop(0, '#fff');
                gradient.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - Math.cos(this.rad) * this.length, this.y + Math.sin(this.rad) * this.length);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.restore();
            }
            update() {
                this.x -= Math.cos(this.rad) * this.speed;
                this.y += Math.sin(this.rad) * this.speed;
                if (this.y > canvas.height / 2 + (canvas.height / 2) * Math.random() || this.x < 0) this.reset();
            }
        }

        // 粒子类
        class Particle {
            constructor(canvasWidth, canvasHeight, currentPrimaryColor4) {
                this.canvasWidth = canvasWidth;
                this.canvasHeight = canvasHeight;
                this.currentPrimaryColor4 = currentPrimaryColor4;

                // 地球参数
                this.earthCenterX = canvasWidth / 2;
                this.earthCenterY = canvasHeight + canvasHeight / 2 / 4; // 地球中心y
                this.earthWidth = canvasWidth;
                this.earthHeight = canvasHeight / 2;

                // 初始化粒子位置在地球周围
                const angle = Math.random() * Math.PI + Math.PI; // 只在上半部分 (180-360度)
                // 椭圆参数
                const ellipseA = (this.earthWidth / 2) * 1.2; // 椭圆长轴半径（X轴）
                const ellipseB = (this.earthHeight / 2) * 0.5; // 椭圆短轴半径（Y轴），减小使椭圆更扁平

                // 使用椭圆参数方程计算粒子位置
                const distanceX = Math.cos(angle - Math.PI) * ellipseA;
                const distanceY = Math.sin(angle - Math.PI) * ellipseB;

                this.x = this.earthCenterX + distanceX;
                this.y = this.earthCenterY - distanceY - ellipseB;

                // 粒子属性
                this.size = Math.random() * 3 + 2; // 粒子大小
                this.speedX = (Math.random() - 0.5) * 1.0; // X轴速度
                this.speedY = (Math.random() - 0.5) * 0.5; // Y轴速度，减小Y轴速度
                this.opacity = Math.random() * 0.5 + 0.5; // 透明度
                this.updateColor(currentPrimaryColor4); // 使用更新颜色的方法

                // 粒子生命周期
                this.life = Math.random() * 200 + 100; // 生命周期
                this.maxLife = this.life;
            }

            updateColor(primaryColor4) {
                this.currentPrimaryColor4 = primaryColor4;
                this.color = `rgba(${hexToRgb(primaryColor4)}, ${this.opacity})`; // 粒子颜色，使用全局变量
            }

            update() {
                // 更新位置
                this.x += this.speedX;
                this.y += this.speedY;

                // 减少生命周期
                this.life--;

                // 根据生命周期更新透明度
                this.opacity = (this.life / this.maxLife) * 0.8;
                this.updateColor(colors.primaryColor4); // 使用当前颜色

                // 如果粒子生命周期结束或超出画布，重新生成
                if (this.life <= 0 || this.y > this.canvasHeight || this.x < 0 || this.x > this.canvasWidth) {
                    const angle = Math.random() * Math.PI + Math.PI; // 只在上半部分 (180-360度)

                    // 椭圆参数
                    const ellipseA = (this.earthWidth / 2) * 1.2; // 椭圆长轴半径（X轴）
                    const ellipseB = (this.earthHeight / 2) * 0.5; // 椭圆短轴半径（Y轴），减小使椭圆更扁平

                    // 使用椭圆参数方程计算粒子位置
                    const distanceX = Math.cos(angle - Math.PI) * ellipseA;
                    const distanceY = Math.sin(angle - Math.PI) * ellipseB;

                    this.x = this.earthCenterX + distanceX;
                    this.y = this.earthCenterY - distanceY - ellipseB;

                    this.speedX = (Math.random() - 0.5) * 1.0;
                    this.speedY = (Math.random() - 0.5) * 0.5;
                    this.opacity = Math.random() * 0.5 + 0.5;
                    this.life = Math.random() * 200 + 100;
                    this.maxLife = this.life;
                }
            }

            draw() {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();

                // 添加发光效果，使用全局变量--primary-color4
                ctx.shadowColor = `rgba(${hexToRgb(this.currentPrimaryColor4)}, 0.8)`; // 使用当前颜色
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.restore();
            }
        }

        let shadowAnimationTime = 0;
        //绘制底部地球椭圆
        function drawEarth(currentPrimaryColor4) {
            const centerX = canvas.width / 2; // 椭圆中心x（画布水平居中）
            const ellipseWidth = canvas.width; // 椭圆宽度（100%画布宽度）
            const ellipseHeight = canvas.height / 2; // 椭圆高度（可根据需要调整）
            const centerY = canvas.height + ellipseHeight / 4; // 椭圆中心y（确保不触碰到文字）

            ctx.save();

            // 1. 绘制椭圆路径
            ctx.beginPath();
            ctx.ellipse(
                centerX,
                centerY,
                ellipseWidth / 2, // 椭圆长轴半径
                ellipseHeight / 2, // 椭圆短轴半径
                0, // 旋转角度
                Math.PI, // 起始角度（180度，左侧点）
                2 * Math.PI // 结束角度（360度，右侧点）→ 绘制下半部分
            );

            // 2. 设置边框样式，使用全局变量--primary-color4
            ctx.strokeStyle = currentPrimaryColor4; // 使用当前颜色
            ctx.lineWidth = 1; // 边框宽度

            shadowAnimationTime += 0.05;
            const shadowIntensity = (Math.sin(shadowAnimationTime) + 1) / 2; // 在0-1之间波动
            ctx.shadowColor = `rgba(${hexToRgb(currentPrimaryColor4)}, ${0.3 + shadowIntensity * 0.5})`; // 使用当前颜色
            ctx.shadowBlur = 10 + shadowIntensity * 10; // 动态阴影模糊度
            ctx.shadowOffsetX = 0; // 阴影X轴偏移
            ctx.shadowOffsetY = -5 - shadowIntensity * 5; // 动态阴影Y轴偏移

            // 4. 只绘制边框，不填充
            ctx.stroke();
            ctx.restore();

            // 返回地球参数，用于粒子系统
            return { centerX, centerY, ellipseWidth, ellipseHeight };
        }
        // 初始化流星数组
        let meteors = [];

        // 创建粒子数组
        let particles = [];

        // 动画循环
        function animate() {
            //清空画布
            ctx.fillStyle = colors.bkColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawEarth(colors.primaryColor4);
            //监测设备是否为移动端
            if (window.innerWidth <= 768) {
                if (particles.length === 0) {
                    // 移动端设备，减少粒子数量,10个
                    particles = Array.from({ length: 10 }, () => new Particle(canvas.width, canvas.height, colors.primaryColor4));
                    // 移动端设备，减少流星数量,2个
                    meteors = Array.from({ length: 2 }, () => new Meteor());
                }
            } else {
                if (particles.length === 0) {
                    // 非移动端设备，正常粒子数量,50个
                    particles = Array.from({ length: 50 }, () => new Particle(canvas.width, canvas.height, colors.primaryColor4));
                    // 非移动端设备，正常流星数量,5个
                    meteors = Array.from({ length: 5 }, () => new Meteor());
                }
            }

            // 更新粒子颜色
            particles.forEach(particle => {
                particle.updateColor(colors.primaryColor4);
            });

            // 更新和绘制粒子
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            //再画流星
            meteors.forEach(meteor => {
                meteor.update();
                meteor.draw();
            });

            requestAnimationFrame(animate);
        }
        animate();
    }, [colors]);

    return (
        <div id="HomeStarryBk">
            <canvas id="starryBkCanvas" ref={canvasRef}></canvas>
        </div>
    );
}

// 辅助函数：将十六进制颜色转换为RGB格式
function hexToRgb(hex) {
    // 去除可能存在的#号
    hex = hex.replace(/^#/, '');
    // 如果是3位十六进制，扩展为6位
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    // 解析RGB值
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `${r}, ${g}, ${b}`;
}

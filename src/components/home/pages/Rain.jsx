import { useRef, useEffect, useState } from "react"

import "./Rain.scss"
export default function Rain() {
    const canvasRef = useRef(null);
    class RainDrop {
        constructor(ctx,canvasH,canvasW) {
            this.ctx = ctx;
            // 画布宽高
            this.canvasH = canvasH; 
            this.canvasW = canvasW; 
            
            // 雨滴宽高
            this.rainH = Math.random() * 10 + 20; // 雨滴长度
            this.rainW = Math.random() * 1 + 2; // 雨滴宽度

            // 雨滴初始位置,这里80代表画布左边缘到雨滴左边缘的距离，120是画布顶部到雨滴顶部的距离
            this.x = Math.random() * (this.canvasW - 160) + 80;
            this.y = 150;

            // 下落速度3-8
            this.speedY = Math.random() * 5 + 3;

            //雨滴触碰到边界时的宽度增长
            this.addW = Math.random() * 0.5 + 0.5;
        }
        
        // 绘制雨滴（使用ctx的方法）
        draw() {
            const rainColors = ["#30c1e6", "#19fac6"];
            const random = Math.floor(Math.random() * rainColors.length);
            this.ctx.shadowColor = rainColors[random];
            this.ctx.shadowBlur = 10; 
            this.ctx.shadowOffsetX = 2; 
            this.ctx.shadowOffsetY = -10; 
            this.ctx.beginPath();
            this.ctx.fillStyle = rainColors[random]; 
            this.ctx.fillRect(this.x, this.y, this.rainW, this.rainH);
        }
        update() {
            this.y += this.speedY;
            // 当雨滴超出画布底部时重置
            if (this.y >= this.canvasH-10) {
                this.rainH = Math.random()*2;
                this.rainW += this.addW;
                this.speedY = 0;
                if(this.rainW >= Math.random() * 100){
                    this.rainH = Math.random() * 10 + 20; ;
                    this.rainW = Math.random() * 1 + 2;
                    this.x = Math.random() * (this.canvasW - 160) + 80;
                    this.y = 150;
                    this.speedY = Math.random() * 5 + 3;                    
                }
            }
        }
    }
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let isWhite = false;
        // 设置canvas实际宽高
        canvas.width = 500;
        canvas.height = 500;

        // 创建雨滴实例
        const rainArr = [];
        const rainNum = 100;
        for (let i = 0; i < rainNum; i++){
            rainArr.push(new RainDrop(ctx,canvas.height,canvas.width));
        }
        let timer2 = null;
        const timer1 = setInterval(() => {
            if (!timer2) clearInterval(timer2);
            timer2 = setInterval(() => {
                isWhite = !isWhite;
                console.log(isWhite);
            }, 200);
            isWhite = true;
        }, 1000);
        const animate = () => {
            // 清除整个画布区域
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.shadowColor = 'rgba(255, 255, 255, 1)'; 
            ctx.shadowBlur = 20; 
            ctx.shadowOffsetX = 2; 
            ctx.shadowOffsetY = 0; 

            ctx.save();
            ctx.translate(-20, -40);
            
            ctx.beginPath();
            ctx.moveTo(100, 180);
            ctx.lineTo(400, 180);
            // 右侧上部曲线
            ctx.arcTo(450, 180, 450, 150, 40);
            ctx.arcTo(450, 100, 400, 80, 60);
            
            // 顶部曲线
            ctx.arcTo(300, 50, 250, 80, 70);
            ctx.arcTo(200, 50, 150, 80, 60);
            
            // 左侧上部曲线
            ctx.arcTo(100, 100, 50, 130, 50);
            ctx.arcTo(50, 160, 100, 180, 40);
            
            // 闭合路径
            ctx.closePath();
            ctx.fillStyle =  isWhite ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 1)';
            ctx.fill();
            ctx.restore();
            
            rainArr.forEach(item => {
                item.update();
                item.draw();
            });
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // 清理函数
        return () => {
            cancelAnimationFrame(animate);
            clearInterval(timer1);
        };
    }, []);
    return (
        <>
            <div id="Rain">
                <canvas
                    className="canvas"
                    ref={canvasRef}
                    onMouseOver={() => canvasHover()}
                    onMouseLeave={() => canvasLeave()}
                >
                </canvas>
            </div>
        </>
    );
}

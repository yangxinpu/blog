import { useState } from 'react';
import FallingText from './components/fall-text';
import GlowCursor from './components/glow-cursor';



import './index.css';

const TransitSection = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <section id="transit-section">
      <div className="transit-falling-text-container" onClick={() => setClicked(true)}>
        <GlowCursor
            color="#17FBC6"
            secondaryColor="#A78BFA"
            trailLength={30}
            trailWidth={8}
            trailTaper={0.8}
            followSpeed={0.16}
            glowIntensity={1.9}
            glowSpread={1.2}
            hotspot={0.65}
            brightness={1.25}
            opacity={1}
            pulseSpeed={1.1}
            noiseStrength={0.035}
            idleFade
            idleTimeout={700}
            fadeDuration={900}
            blendMode="screen"
        >
            {!clicked && (
            <div className="transit-click-hint">
                <span className="transit-click-hint-text">Click Me</span>
            </div>
            )}
            <FallingText
            text={`热爱生活 热爱旅行 用脚步丈量山川湖海 用镜头记录沿途风景 用阅读丰盈内心世界 用运动唤醒身体能量 在书海中与智者对话 在奔跑中与自己和解 每一次出发 都是与更好自己的相遇 远赴人间惊鸿宴 一睹山河盛世颜 愿你我始终保持热爱 奔赴山海`}
            highlightWords={['热爱生活', '热爱旅行', '山川湖海', '沿途风景', '阅读', '运动', '智者', '相遇', '惊鸿宴', '山河盛世颜', '奔赴山海']}
            highlightClass="highlighted"
            trigger="click"
            backgroundColor="transparent"
            wireframes={false}
            gravity={0.36}
            fontSize="2rem"
            mouseConstraintStiffness={0.9}
            />        
        </GlowCursor>

      </div>
    </section>
  );
};

export default TransitSection;
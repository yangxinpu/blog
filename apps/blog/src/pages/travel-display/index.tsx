import './index.css';
import TravelImages from './components/travel-images';
import TravelHero from './components/travel-hero';
import { travelImages } from '../../assets/preload';

const leftItems = travelImages.slice(0, 10).map((img, i) => ({
  id: String(i + 1),
  img,
  url: '#',
}));

const rightItems = travelImages.slice(10, 20).map((img, i) => ({
  id: String(i + 11),
  img,
  url: '#',
}));

export default function TravelDisplay() {
  return (
    <section className="travel-display">
      <TravelHero />

      <div className="travel-display-images-section">
        <TravelImages
          items={leftItems}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="left"
          scaleOnHover
          hoverScale={0.95}
          blurToFocus
          colorShiftOnHover
        />
        <TravelImages
          items={rightItems}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="right"
          scaleOnHover
          hoverScale={0.95}
          blurToFocus
          colorShiftOnHover
        />
      </div>  
    </section>
  );
}

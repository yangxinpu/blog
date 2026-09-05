import './index.css';
import TravelImages from './components/travel-images';
import TravelHero from './components/travel-hero';

const leftItems = [
  { id: '1', img: 'https://picsum.photos/id/1015/600/900', url: 'https://example.com/item-1', height: 640 },
  { id: '2', img: 'https://picsum.photos/id/1018/600/900', url: 'https://example.com/item-2', height: 580 },
  { id: '3', img: 'https://picsum.photos/id/1019/600/900', url: 'https://example.com/item-3', height: 720 },
  { id: '4', img: 'https://picsum.photos/id/1035/600/900', url: 'https://example.com/item-4', height: 500 },
  { id: '5', img: 'https://picsum.photos/id/1036/600/900', url: 'https://example.com/item-5', height: 800 },
  { id: '6', img: 'https://picsum.photos/id/1039/600/900', url: 'https://example.com/item-6', height: 900 },
  { id: '7', img: 'https://picsum.photos/id/1043/600/900', url: 'https://example.com/item-7', height: 680 },
  { id: '8', img: 'https://picsum.photos/id/1048/600/900', url: 'https://example.com/item-8', height: 760 },
  { id: '9', img: 'https://picsum.photos/id/1051/600/900', url: 'https://example.com/item-9', height: 550 },
  { id: '10', img: 'https://picsum.photos/id/1052/600/900', url: 'https://example.com/item-10', height: 850 },
];

const rightItems = [
  { id: '11', img: 'https://picsum.photos/id/1060/600/900', url: 'https://example.com/item-11', height: 620 },
  { id: '12', img: 'https://picsum.photos/id/1061/600/900', url: 'https://example.com/item-12', height: 700 },
  { id: '13', img: 'https://picsum.photos/id/1074/600/900', url: 'https://example.com/item-13', height: 880 },
  { id: '14', img: 'https://picsum.photos/id/1075/600/900', url: 'https://example.com/item-14', height: 520 },
  { id: '15', img: 'https://picsum.photos/id/1076/600/900', url: 'https://example.com/item-15', height: 780 },
  { id: '16', img: 'https://picsum.photos/id/1080/600/900', url: 'https://example.com/item-16', height: 650 },
  { id: '17', img: 'https://picsum.photos/id/1081/600/900', url: 'https://example.com/item-17', height: 920 },
  { id: '18', img: 'https://picsum.photos/id/1084/600/900', url: 'https://example.com/item-18', height: 560 },
  { id: '19', img: 'https://picsum.photos/id/1083/600/900', url: 'https://example.com/item-19', height: 820 },
  { id: '20', img: 'https://picsum.photos/id/1096/600/900', url: 'https://example.com/item-20', height: 740 },
];

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

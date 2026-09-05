import './index.css';
import TravelImages from './components/travel-images';
import TravelHero from './components/travel-hero';

import travel01 from '../../assets/Images/travel/travel-01.jpg';
import travel02 from '../../assets/Images/travel/travel-02.jpg';
import travel03 from '../../assets/Images/travel/travel-03.jpg';
import travel04 from '../../assets/Images/travel/travel-04.jpg';
import travel05 from '../../assets/Images/travel/travel-05.jpg';
import travel06 from '../../assets/Images/travel/travel-06.jpg';
import travel07 from '../../assets/Images/travel/travel-07.jpg';
import travel08 from '../../assets/Images/travel/travel-08.jpg';
import travel09 from '../../assets/Images/travel/travel-09.jpg';
import travel10 from '../../assets/Images/travel/travel-10.jpg';
import travel11 from '../../assets/Images/travel/travel-11.jpg';
import travel12 from '../../assets/Images/travel/travel-12.jpg';
import travel13 from '../../assets/Images/travel/travel-13.jpg';
import travel14 from '../../assets/Images/travel/travel-14.jpg';
import travel15 from '../../assets/Images/travel/travel-15.jpg';
import travel16 from '../../assets/Images/travel/travel-16.jpg';
import travel17 from '../../assets/Images/travel/travel-17.jpg';
import travel18 from '../../assets/Images/travel/travel-18.jpeg';
import travel19 from '../../assets/Images/travel/travel-19.jpg';
import travel20 from '../../assets/Images/travel/travel-20.jpg';

const leftItems = [
  { id: '1',  img: travel01,  url: '#' },
  { id: '2',  img: travel02,  url: '#' },
  { id: '3',  img: travel03,  url: '#' },
  { id: '4',  img: travel04,  url: '#' },
  { id: '5',  img: travel05,  url: '#' },
  { id: '6',  img: travel06,  url: '#' },
  { id: '7',  img: travel07,  url: '#' },
  { id: '8',  img: travel08,  url: '#' },
  { id: '9',  img: travel09,  url: '#' },
  { id: '10', img: travel10,  url: '#' },
];

const rightItems = [
  { id: '11', img: travel11,  url: '#' },
  { id: '12', img: travel12,  url: '#' },
  { id: '13', img: travel13,  url: '#' },
  { id: '14', img: travel14,  url: '#' },
  { id: '15', img: travel15,  url: '#' },
  { id: '16', img: travel16,  url: '#' },
  { id: '17', img: travel17,  url: '#' },
  { id: '18', img: travel18,  url: '#' },
  { id: '19', img: travel19,  url: '#' },
  { id: '20', img: travel20,  url: '#' },
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

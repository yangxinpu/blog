import './index.css';
import TravelImages from './components/travel-images';
import TravelHero from './components/travel-hero';
import { travelImages } from '../../assets/preload';


// 图片给图片添加描述，鼠标悬停时从下面出场显示描述
const leftDescription = [
  {
    id: '1',
    title: '南宁',
    content: '走出青秀山风景区，一路向前，直面南宁繁华核心商圈万象城',
  },
  {
    id: '2',
    title: '郑州',
    content: '坐落于郑州东站对面的绿地双子塔，双塔林立，勾勒出郑州现代都市的崭新天际线',
  },
  {
    id: '3',
    title: '柳州',
    content: '马鞍山公园，俯瞰座柳州城的山水城景',
  },
  {
    id: '4',
    title: '桂林',
    content: '桂林标志性地标象鼻山，真切体会桂林山水甲天下的绝美意境',
  },
  {
    id: '5',
    title: '广州',
    content: '驻足广州珠江新城，高楼林立、霓虹璀璨——梦想之城top2',
  },
  {
    id: '6',
    title: '广州',
    content: '孙中山纪念堂，诠释着天下为公的博大情怀。',
  }
]

const rightDescription = [
  {
    id: '1',
    title: '武汉',
    content: '临江远眺，武汉绿地中心巍然矗立，浩荡长江穿城而过',
  },
  {
    id: '2',
    title: '武汉',
    content: '登千古名楼黄鹤楼，揽江城壮阔风光，昔人已乘黄鹤去，此地空余黄鹤楼',
  },
  {
    id: '3',
    title: '北海',
    content: '奔赴北海碧海银滩，海风拂面、海浪轻吟，沉浸式感受大海独有的温柔与治愈',
  },
  {
    id: '4',
    title: '重庆',
    content: '在江北嘴江滩公园远眺千厮门大桥横跨两江，洪崖洞灯火璀璨——梦想之城top1',
  },
  {
    id: '5',
    title: '天津',
    content: '海河蜿蜒穿城流淌，天塔矗立云端',
  },
  {
    id: '6',
    title: '北京',
    content: '中央广播电视总台总部大楼巍然伫立，造型独特、气势恢宏，尽显首都的庄重与现代风范',
  },
]
// 两列自动对半分：奇数张时左列多一张（ceil），图片数量增减无需改这里。
// 文案按列内顺序对应 leftDescription / rightDescription（见上方数据）。
const half = Math.ceil(travelImages.length / 2);

const leftItems = travelImages.slice(0, half).map((img, i) => ({
  id: String(i + 1),
  img,
  url: '#',
  title: leftDescription[i]?.title,
  content: leftDescription[i]?.content,
}));

const rightItems = travelImages.slice(half).map((img, i) => ({
  id: String(i + half + 1),
  img,
  url: '#',
  title: rightDescription[i]?.title,
  content: rightDescription[i]?.content,
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
        />
      </div>  
    </section>
  );
}

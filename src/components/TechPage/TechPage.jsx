import './style.scss';

import TechHeader from './pages/TechHeader/TechHeader';
import LeftItem from './pages/LeftItem/LeftItem';
import RightItem from './pages/RightItem/RightItem';

export default function TechPage() {
    return (
        <section id="Tech-page">
            <div className="header">
                <TechHeader />
            </div>
            <div className="content">
                <LeftItem />
                <RightItem />
            </div>
        </section>
    );
}
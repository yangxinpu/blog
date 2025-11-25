import './style.scss';

import HomePage from '../../HomePage/HomePage';
import IntroducePage from '../../IntroducePage/IntroducePage';
import WaterfallPage from '../../WaterfallPage/WaterfallPage';
import TechPage from '../../TechPage/TechPage';

export default function Container() {
    let deviceWidth = document.documentElement.clientWidth;
    window.addEventListener('resize', () => {
        deviceWidth = document.documentElement.clientWidth;
    });
    return (
        <div id="Container" style={{ width: deviceWidth }}>
            <HomePage />
            <IntroducePage />
            <WaterfallPage />
            <TechPage />
        </div>
    );
}

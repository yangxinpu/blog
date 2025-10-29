import './style.scss';
import { useTranslation } from 'react-i18next';

import LeftItem from './pages/LeftItem/LeftItem';
import RightItem from './pages/RightItem/RightItem';

export default function IntroducePage() {
    const { t } = useTranslation();
    return (
        <section id="IntroducePage">
            <LeftItem />
            <RightItem />
        </section>
    );
}

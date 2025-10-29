import './style.scss';
import { useTranslation } from 'react-i18next';
import Content from './pages/Content/Content.jsx';
import Header from './pages/Header/Header.jsx';
import StarryBk from './pages/StarryBk/StarryBk.jsx';

export default function Home() {
    const { t } = useTranslation();
    const motto = [
        {
            id: 1,
            text: t('HomePage.Content.motto1'),
        },
        {
            id: 2,
            text: t('HomePage.Content.motto2'),
        },
    ];
    const techTags = [
        {
            id: 1,
            text: t('HomePage.Content.frontEnd'),
            bkColor: [78, 174, 229],
            color: '#21a4f1',
        },
        {
            id: 2,
            text: t('HomePage.Content.clientEnd'),
            bkColor: [25, 250, 198],
            color: '#19fac6',
        },
    ];
    return (
        <section id="HomePage">
            <Header />
            <Content motto={motto} techTags={techTags} />
            <StarryBk />
        </section>
    );
}

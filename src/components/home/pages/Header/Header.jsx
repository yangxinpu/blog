import './style.scss'
import { useTranslation } from 'react-i18next'
import logo from '@/assets/images/logo.svg'

export default function Header() {
    const { t, i18n } = useTranslation();
    return (
        <div id="HomeHeader">
            <div className="left">
                <header>
                    <a href="/"><img className="logo" src={logo} alt="logo" /></a>
                </header>
                <div className='tickName'>{t('HomePage.Header.tickName')}</div>
            </div>
            <div className="right">
                <button onClick={() => i18n.changeLanguage(i18n.language == 'en' ? 'zh' : 'en')}>
                    <span className="icon">⇌</span>
                    <span className="language">{i18n.language == 'en' ? 'English' : 'Chinese'}</span>
                </button>
            </div>
        </div>
    )
}
import './style.scss'
import { useTranslation } from 'react-i18next'

export default function Content({ motto, techTags }) {
    const { t } = useTranslation();

    return (
        <div id="HomeContent">
            <div className="motto">{t(motto[Math.floor(Math.random() * motto.length)].text)}</div>
            <div className="introduce">{t('HomePage.Content.hobby')}</div>
            <div className="techTags">
                {techTags.map((tag) => (
                    <div key={tag.id} className="techTag" style={{ border: `1px solid ${tag.color}`, color: tag.color }}>
                        {tag.text}
                    </div>
                ))}
            </div>
        </div>
    )
}

import "./style.scss"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import Content from "./pages/Content/Content.jsx"
import Header from "./pages/Header/Header.jsx"



import catImg from "../../assets/images/cat.webp";




export default function Home() {
    const { t } = useTranslation();
    const motto = [
        {
            id: 1,
            text: t('HomePage.Content.motto1')
        },
        {
            id: 2,
            text: t('HomePage.Content.motto2')
        }    
    ]
    const techTags = [
        {
            id: 1,
            text: t('HomePage.Content.frontEnd'),
            bkColor: [78, 174, 229], 
            color: "#21a4f1",
        },
        {
            id: 2,
            text: t('HomePage.Content.clientEnd'),
            bkColor: [25, 250, 198], 
            color: "#19fac6",
        }
    ]
    return (
        <section id="Home">
            <Header />
            <Content motto={motto} techTags={techTags} />
{/*             <div className="upside">
                <div className="motto">{motto[Math.floor(Math.random() * motto.length)].text}</div>
                <div className="introduce">
                    <img className="avatar" src={catImg} alt="" />
                    <div className="text">
                        <span>naiLuo</span>
                        <span>—A enthusiast of technology</span>
                    </div>
                </div>
                <div className="tagBox">
                    <div className="technology">
                        {
                            techTags.map((item) => {
                                return (
                                    <div
                                        className="tag"
                                        key={item.id}
                                        style={{
                                            backgroundColor: `rgba(${item.bkColor}, 0.2)`,
                                            color: item.color,
                                            boxShadowColor: item.color
                                        }}>
                                        {item.text}
                                    </div>
                                )
                            })
                        }                        
                    </div>
                </div>
            </div> */}
        </section>
    )
}
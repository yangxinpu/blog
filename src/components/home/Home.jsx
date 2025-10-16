import "./style.scss"
import { useState } from "react"
import catImg from "../../assets/images/cat.webp";
import logo from "../../assets/images/logo.svg";
import Rain from "./pages/rain";

export default function Home() {
    const [motto] = useState([
        {
            id: 1,
            text: "去发明,去创造,去做事实"
        },
        {
            id: 2,
            text: "不是为了成就,而是为了追求成就"
        }
    ]);
    const [tags] = useState([
        {
            id: 1,
            text: "前端",
            bkColor: [78, 174, 229], // 对应 #4eaee5
            color: "#21a4f1",
        },
        {
            id: 2,
            text: "客户端",
            bkColor: [25, 250, 198], // 对应 #19fac6
            color: "#19fac6",
        },
        {
            id: 3,
            text: "tranquil",
            bkColor: [191, 223, 252], // 对应 #bfdffc
            color: "#bfdffc",
        },
        {
            id: 4,
            text: "steady",
            bkColor: [255, 108, 55], // 对应 #ff6c37
            color: "#ff6c37",
        },
        {
            id: 5,
            text: "humour",
            bkColor: [172, 148, 250], // 对应 #ac94fa
            color: "#ac94fa",
        }
    ]);

    return (
        <section id="Home">
            <div className="upside">
                <div className="left">
                    <div className="title">Welcome</div>
                    <div className="motto">{motto[Math.floor(Math.random() * motto.length)].text}</div>
                    <div className="info">
                        <img className="avatar" src={catImg} alt="" />
                        <div className="text">
                            <span>naiLuo</span>
                            <span>—A enthusiast of technology</span>
                        </div>
                    </div>
                    <div className="logo">
                        <img className="image" src={logo} alt="" />
                        {
                            tags.map((item) => {
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
                <div className="right">
                    <div className="container">
                        <Rain />
                    </div>
                </div>
            </div>
            <div className="underside">
                <div className="container">
                    <div className="item" style={{ animationDelay: "2.2s" }}>1</div>
                    <div className="item" style={{ animationDelay: "2.7s" }}>2</div>
                    <div className="item" style={{ animationDelay:"3.2s"}}>3</div>
                    <div className="item" style={{ animationDelay:"3.7s"}}>4</div>
                </div>
            </div>
        </section>
    )
}
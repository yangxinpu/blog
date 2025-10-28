import "./style.scss"

import Home from "../../Home/Home"

export default function Container() {
    let deviceWidth = document.documentElement.clientWidth;
    window.addEventListener('resize', () => {
        deviceWidth = document.documentElement.clientWidth;
    })
    return (
        <div id="Container" style={{width:deviceWidth}}>
            <Home />
        </div>
    )
}
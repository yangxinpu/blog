import "./style.scss"

import Home from "../../home/Home"

export default function Container() {
    let deviceWidth = window.innerWidth;
    window.addEventListener('resize', () => {
        deviceWidth = window.innerWidth;
    })
    return (
        <div id="Container" style={{width:deviceWidth}}>
            <Home />
        </div>
    )
}
import './style.scss';
import { useTranslation } from 'react-i18next';
import { useRef, useEffect, useState } from 'react';

import logo from '@/assets/images/logo.svg';

// 修改为包含四个颜色阶的数组
const selectColorThemes = [
    ['#366454', '#38967a', '#3bc8a0', '#19fac6'], // 主题1: 绿色系
    ['#042d49', '#047dd6', '#46a9ff', '#8fc7ff'], // 主题2: 蓝色系
    ['#6b041f', '#fc4870', '#ff6b8b', '#ffb3c1'], // 主题3: 粉色系
];

// 辅助函数：根据基础颜色生成颜色阶
const generateColorShades = baseColor => {
    // 将十六进制颜色转换为RGB
    const hexToRgb = hex => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : null;
    };

    // 将RGB转换为十六进制
    const rgbToHex = (r, g, b) => {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    // 调整颜色亮度
    const adjustBrightness = (rgb, amount) => {
        const r = Math.max(0, Math.min(255, rgb.r + amount));
        const g = Math.max(0, Math.min(255, rgb.g + amount));
        const b = Math.max(0, Math.min(255, rgb.b + amount));
        return rgbToHex(r, g, b);
    };

    const baseRgb = hexToRgb(baseColor);
    if (!baseRgb) return [baseColor, baseColor, baseColor, baseColor];

    return [
        adjustBrightness(baseRgb, -40), // 最暗的颜色
        adjustBrightness(baseRgb, -20), // 较暗的颜色
        baseColor, // 基础颜色
        adjustBrightness(baseRgb, 20), // 较亮的颜色
    ];
};

export default function Header() {
    const { t, i18n } = useTranslation();
    const [isThemeSelectOpen, setIsThemeSelectOpen] = useState(false); //主题选择下拉框是否打开
    const [selectedTheme, setSelectedTheme] = useState(0); //选择的主题索引
    const [customColor, setCustomColor] = useState('#f7931e'); //自定义颜色
    const [showColorPicker, setShowColorPicker] = useState(false); //是否显示颜色选择器
    const themeSelectRef = useRef(null); //主题选择下拉框引用
    const colorPickerRef = useRef(null); //颜色选择器引用

    // 点击外部区域关闭主题选择下拉框和颜色选择器
    const handleClickOutside = event => {
        if (themeSelectRef.current && !themeSelectRef.current.contains(event.target)) {
            setIsThemeSelectOpen(false);
        }
        if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
            setShowColorPicker(false);
        }
    };

    // 点击主题选项切换主题
    const handleThemeSelect = index => {
        setSelectedTheme(index);
        setIsThemeSelectOpen(false);
        document.documentElement.style.setProperty('--primary-color1', selectColorThemes[index][0]);
        document.documentElement.style.setProperty('--primary-color2', selectColorThemes[index][1]);
        document.documentElement.style.setProperty('--primary-color3', selectColorThemes[index][2]);
        document.documentElement.style.setProperty('--primary-color4', selectColorThemes[index][3]);
    };

    // 处理自定义颜色选择
    const handleCustomColorChange = color => {
        setCustomColor(color);
        const colorShades = generateColorShades(color);
        document.documentElement.style.setProperty('--primary-color1', colorShades[0]);
        document.documentElement.style.setProperty('--primary-color2', colorShades[1]);
        document.documentElement.style.setProperty('--primary-color3', colorShades[2]);
        document.documentElement.style.setProperty('--primary-color4', colorShades[3]);
        setSelectedTheme(-1); // 设置为-1表示自定义颜色
    };
    useEffect(() => {
        // 添加点击事件监听器
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // 移除点击事件监听器
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // 获取当前主题颜色
    const getCurrentThemeColor = () => {
        if (selectedTheme === -1) {
            return customColor;
        }
        return selectColorThemes[selectedTheme][3];
    };

    return (
        <div id="Header">
            <div className="left">
                <header>
                    <a href="/">
                        <img className="logo" src={logo} alt="logo" />
                    </a>
                </header>
                <div className="nickName">NaiLuo</div>
            </div>
            <div className="right">
                <div className="theme-select" ref={themeSelectRef}>
                    <div className="theme-select-trigger" onClick={() => setIsThemeSelectOpen(!isThemeSelectOpen)}>
                        <span className="theme-color" style={{ backgroundColor: getCurrentThemeColor() }}></span>
                        <span className="theme-name">
                            {selectedTheme === -1 ? t('HomePage.Header.custom') : t(`HomePage.Header.theme${selectedTheme}`)}
                        </span>
                        <span className={`theme-arrow ${isThemeSelectOpen ? 'open' : ''}`}>▼</span>
                    </div>
                    {isThemeSelectOpen && (
                        <div className="theme-select-dropdown">
                            {selectColorThemes.map((colors, index) => (
                                <div
                                    key={index}
                                    className={`theme-option ${index === selectedTheme ? 'selected' : ''}`}
                                    onClick={() => handleThemeSelect(index)}
                                >
                                    <span className="theme-color" style={{ backgroundColor: colors[3] }}></span>
                                    <span className="theme-name">{t(`HomePage.Header.theme${index}`)}</span>
                                </div>
                            ))}
                            <div
                                className={`theme-option ${selectedTheme === -1 ? 'selected' : ''}`}
                                onClick={() => setShowColorPicker(!showColorPicker)}
                            >
                                <span className="theme-color" style={{ backgroundColor: customColor }}></span>
                                <span className="theme-name">{t('HomePage.Header.custom')}</span>
                            </div>
                            {showColorPicker && (
                                <div className="color-picker-container" ref={colorPickerRef}>
                                    <input
                                        type="color"
                                        value={customColor}
                                        onChange={e => handleCustomColorChange(e.target.value)}
                                        className="color-picker"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <button className="language-btn" onClick={() => i18n.changeLanguage(i18n.language == 'en' ? 'zh' : 'en')}>
                    <span className="icon">⇌</span>
                    <span className="language">{i18n.language == 'en' ? 'English' : 'Chinese'}</span>
                </button>
            </div>
        </div>
    );
}

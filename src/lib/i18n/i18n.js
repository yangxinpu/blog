import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from "i18next-browser-languagedetector"; 

// 引入语言文件
import zhCN from './locale/zh-cn.json'
import usEN from './locale/us-en.json'


// 初始化i18n
i18n
    .use(initReactI18next) // 将i18n传递给react-i18next
    .use(LanguageDetector) // 自动检测用户语言
    .init({
        resources: {
            'zh': {
                translation: zhCN
            },
            'en': {
                translation: usEN
            }
        },
        fallbackLng: 'zh-CN', //默认语言为中文
        interpolation: {
        escapeValue: false
        }
    })

export default i18n




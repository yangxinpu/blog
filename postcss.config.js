import postcssPresetEnv from 'postcss-preset-env'// 用于处理 CSS 未来的语法特性并且兼容旧版浏览器
import cssnano from 'cssnano'// 用于压缩和优化 CSS 代码

export default {
    plugins: [
        postcssPresetEnv({
            browsers: 'last 2 versions'
        }),
        cssnano({
            preset: 'default'
        })
    ]
}
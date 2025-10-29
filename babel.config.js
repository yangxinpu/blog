export default {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    browsers: ['> 0.5%', 'last 2 versions', 'not dead'],
                },
                useBuiltIns: 'usage',
                corejs: 3,
                modules: false, // 不转换模块
            },
        ],
    ],
};

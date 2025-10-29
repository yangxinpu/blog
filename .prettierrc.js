export default {
    // 基本格式
    semi: true, // 语句是否需要分号
    tabWidth: 4, // 缩进空格数
    useTabs: false, // 使用空格而不是制表符缩进
    printWidth: 100, // 每行字符长度

    // 引号设置
    singleQuote: true, // 使用单引号而不是双引号
    jsxSingleQuote: false, // JSX 中使用双引号
    quoteProps: 'as-needed', // 仅在需要时在对象属性周围添加引号

    // 括号和逗号
    trailingComma: 'es5', // 尾随逗号
    bracketSpacing: true, // 是否在对象字面量中打印空格
    bracketSameLine: false, // 将 HTML 标签的 > 放在最后一行的末尾而不是新行
    arrowParens: 'avoid', // 箭头函数参数是否需要括号
    overrides: [
        {
            files: '*.{json,css,scss}',
            options: {
                singleQuote: false,
            },
        },
    ],
};

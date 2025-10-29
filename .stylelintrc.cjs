const stylelintConfigStandardScss = require('stylelint-config-standard-scss');

module.exports = {
    extends: [stylelintConfigStandardScss],
    rules: {
        'selector-id-pattern': null, // 关闭ID选择器的校验
        'selector-class-pattern': null, // 关闭类选择器的校验
        'keyframes-name-pattern': null, // 关闭keyframes名称的校验
        'rule-empty-line-before': null, // 关闭规则前空行的校验
        'declaration-empty-line-before': null, // 关闭声明前空行的校验
        'at-rule-empty-line-before': null, // 关闭@规则前空行的校验
        'property-no-vendor-prefix': null, // 关闭厂商前缀的校验
        'scss/double-slash-comment-whitespace-inside': null, // 关闭双斜杠注释空格的校验
    },
    ignoreFiles: [
        'docs/**/*',
        'node_modules/**/*',
        '*.min.css',
        '*.min.scss',
        'public/**/*',
        '**/*.js',
        '**/*.jsx',
        '**/*.ts',
        '**/*.tsx',
        '**/*.json',
        '**/*.md',
        '**/*.yaml',
        '**/*.yml',
        '**/*.html',
        '**/*.png',
        '**/*.jpg',
        '**/*.jpeg',
        '**/*.gif',
        '**/*.svg',
        '**/*.webp',
    ],
    overrides: [
        {
            files: ['**/*.scss', '**/*.css'],
        },
    ],
};

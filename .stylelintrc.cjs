const stylelintConfigStandardScss = require('stylelint-config-standard-scss');

module.exports = {
    extends: [stylelintConfigStandardScss],
    rules: {
        'selector-id-pattern': null,
        'selector-class-pattern': null,
        'keyframes-name-pattern': null,
        'rule-empty-line-before': null,
        'declaration-empty-line-before': null,
        'at-rule-empty-line-before': null,
        'property-no-vendor-prefix': null,
        'scss/double-slash-comment-whitespace-inside': null,
    },
    ignoreFiles: ['docs/**/*', 'node_modules/**/*', '*.min.css', '*.min.scss', 'public/**/*', 'dist/**/*', 'build/**/*'],
    overrides: [
        {
            files: ['**/*.scss', '**/*.css'],
            customSyntax: 'postcss-scss',
        },
    ],
};

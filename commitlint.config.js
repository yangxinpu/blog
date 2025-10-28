// commitlint 配置文件, 用于校验 git commit 信息,格式为: <type>(<scope>): <subject>
export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
        2,
        'always',
        [
            'feat',     // 新功能
            'fix',      // 修复 bug
            'docs',     // 文档更新
            'style',    // 代码格式修改
            'refactor', // 重构
            'perf',     // 性能优化
            'test',     // 测试相关
            'chore',    // 构建工具或依赖管理
            'ci',       // CI 配置
            'build',    // 构建相关
            'revert',   // 回滚
            'wip',       // 进行中的工作
        ]
        ],
        'type-case': [2, 'always', 'lower-case'], // type 必须小写
        'type-empty': [2, 'never'], // type 不能为空
        'scope-case': [2, 'always', 'lower-case'], // scope 必须小写
        'subject-case': [0], // 不限制 subject 大小写
        'subject-full-stop': [2, 'never', '.'], // subject 不能以 . 结尾
        'header-max-length': [2, 'always', 72], // header 最大长度
        'body-leading-blank': [1, 'always'], // body 前必须有空行
        'footer-leading-blank': [1, 'always'], // footer 前必须有空行
    }
};
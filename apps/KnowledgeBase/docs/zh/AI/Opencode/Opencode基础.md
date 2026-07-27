Opencode是一个开源 AI Coding Agent（AI 编程代理），定位类似于 Claude Code 的开源替代品。它可以调用各种大语言模型，让 AI 帮你完成整个开发流程；

安装：

```
curl -fsSL https://opencode.ai/install | bash
```

### 基本使用
#### 初始化项目

配置好提供商后，导航到你想要处理的项目目录，并且启动opencode；

在 OpenCode 的交互界面中，输入并执行以下指令：

```
/init
```

执行 `/init` 后，OpenCode 会自动完成以下操作：

1. 递归扫描当前项目的目录结构，识别项目的文件组成与层级关系；
2. 读取项目核心配置文件（如 `package.json`、`pom.xml`、`requirements.txt`、项目框架配置文件等），自动识别项目的技术栈、依赖框架、开发语言；
3. 分析项目的代码组织方式、核心模块划分，初步理解项目的业务定位与功能边界；
4. 全量分析完成后，在**项目根目录**自动生成 `AGENTS.md` 配置文件；

OpenCode 会分析你的项目并在项目根目录创建一个 `AGENTS.md` 文件（AI 智能体理解并操作项目的 “行动指南”，后续所有代码编写、重构、调试、审查等操作都会以该文件的定义为基准）；

#### 撤销修改

当你向 OpenCode 下达代码修改指令，执行完成后发现结果不符合预期时，可以使用 `/undo` 命令来撤销修改；

```
/undo
```

- OpenCode 会精准还原本次指令所修改的全部文件内容，将对应代码恢复到本次修改执行前的状态，清除本次操作产生的所有文件改动；
- 交互界面会重新展示你上一条发送的指令原文，你可以直接调整、优化提示词（补充需求、修改要求）后，重新让 OpenCode 执行任务。

#### 重做修改

执行 `/undo` 撤销修改后，若你又希望恢复刚才被撤销的修改内容，无需重新输入完整指令、等待 AI 重新生成，可以直接使用 `/redo` 快速恢复改动

```
/redo
```

执行效果：恢复上一次 `/undo` 所撤销的全部代码修改，回到撤销前的代码状态

### 常用命令

#### 默认启动 TUI

直接执行 `opencode` 或指定项目路径，即可打开终端交互界面（需要配置auth凭证）

- `--continue` / `-c`：快速继续上一个会话
- `--session` / `-s`：指定要恢复的会话 ID
- `--model` / `-m`：指定使用的模型，格式为 `提供商/模型名`
- `--agent`：指定使用的自定义代理
- `--fork`：恢复会话时分叉出新会话，不修改原会话记录

```
opencode [项目路径]
```

#### 非交互模式执行

直接传入提示词即可获取结果，无需启动完整 TUI，适合脚本编写、批量处理和快速技术查询

- `--file` / `-f`：附加本地文件作为上下文
- `--attach`：连接到已运行的 `opencode serve` 实例，避免 MCP 服务器冷启动
- `--continue` / `-c`：延续上一个会话的上下文
- `--format json`：输出原始 JSON 格式，便于程序解析调用
- `--model` / `-m`：指定执行任务的模型

```
opencode run "你的问题/指令"
```

#### 列出历史会话

查看所有历史会话记录，支持数量限制和自定义输出格式。

- `--max-count` / `-n N`：仅显示最近 N 条会话
- `--format json`：以 JSON 结构化格式输出

```
opencode session list
```

#### 用量与费用统计

查看 Token 消耗、费用明细，支持按时间、项目、模型维度筛选统计。

- `--days N`：查看最近 N 天的用量统计
- `--models N`：显示前 N 个模型的用量明细
- `--project`：按指定项目筛选统计数据

```
opencode stats
```

#### 会话导入导出

- **导出**：将会话保存为 JSON 文件，用于备份或分享
  ```
   opencode export [会话ID]
  ```

- **导入**：从本地 JSON 文件或官方分享链接恢复会话

```
  opencode import session.json
  opencode import https://opncd.ai/s/xxx
```

#### 查看可用模型

列出所有已认证提供商的可用模型，用于确认模型名称、适配配置文件；

**常用标志**：

- `--refresh`：从远程刷新模型缓存（提供商新增模型时使用）
- `--verbose`：显示详细信息，包含计费规则等元数据

```
opencode models [提供商ID]

# 仅查看 Anthropic 提供商的模型列表
opencode models anthropic
```

#### 版本升级

升级到最新版或指定版本

- `--method` / `-m`：指定安装方式（可选 curl、npm、brew 等）

```
# 升级到最新正式版
opencode upgrade

# 升级到指定版本
opencode upgrade v0.1.48
```



### 配置文件

OpenCode 采用 JSON / JSONC（支持注释的 JSON）格式的配置文件实现功能定制；配置采用多层级合并机制，不同位置的配置会按优先级叠加生效，而非完全替换；

```
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5",
  "autoupdate": true,
  "server": {
    "port": 4096
  }
}
```

#### 配置位置与优先级

**远程配置**：来自组织域名的 `.well-known/opencode` 端点，作为组织级默认值，登录对应账号后自动加载，例如：

```
   https://your-company.com/.well-known/opencode
```

**全局配置**：路径为 `~/.config/opencode/opencode.json`，存储用户跨项目的全局偏好；

**自定义配置**：通过 `OPENCODE_CONFIG` 环境变量指定的自定义配置文件路径；

```
export OPENCODE\_CONFIG=/path/to/my/custom-config.json

opencode run "Hello world"
```

**项目配置**：项目根目录下的 `opencode.json`，存放项目专属设置；

**`.opencode` 目录**：存放agent、命令、插件等扩展资源的目录，比如
    - `agents/`：自定义代理的 Markdown 定义文件；
    - `commands/`：自定义命令的定义文件；
    - `modes/`、`plugins/`、`skills/`、`tools/`、`themes/`：对应模式、插件、技能、工具、主题资源；
    
**内联配置**：无需创建 `opencode.json` 等本地配置文件，直接将完整的 JSON 格式配置内容写入 `OPENCODE_CONFIG_CONTENT` 环境变量，OpenCode 启动时自动读取生效；
```
# 直接把配置内容写在环境变量里，启动 OpenCode 
export OPENCODE_CONFIG_CONTENT='{"model": "anthropic/claude-opus-4-5", "autoupdate": false}' 

opencode run "写一个数据处理脚本"
```
#### 核心配置项详解

##### $schema规范

`$schema` 是 JSON Schema 规范中的标准元数据字段，用于声明当前 JSON/JSONC 文件所遵循的结构规范。它的值是一个 URL 地址，指向一份专门的 Schema 描述文件，这份文件会定义该类 JSON 配置里所有合法的字段、数据类型、取值范围、嵌套结构、默认值等规则；

```
{
  "$schema": "https://opencode.ai/config.json"
}
```

就相当于明确告知编辑器：这是一份 OpenCode 配置文件，请严格按照官方定义的配置规则来处理；

主流代码编辑器（VS Code、JetBrains 系列、VSCodium 等）都原生支持 JSON Schema 识别，加上 `$schema` 后会：

- 编辑器会对照官方 Schema 实时检查你的配置，写错时会直接标红提示；
- 智能自动补全，降低记忆成本；

##### 模型与提供商

用于指定默认使用的大模型、轻量模型，以及各提供商的专属参数；

| 配置项           | 说明                                            |
| ------------- | --------------------------------------------- |
| `model`       | 主模型，用于核心对话与任务执行                               |
| `small_model` | 轻量模型，用于标题生成等低算力任务；默认自动选择同提供商最便宜的模型，不可用时回退到主模型 |
| `provider`    | 各模型提供商的专属配置，支持通用参数与厂商特定参数                     |

通用提供商参数

- `timeout`：请求超时时间（毫秒），默认 300000；设为 `false` 可禁用超时；
- `setCacheKey`：强制为该提供商设置缓存键；

```
{
  "model": "anthropic/claude-sonnet-4-5", 
  "small_model": "anthropic/claude-haiku-4-5",
  "provider": {
    "anthropic": {
      "options": {
        "timeout": 600000,
        "setCacheKey": true
      }
    }
  }
}
```

厂商特定参数（以 Amazon Bedrock 为例）

```
{
  "provider": {
    "amazon-bedrock": {
      "options": {
        "region": "us-east-1",
        "profile": "my-aws-profile",
        "endpoint": "https://bedrock-runtime.us-east-1.vpce-xxxxx.amazonaws.com"
      }
    }
  }
}
```

- `region`：AWS 区域，默认读取 `AWS_REGION` 环境变量，无则为 `us-east-1`
- `profile`：AWS 凭证配置文件，默认读取 `AWS_PROFILE` 环境变量
- `endpoint`：VPC 自定义端点，优先级高于通用 `baseURL`

##### 插件

插件配置项，用于表示Opencode启动时需要加载 OpenCode 插件，扩展 OpenCode 的功能；

插件也可放置在 `.opencode/plugins/` 或全局 `plugins/` 目录下自动加载。

- 支持 npm 包：可以直接填写已发布到 npm 的插件名称；

```
{
  "plugin": ["opencode-helicone-session", "@my-org/custom-plugin"]
}
```

##### 指令文件

指令文件配置项，用于指定 OpenCode 在执行任务时自动加载的规则、规范和指导文件。模型会将这些文件内容作为额外上下文，自动遵循其中的要求；

```
{
  "instructions": [
	  "CONTRIBUTING.md", 
	  "docs/guidelines.md", 
	  ".cursor/rules/*.md"
  ]
}
```


##### TUI 终端界面配置

通过 `tui` 字段定制终端交互体验：

- `scroll_acceleration.enabled`：启用 macOS 风格滚动加速，开启后优先级高于 `scroll_speed`
- `scroll_speed`：滚动速度倍率，默认 3，最小值 1；滚动加速启用时失效
- `diff_style`：代码差异渲染方式：
    - `auto`：根据终端宽度自适应
    - `stacked`：始终单列显示

```
{
  "tui": {
    "scroll_speed": 3,
    "scroll_acceleration": {
      "enabled": true
    },
    "diff_style": "auto"
  }
}
```

##### 服务器配置

通过 `server` 字段配置 `opencode serve` 和 `opencode web` 命令的 HTTP 服务，是 OpenCode 对外提供 API 或 Web 界面时的核心配置：

- `port`：服务监听端口
- `hostname`：监听主机名；启用 mDNS 且未设置时，默认为 `0.0.0.0`
- `mdns`：启用 mDNS 服务发现，允许局域网内其他设备发现该服务
- `mdnsDomain`：mDNS 自定义域名，默认 `opencode.local`，用于同网络多实例区分
- `cors`：允许跨域访问的来源列表，需填写完整源地址（协议 + 主机 + 端口）

```
{
  "server": {
    "port": 4096,
    "hostname": "0.0.0.0",
    "mdns": true,
    "mdnsDomain": "myproject.local",
    "cors": ["http://localhost:5173"]
  }
}
```

通过`opencode serve` （只启动后端服务）或 `opencode web`（启动后端服务和内置Web前端服务）启动Opencode服务，后续局域网内多个客户端可以通过对应地址连接和访问服务； 
##### 工具开关

通过 `tools` 字段控制 OpenCode 中 LLM（大模型）能够调用哪些内置工具：

```
{
  "tools": {
    // 允许模型读取项目中的文件内容，例如查看代码、配置文件、日志等。
    "read": true,

    // 允许模型创建、修改、删除文件。
    "write": true,

    // 允许模型对已有文件进行精确编辑（如替换、插入、删除部分内容）。
    "edit": true,

    // 允许模型执行终端命令
    "bash": true,

    // 允许模型在项目中搜索指定字符串，相当于 grep / rg（ripgrep）。
    "grep": true,

    // 允许模型按名称、路径或通配符查找文件，相当于 glob。
    "glob": true,

    // 允许模型访问互联网
    "web": true,

    // 允许模型调用配置好的 MCP（Model Context Protocol）服务器。
    "mcp": true
  }
}
```

##### Agent配置

**自定义代理**

通过 `agent` 字段可以自定义不同的agent，适配不同任务场景；每个agent可独立指定模型、系统提示词、可用工具集。agent也可通过`.opencode`目录下的 `agents/` 目录下的 Markdown 文件定义；

```
{
  "agent": {
    "code-reviewer": {
      "description": "Reviews code for best practices and potential issues",
      "model": "anthropic/claude-sonnet-4-5",
      "prompt": "You are a code reviewer. Focus on security, performance, and maintainability.",
      "tools": {
        "write": false,
        "edit": false
      }
    }
  }
}
```

**默认代理**

通过 `default_agent` 设置全局默认代理，未显式指定代理时使用：

- 支持内置代理（如 `build`、`plan`）或自定义主代理；
- 若指定代理不存在或为子代理，自动回退到 `build` 并输出警告
- 对 TUI、CLI、桌面端、GitHub Action 所有界面生效

```
{
  "default_agent": "plan"
}
```

##### 自定义命令

通过 `command` 字段定义快捷命令，简化重复任务：

- `template`：命令触发时的提示词模板，支持 `$ARGUMENTS` 变量接收用户传入参数
- `description`：命令描述，用于帮助提示
- `agent` / `model`：可指定该命令专属的代理与模型

命令也可通过 `commands/` 目录下的 Markdown 文件定义。

```
{
  "command": {
    "test": {
      "template": "Run the full test suite with coverage report and show any failures.\nFocus on the failing tests and suggest fixes.",
      "description": "Run tests with coverage",
      "agent": "build",
      "model": "anthropic/claude-haiku-4-5"
    },
    "component": {
      "template": "Create a new React component named $ARGUMENTS with TypeScript support.\nInclude proper typing and basic structure.",
      "description": "Create a new component"
    }
  }
}
```

##### 权限控制

通过 `permission` 字段配置操作审批机制，默认所有操作无需确认，将对应工具设为 `ask` 后，模型执行该操作前必须获得用户手动确认。

```
{
  "permission": {
    "edit": "ask",
    "bash": "ask"
  }
}
```

##### 自动更新

通过 `autoupdate` 控制版本更新行为：

- `true`：启动时自动下载更新（默认）
- `false`：完全禁用自动更新
- `"notify"`：仅通知新版本，不自动下载

注意：通过 Homebrew 等包管理器安装时，该功能无效。

```
{
  "autoupdate": false
}
```

##### 代码格式化程序

通过 `formatter` 配置代码格式化规则，它决定了AI 修改代码后如何自动格式化文件，支持禁用内置格式化器或添加自定义命令：

- `disabled`：禁用对应内置格式化器
- `command`：自定义格式化命令，`$FILE` 为待格式化文件占位符
- `environment`：命令执行的环境变量
- `extensions`：该格式化器适用的文件扩展名

```
{
  "formatter": {
    "prettier": {
      "disabled": true
    },
    "custom-prettier": {
      "command": ["npx", "prettier", "--write", "$FILE"],
      "environment": {
        "NODE_ENV": "development"
      },
      "extensions": [".js", ".ts", ".jsx", ".tsx"]
    }
  }
}
```

##### 上下文压缩

通过 `compaction` 控制会话上下文压缩策略，节省 Token 消耗：

- `auto`：上下文占满时自动压缩，默认开启
- `prune`：删除旧的工具输出以节省 Token，默认关闭
- `reserved`：压缩时保留的 Token 缓冲区，避免压缩过程中溢出

```
{
  "compaction": {
    "auto": true,
    "prune": false,
    "reserved": 10000
  }
}
```

##### 文件监视器

通过 `watcher` 配置文件监听的忽略规则：

- `ignore`：glob 模式数组，排除无需监听的高频变动目录

```
{
  "watcher": {
    "ignore": ["node_modules/**", "dist/**", ".git/**"]
  }
}
```


### MCP

#### MCP 相关CLI

交互式添加 MCP 服务器：（支持本地 / 远程服务器）

```
opencode mcp add
```

列出已配置的服务器及连接状态：

```
opencode mcp list
```

对支持 OAuth 的服务器完成认证：

```
opencode mcp auth [服务器名]
```

#### MCP 配置

通过 `mcp` 字段配置 MCP（Model Context Protocol）服务器接入，支持远程 MCP 服务配置，可单独控制每个服务的启用状态；

- `type`：MCP 服务类型，指定 OpenCode 如何连接该服务。
    - `remote`：连接远程 MCP 服务（通过 HTTP/HTTPS）。
    - `stdio`：启动本地 MCP 服务进程，并通过标准输入/输出（stdin/stdout）通信
- `command`：启动本地 MCP 服务的命令，仅 `type: "stdio"` 时使用
- `args`：启动命令的参数列表，仅 `type: "stdio"` 时使用
- `url`：远程 MCP 服务地址，仅 `type: "remote"` 时使用
- `enabled`：是否启用该 MCP 服务。
    - `true`：启用，OpenCode 启动时会连接或启动该 MCP 服务。
    - `false`：禁用，配置保留但不会加载该 MCP 服务。
- `cwd`（部分 MCP 支持）：指定启动本地 MCP 服务时的工作目录（Current Working Directory）

```
{
  "mcp": {
    "jira": {
      "type": "remote",
      "url": "https://jira.example.com/mcp",
      "enabled": true
    },
	"filesystem": { 
	  "type": "stdio", 
	  "command": "npx", 
	  "args": [ "-y", "@modelcontextprotocol/server-filesystem", "/Users/nailuo/projects" ], 
	  "enabled": true 
	}
  }
}
```

#### OAuth 身份认证

对于支持 OAuth 且支持动态客户端注册（RFC 7591）的服务器，无需特殊配置，只需声明地址即可：

```
{
  "mcp": {
    "my-oauth-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp"
    }
  }
}
```

首次使用该服务器工具时，OpenCode 会自动检测 401 响应并拉起浏览器完成 OAuth 授权；授权后 Token 会安全存储在 `~/.local/share/opencode/mcp-auth.json` 中。

预注册客户端凭据：如果已从服务商获得固定的 OAuth 客户端 ID 和密钥，可以手动配置：

```
{
  "mcp": {
    "my-oauth-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp",
      "oauth": {
        "clientId": "{env:MY_MCP_CLIENT_ID}",
        "clientSecret": "{env:MY_MCP_CLIENT_SECRET}",
        "scope": "tools:read tools:execute"
      }
    }
  }
}
```


#### LSP

LSP语言服务器协议（Language Server Protocol），OpenCode 通过与各类 LSP 服务器集成，可将语言服务器输出的代码诊断信息作为智能体（agent）的反馈依据，辅助 agent 自动发现并修复代码中的语法、类型、规范等问题

- LSP 功能默认关闭，启用后会根据文件扩展名自动匹配并启动对应语言的 LSP 服务器；
- 内置数十种主流编程语言 / 框架的 LSP 支持，部分服务器支持自动下载安装；
- 支持自定义 LSP 服务器、配置启动参数、环境变量与初始化选项

所有 LSP 相关配置均在 `opencode.json` 文件的 `lsp` 字段中完成

```
{ 
	"$schema": "https://opencode.ai/config.json", 
	"lsp": true  //直接开启全部内置 LSP 服务器
}
```

精简常用配置

- `disabled`：设为 `true` 禁用对应服务器，默认 `false` 为启用
- `command`：自定义启动命令，留空则使用 OpenCode 默认启动方式
- `extensions`：自定义该服务器关联的文件后缀，留空使用默认扩展名
- `env`：启动服务器时注入的环境变量
- `initialization`：LSP 初始化阶段传递给服务器的专属配置
- 末尾的 `custom-lsp-example` 是自定义 LSP 服务器示例，默认禁用，可参考格式添加自有 LSP

```
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": {
    "typescript": {
      "disabled": false,
      "initialization": {
        "preferences": {
          "importModuleSpecifierPreference": "relative"
        }
      }
    },
    "eslint": {
      "disabled": true
    },
    "rust": {
      "env": {
        "RUST_LOG": "info"
      }
    }
  }
}
```

#### GitHub MCP

直接操作 GitHub 仓库，支持查询 Issue/PR、浏览提交记录、搜索代码片段、查看文件内容、评论协作等，让 AI 自动排查 Issue、审查 PR 代码、统计仓库提交、查找仓库内最佳实践

```
{
  "mcp": {
    "github": {
      "type": "remote",
      "url": "https://github.com/mcp",
      "oauth": {}
    }
  }
}
```

配置后执行 `opencode mcp auth github` 完成授权即可使用。
#### Firecrawl MCP

精准抓取任意网页的干净结构化内容，自动过滤广告、HTML 噪声，支持单页抓取和整站爬取，让 AI 直接阅读技术文档、官方更新日志、竞品官网、技术博客，无需手动复制粘贴

```
{
  "mcp": {
    "firecrawl": {
      "type": "remote",
      "url": "https://mcp.firecrawl.dev",
      "headers": {
        "Authorization": "Bearer {env:FIRECRAWL_API_KEY}"
      }
    }
  }
}
```
### 常用skills

```
请严格遵循 OpenCode 官方技能规范，批量完成以下 9 个技能的全局安装与配置，确保所有文件格式合规、可被原生 skill 工具正常识别加载，完成后输出安装成功验证结果。

=== 执行总规则 ===
1. 存放路径：全局统一安装至 ~/.config/opencode/skills/<技能名>/SKILL.md，每个技能独立目录，目录名与技能 name 字段完全一致，严格遵循「小写字母+单连字符」命名规范，主文件必须为全大写 SKILL.md。
2. 文件规范：每个 SKILL.md 顶部必须包含标准 YAML frontmatter，必填 name、description 字段，补充 license、compatibility: opencode、metadata 信息；正文包含核心功能、适用场景、调用规则与执行逻辑。
3. 安装优先级：有官方开源仓库的技能优先从对应仓库拉取完整文件；社区通用型技能按规范生成完整可用的 SKILL.md 内容。
4. 配置更新：同步更新全局 opencode.json，plugin 字段补充对应插件，permission.skill 默认配置为 "*": "allow"，确保所有技能可被 agent 自动识别调用。

=== 分技能安装要求 ===
#### 通用类
1. superpowers（插件型）
   - 仓库地址：https://github.com/obra/superpowers.git
   - 安装方式：在 opencode.json 的 plugin 数组中添加 "superpowers@git+https://github.com/obra/superpowers.git"
   - 校验：确保插件自动注册全部子技能，可通过 skill 工具正常列出

2. understand-anything
   - 仓库地址：https://github.com/Lum1104/Understand-Anything
   - 安装方式：克隆仓库后提取对应 skill 文件至全局目录，补全 OpenCode 兼容的 frontmatter
   - 功能：代码库知识图谱生成、语义搜索、依赖关系梳理

3. self-improvement
   - 安装方式：按规范生成完整 SKILL.md
   - 核心逻辑：跨会话记录开发错误与解决方案，同类问题自动规避，自动沉淀避坑知识库

4. caveman
   - 安装方式：按规范生成完整 SKILL.md
   - 核心逻辑：精简输出内容，削减 65% 冗余叙述话术，完整保留技术事实与代码内容

#### 代码质量与架构类
5. architecture
   - 安装方式：按规范生成完整 SKILL.md
   - 核心逻辑：输出系统架构方案、技术选型、模块划分、Mermaid 架构图，适配不同项目规模

6. code-reviewer
   - 安装方式：按规范生成完整 SKILL.md
   - 核心逻辑：多维度代码审查，覆盖 Bug、性能、安全、代码异味，同步输出优化代码与修改理由

7. test-generator
   - 安装方式：按规范生成完整 SKILL.md
   - 核心逻辑：自动生成单元/集成测试用例，覆盖正向、异常、边界场景，适配主流测试框架

#### 前端设计专项
8. impeccable
   - 仓库地址：https://github.com/pbakaus/impeccable
   - 安装方式：提取 OpenCode 兼容的 skill 文件至全局目录，确保 7 大设计领域规则、23 个专项命令全部生效

9. taste-skill
   - 仓库地址：https://github.com/Leonxlnx/taste-skill
   - 安装方式：克隆全套技能至全局目录，确保 12 个子技能（风格类、功能类、场景类）全部可被识别

=== 最终校验与输出 ===
全部安装完成后，按以下顺序输出结果：
1. 已安装技能完整清单（技能名 + 对应目录路径）
2. opencode.json 核心配置片段（plugin + permission.skill）
3. 3 个基础调用示例（分别对应通用、代码质量、前端三类技能）
4. 最终确认：所有技能格式合规、可直接加载使用
```
#### 通用

- **Obra Superpowers（superpowers）**
    
    核心功能：目前最完整的多智能体开发框架，集成头脑风暴、工作树管理、测试驱 动开发、子代理调度、系统化调试等 170 + 项编程技能，覆盖从需求到上线的全流程。
    
    适用场景：全栈开发、复杂项目迭代、需要标准化开发流程的团队。
    
    特点：为 agent 注入专业开发团队的工作方法论，大幅提升代码质量与任务完成度。
    
- **Understand-Anything**
    
    核心功能：基于图结构的代码理解工具，可将任意代码库转化为可交互知识图谱，支持模糊搜索、语义搜索与项目导览，快速理清文件依赖、模块关系与业务逻辑。
    
    适用场景：接手陌生项目、阅读大型开源代码库、梳理遗留系统架构。
    
    特点：解决 AI 处理大项目时 “看不全、理不清” 的痛点，显著降低代码理解成本。
    
- **self-improvement（自我进化）**
    
    核心功能：赋予 agent 跨会话记忆能力，自动记录开发过程中的踩坑点、错误案例与最终解决方案，同类问题复现时自动规避重复错误。
    
    适用场景：长期日常开发、使用固定技术栈的个人或团队项目。
    
    特点：越使用越贴合个人编码习惯，相当于专属的踩坑避坑知识库。
    
- **Caveman**
    
    核心功能：平均削减 65% 的输出 token，剥离冗余叙述性话术，完整保留全部技术事实与代码内容。
    
    适用场景：长会话开发、大文件生成、需要控制 token 成本的场景。
    
    特点：在不损失信息的前提下显著提升响应速度、节省模型开销。

#### 代码质量与架构

- **architecture**
    
    核心功能：自动完成系统架构设计，生成架构图与技术选型方案，覆盖模块划分与部署设计。
    
    适用场景：新项目搭建、旧系统重构、技术方案评审选型。
    
    特点：内置主流架构模式，可适配不同项目规模，输出规范可落地。
    
- **code-reviewer**
    
    核心功能：多维度智能代码审查，自动识别潜在 Bug、性能问题、安全漏洞与代码异味。
    
    适用场景：代码提交质检、存量代码排查、团队代码规范统一。
    
    特点：同步给出优化代码与修改理由，支持自定义审查规则。
    
- **test-generator**
    
    核心功能：基于代码自动生成单元、集成测试用例，覆盖正向、异常与边界场景。
    
    适用场景：存量项目补测试、新功能同步写测试、TDD 开发流程。
    
    特点：适配主流测试框架，重点覆盖人工易漏场景，提升测试覆盖率。

#### 前端设计专项

- **Impeccable**
    
    核心功能：前端设计反模式词典，自动识别并修正 AI 生成的廉价感 UI，对齐专业设计标准。
    
    适用场景：前端页面打磨、UI 体验审查、项目设计规范统一。
    
    特点：覆盖 7 大设计领域，从根源消除模板化廉价感，提升页面专业度。
    
- **Taste Skill**
    
    核心功能：包含 12 种子技能，支持多种设计风格控制，内置截图转代码完整工作流。
    
    适用场景：多风格前端开发、参考图还原代码、UI 重构与品牌视觉搭建。
    
    特点：框架无关，可精准控制布局、动效与密度，输出风格稳定统一


### 常用插件

#### oh-my-opencode-slim

这是目前 OpenCode 生态中下载量最高、社区讨论最活跃的插件套件，定位类似终端界的 Oh My Zsh，核心目标是全方位增强 OpenCode 的开发工作流，主打多 Agent 智能编排能力

 **四大核心 Agent 详解：**

- Sisyphus（西西弗斯）- 主编排 Agent：整个 Agent 团队的核心协调者与 “项目经理”，是全局默认生效的主入口 Agent，负责用户意图识别、复杂任务拆解、子 Agent 委派调度、输出结果校验与整体进度推进；

- Prometheus（普罗米修斯）- 战略规划师：专注技术方案设计的专家 Agent，核心原则为 “只做规划不落地编码”；

- Atlas（阿特拉斯）- 上下文与任务调度官：智能维护会话上下文，按信息优先级动态保留核心内容；

- Hephaestus（赫菲斯托斯）- 深度执行 Worker：负责端到端落地具体开发任务；

安装：

```
opencode plugin --global oh-my-opencode-slim
```

注意：安装后首次启动会自动初始化 Agent 配置；若没有 Claude 订阅，需在配置文件中手动为 Sisyphus 指定可用模型，否则编排性能会显著下降

#### Dynamic Context Pruning（DCP）

 解决的核心问题：对话轮次增加 → 上下文不断膨胀 → Token 消耗指数上升 → 模型注意力分散、回答质量下降 → 更容易出现幻觉和逻辑错误

DCP 插件会在后台实时监控对话上下文，遵循 “保留核心、裁剪冗余” 的原则动态优化消息链；

安装

```
opencode plugin --global @tarquinen/opencode-dcp
```

可在 `opencode.json` 配置文件中自定义压缩阈值、保留规则、触发时机等参数。


#### opencode-history-search

一款历史会话语义搜索插件，让你用自然语言快速找回过往的开发记录，不用手动翻找历史聊天窗口。

安装：

```
opencode plugin --global opencode-history-search
```

安装后直接在 OpenCode 对话中用自然语言提问历史相关问题，插件会自动检索并返回匹配的会话内容。


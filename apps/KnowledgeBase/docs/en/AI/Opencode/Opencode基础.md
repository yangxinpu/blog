Opencode is an open-source AI Coding Agent, positioned as an open-source alternative to Claude Code. It can call various large language models to help you complete the entire development workflow.

Installation:

```
curl -fsSL https://opencode.ai/install | bash
```

### Basic Usage
#### Initialize Project

After configuring the provider, navigate to the project directory you want to work on and start opencode.

In the OpenCode interactive interface, enter and execute the following command:

```
/init
```

After executing `/init`, OpenCode will automatically complete the following operations:

1. Recursively scan the current project directory structure to identify the file composition and hierarchy;
2. Read the project's core configuration files (such as `package.json`, `pom.xml`, `requirements.txt`, project framework configuration files, etc.), automatically identify the project's technology stack, dependency frameworks, and development language;
3. Analyze the project's code organization, core module division, and initially understand the project's business positioning and functional boundaries;
4. After the full analysis is completed, automatically generate the `AGENTS.md` configuration file in the **project root directory**;

OpenCode will analyze your project and create an `AGENTS.md` file in the project root directory (the "action guide" for AI agents to understand and operate the project. All subsequent code writing, refactoring, debugging, review, and other operations will be based on the definitions in this file).

#### Undo Changes

When you give OpenCode a code modification command and find the result does not meet expectations after execution, you can use the `/undo` command to undo the modification.

```
/undo
```

- OpenCode will precisely restore all file contents modified by this command, restore the corresponding code to the state before this modification was executed, and clear all file changes produced by this operation;
- The interactive interface will redisplay the original text of your last sent command. You can directly adjust and optimize the prompt (add requirements, modify requirements) and then let OpenCode execute the task again.

#### Redo Changes

After executing `/undo` to undo modifications, if you want to restore the modifications that were just undone, you don't need to re-enter the complete command and wait for the AI to regenerate. You can directly use `/redo` to quickly restore the changes.

```
/redo
```

Execution effect: Restore all code modifications undone by the last `/undo`, returning to the code state before the undo.

### Common Commands

#### Default TUI Launch

Execute `opencode` directly or specify a project path to open the terminal interactive interface (auth credentials required).

- `--continue` / `-c`: Quickly continue the previous session
- `--session` / `-s`: Specify the session ID to restore
- `--model` / `-m`: Specify the model to use, format as `provider/model-name`
- `--agent`: Specify the custom agent to use
- `--fork`: Fork a new session when restoring a session without modifying the original session record

```
opencode [project path]
```

#### Non-interactive Mode Execution

Pass prompts directly to get results without launching the complete TUI. Suitable for script writing, batch processing, and quick technical queries.

- `--file` / `-f`: Attach local files as context
- `--attach`: Connect to an already running `opencode serve` instance to avoid MCP server cold start
- `--continue` / `-c`: Continue the context of the previous session
- `--format json`: Output raw JSON format for easy program parsing
- `--model` / `-m`: Specify the model for task execution

```
opencode run "Your question/command"
```

#### List History Sessions

View all historical session records, with support for quantity limits and custom output formats.

- `--max-count` / `-n N`: Display only the last N sessions
- `--format json`: Output in JSON structured format

```
opencode session list
```

#### Usage and Cost Statistics

View Token consumption and cost details, with support for filtering statistics by time, project, and model dimensions.

- `--days N`: View usage statistics for the last N days
- `--models N`: Display usage details for the top N models
- `--project`: Filter statistics by specified project

```
opencode stats
```

#### Session Import/Export

- **Export**: Save a session as a JSON file for backup or sharing
  ```
   opencode export [session ID]
  ```

- **Import**: Restore a session from a local JSON file or official sharing link

```
  opencode import session.json
  opencode import https://opncd.ai/s/xxx
```

#### View Available Models

List all available models from authenticated providers, used to confirm model names and configuration file compatibility.

**Common flags**:

- `--refresh`: Refresh model cache from remote (used when providers add new models)
- `--verbose`: Display detailed information including billing rules and other metadata

```
opencode models [provider ID]

# View only Anthropic provider's model list
opencode models anthropic
```

#### Version Upgrade

Upgrade to the latest version or a specified version.

- `--method` / `-m`: Specify the installation method (optional: curl, npm, brew, etc.)

```
# Upgrade to the latest official version
opencode upgrade

# Upgrade to a specified version
opencode upgrade v0.1.48
```

### Configuration Files

OpenCode uses JSON / JSONC (JSON with comments) format configuration files for feature customization. Configuration uses a multi-level merging mechanism, where configurations from different locations are overlayed by priority rather than completely replaced.

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

#### Configuration Location and Priority

**Remote configuration**: From the `.well-known/opencode` endpoint of the organization's domain name, serving as the organization-level default value. Automatically loaded after logging into the corresponding account, for example:

```
   https://your-company.com/.well-known/opencode
```

**Global configuration**: Path is `~/.config/opencode/opencode.json`, storing user's cross-project global preferences.

**Custom configuration**: Custom configuration file path specified via the `OPENCODE_CONFIG` environment variable.

```
export OPENCODE_CONFIG=/path/to/my/custom-config.json

opencode run "Hello world"
```

**Project configuration**: `opencode.json` in the project root directory, storing project-specific settings.

**`.opencode` directory**: Directory for storing agent, command, plugin, and other extension resources, such as:
    - `agents/`: Custom agent Markdown definition files;
    - `commands/`: Custom command definition files;
    - `modes/`, `plugins/`, `skills/`, `tools/`, `themes/`: Corresponding mode, plugin, skill, tool, and theme resources;

**Inline configuration**: No need to create local configuration files like `opencode.json`. Directly write the complete JSON format configuration content into the `OPENCODE_CONFIG_CONTENT` environment variable, which OpenCode reads automatically at startup.
```
# Write the configuration content directly in the environment variable, then start OpenCode
export OPENCODE_CONFIG_CONTENT='{"model": "anthropic/claude-opus-4-5", "autoupdate": false}' 

opencode run "Write a data processing script"
```

#### Core Configuration Items Explained

##### $schema Specification

`$schema` is a standard metadata field in the JSON Schema specification, used to declare the structural specification followed by the current JSON/JSONC file. Its value is a URL pointing to a dedicated Schema description file, which defines all valid fields, data types, value ranges, nested structures, default values, and other rules in this type of JSON configuration.

```
{
  "$schema": "https://opencode.ai/config.json"
}
```

This is equivalent to explicitly telling the editor: This is an OpenCode configuration file, please strictly follow the officially defined configuration rules to process it.

Mainstream code editors (VS Code, JetBrains series, VSCodium, etc.) all natively support JSON Schema recognition. Adding `$schema` will:

- The editor will check your configuration against the official Schema in real-time and directly mark errors in red when mistakes are made;
- Smart auto-completion reduces memory costs.

##### Model and Provider

Used to specify the default large model, lightweight model, and provider-specific parameters.

| Configuration Item | Description |
| ------------------ | ----------- |
| `model` | Main model, used for core conversation and task execution |
| `small_model` | Lightweight model, used for low-computing tasks such as title generation; defaults to automatically selecting the cheapest model from the same provider, falls back to the main model when unavailable |
| `provider` | Provider-specific configuration for each model, supporting common parameters and vendor-specific parameters |

Common provider parameters:

- `timeout`: Request timeout (milliseconds), default 300000; set to `false` to disable timeout;
- `setCacheKey`: Force a cache key for the provider;

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

Vendor-specific parameters (taking Amazon Bedrock as an example):

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

- `region`: AWS region, defaults to reading the `AWS_REGION` environment variable, otherwise `us-east-1`
- `profile`: AWS credential profile, defaults to reading the `AWS_PROFILE` environment variable
- `endpoint`: VPC custom endpoint, takes precedence over the general `baseURL`

##### Plugins

Plugin configuration item, used to indicate which OpenCode plugins need to be loaded when Opencode starts, extending OpenCode's functionality.

Plugins can also be placed in `.opencode/plugins/` or the global `plugins/` directory for automatic loading.

- Supports npm packages: You can directly fill in the names of plugins already published to npm.

```
{
  "plugin": ["opencode-helicone-session", "@my-org/custom-plugin"]
}
```

##### Instruction Files

Instruction file configuration item, used to specify the rules, specifications, and guidance files that OpenCode automatically loads when executing tasks. The model will use these file contents as additional context and automatically follow the requirements in them.

```
{
  "instructions": [
	  "CONTRIBUTING.md", 
	  "docs/guidelines.md", 
	  ".cursor/rules/*.md"
  ]
}
```

##### TUI Terminal Interface Configuration

Customize the terminal interaction experience through the `tui` field:

- `scroll_acceleration.enabled`: Enable macOS-style scroll acceleration, takes precedence over `scroll_speed` when enabled
- `scroll_speed`: Scroll speed multiplier, default 3, minimum 1; disabled when scroll acceleration is enabled
- `diff_style`: Code difference rendering method:
    - `auto`: Adapts to terminal width
    - `stacked`: Always displays in single column

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

##### Server Configuration

Configure the HTTP service for `opencode serve` and `opencode web` commands through the `server` field. This is the core configuration when OpenCode provides API or web interface externally:

- `port`: Service listening port
- `hostname`: Listening hostname; defaults to `0.0.0.0` when mDNS is enabled and not set
- `mdns`: Enable mDNS service discovery, allowing other devices on the local network to discover this service
- `mdnsDomain`: mDNS custom domain name, default `opencode.local`, used to distinguish multiple instances on the same network
- `cors`: List of allowed cross-origin access sources, requires complete source addresses (protocol + host + port)

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

Start the Opencode service through `opencode serve` (backend service only) or `opencode web` (backend service + built-in web frontend service). Multiple clients on the local network can then connect and access the service through the corresponding address.

##### Tool Switch

Control which built-in tools the LLM (large language model) can call in OpenCode through the `tools` field:

```
{
  "tools": {
    // Allow the model to read file contents in the project, e.g., view code, configuration files, logs, etc.
    "read": true,

    // Allow the model to create, modify, and delete files.
    "write": true,

    // Allow the model to perform precise edits on existing files (e.g., replace, insert, delete parts of content).
    "edit": true,

    // Allow the model to execute terminal commands
    "bash": true,

    // Allow the model to search for specified strings in the project, equivalent to grep / rg (ripgrep).
    "grep": true,

    // Allow the model to find files by name, path, or wildcard, equivalent to glob.
    "glob": true,

    // Allow the model to access the internet
    "web": true,

    // Allow the model to call configured MCP (Model Context Protocol) servers.
    "mcp": true
  }
}
```

##### Agent Configuration

**Custom Agents**

Customize different agents through the `agent` field to adapt to different task scenarios. Each agent can independently specify models, system prompts, and available tool sets. Agents can also be defined through Markdown files in the `agents/` directory under `.opencode`.

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

**Default Agent**

Set the global default agent through `default_agent`, used when no agent is explicitly specified:

- Supports built-in agents (such as `build`, `plan`) or custom main agents;
- If the specified agent does not exist or is a sub-agent, automatically falls back to `build` and outputs a warning
- Effective for TUI, CLI, desktop, and GitHub Action interfaces

```
{
  "default_agent": "plan"
}
```

##### Custom Commands

Define shortcut commands through the `command` field to simplify repetitive tasks:

- `template`: Prompt template when the command is triggered, supports `$ARGUMENTS` variable to receive user input parameters
- `description`: Command description for help prompts
- `agent` / `model`: Can specify the agent and model exclusive to this command

Commands can also be defined through Markdown files in the `commands/` directory.

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

##### Permission Control

Configure operation approval mechanism through the `permission` field. By default, all operations require no confirmation. Setting the corresponding tool to `ask` requires manual user confirmation before the model executes the operation.

```
{
  "permission": {
    "edit": "ask",
    "bash": "ask"
  }
}
```

##### Auto Update

Control version update behavior through `autoupdate`:

- `true`: Automatically download updates on startup (default)
- `false`: Completely disable automatic updates
- `"notify"`: Only notify of new versions, do not automatically download

Note: This feature is ineffective when installed through package managers like Homebrew.

```
{
  "autoupdate": false
}
```

##### Code Formatter

Configure code formatting rules through `formatter`, which determines how AI automatically formats files after modifying code. Supports disabling built-in formatters or adding custom commands:

- `disabled`: Disable the corresponding built-in formatter
- `command`: Custom formatting command, `$FILE` is a placeholder for the file to be formatted
- `environment`: Environment variables for command execution
- `extensions`: File extensions applicable to this formatter

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

##### Context Compaction

Control session context compression strategy through `compaction` to save Token consumption:

- `auto`: Automatically compress when context is full, enabled by default
- `prune`: Delete old tool outputs to save Tokens, disabled by default
- `reserved`: Token buffer reserved during compression to avoid overflow during compression

```
{
  "compaction": {
    "auto": true,
    "prune": false,
    "reserved": 10000
  }
}
```

##### File Watcher

Configure ignore rules for file monitoring through `watcher`:

- `ignore`: Array of glob patterns, excluding high-frequency change directories that do not need to be monitored

```
{
  "watcher": {
    "ignore": ["node_modules/**", "dist/**", ".git/**"]
  }
}
```

### MCP

#### MCP-related CLI

Interactively add MCP servers: (supports local / remote servers)

```
opencode mcp add
```

List configured servers and connection status:

```
opencode mcp list
```

Complete authentication for servers that support OAuth:

```
opencode mcp auth [server name]
```

#### MCP Configuration

Configure MCP (Model Context Protocol) server access through the `mcp` field, supporting remote MCP service configuration and individual control of each service's enabled status:

- `type`: MCP service type, specifying how OpenCode connects to the service.
    - `remote`: Connect to a remote MCP service (via HTTP/HTTPS).
    - `stdio`: Start a local MCP service process and communicate through standard input/output (stdin/stdout)
- `command`: Command to start the local MCP service, only used when `type: "stdio"`
- `args`: Parameter list for the startup command, only used when `type: "stdio"`
- `url`: Remote MCP service address, only used when `type: "remote"`
- `enabled`: Whether to enable the MCP service.
    - `true`: Enable, OpenCode will connect or start the MCP service on startup.
    - `false`: Disable, configuration is retained but the MCP service will not be loaded.
- `cwd` (supported by some MCPs): Specify the working directory (Current Working Directory) when starting the local MCP service

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

#### OAuth Authentication

For servers that support OAuth and dynamic client registration (RFC 7591), no special configuration is required, just declare the address:

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

When using the server tool for the first time, OpenCode will automatically detect the 401 response and launch the browser to complete OAuth authorization. After authorization, the Token will be securely stored in `~/.local/share/opencode/mcp-auth.json`.

Pre-registered client credentials: If you have obtained fixed OAuth client ID and secret from the service provider, you can configure them manually:

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

Language Server Protocol (LSP). OpenCode integrates with various LSP servers, allowing language server output code diagnostics to be used as feedback for agents, helping agents automatically discover and fix syntax, type, and specification issues in code.

- LSP functionality is disabled by default. When enabled, it automatically matches and starts the corresponding language LSP server based on file extensions;
- Built-in support for dozens of mainstream programming languages/frameworks. Some servers support automatic download and installation;
- Supports custom LSP servers, configuring startup parameters, environment variables, and initialization options.

All LSP-related configurations are completed in the `lsp` field of the `opencode.json` file.

```
{ 
	"$schema": "https://opencode.ai/config.json", 
	"lsp": true  // Enable all built-in LSP servers directly
}
```

Simplified common configuration:

- `disabled`: Set to `true` to disable the corresponding server, default `false` to enable
- `command`: Custom startup command, leave empty to use OpenCode's default startup method
- `extensions`: Custom file suffixes associated with the server, leave empty to use default extensions
- `env`: Environment variables injected when starting the server
- `initialization`: Exclusive configuration passed to the server during LSP initialization
- The trailing `custom-lsp-example` is a custom LSP server example, disabled by default. You can add your own LSP by referencing the format.

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

Directly operate GitHub repositories, supporting querying Issues/PRs, browsing commit records, searching code snippets, viewing file contents, commenting and collaborating, etc. Let AI automatically troubleshoot Issues, review PR code, count repository commits, and find best practices within the repository.

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

After configuration, execute `opencode mcp auth github` to complete authorization and start using.

#### Firecrawl MCP

Precisely capture clean structured content from any webpage, automatically filter ads and HTML noise, support single-page capture and whole-site crawling. Let AI directly read technical documentation, official changelogs, competitor websites, and technical blogs without manual copy-paste.

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

### Common Skills

```
Please strictly follow the OpenCode official skill specifications to complete the global installation and configuration of the following 9 skills in batches. Ensure all file formats are compliant and can be normally recognized and loaded by the native skill tool. Output the installation success verification results after completion.

=== Execution Rules ===
1. Storage path: Globally install to ~/.config/opencode/skills/<skill name>/SKILL.md. Each skill has an independent directory. The directory name must be exactly the same as the skill name field. Strictly follow the "lowercase letters + single hyphen" naming convention. The main file must be SKILL.md in all uppercase.
2. File specifications: Each SKILL.md must contain standard YAML frontmatter at the top, with required name and description fields. Supplement license, compatibility: opencode, and metadata information. The body contains core functions, applicable scenarios, calling rules, and execution logic.
3. Installation priority: Skills with official open-source repositories should prioritize pulling complete files from the corresponding repositories. Community general-purpose skills should generate complete and usable SKILL.md content according to specifications.
4. Configuration update: Synchronously update the global opencode.json. Add corresponding plugins to the plugin field. Configure permission.skill default to "*": "allow" to ensure all skills can be automatically identified and called by agents.

=== Skill Installation Requirements ===
#### General Category
1. superpowers (plugin type)
   - Repository address: https://github.com/obra/superpowers.git
   - Installation method: Add "superpowers@git+https://github.com/obra/superpowers.git" to the plugin array in opencode.json
   - Verification: Ensure the plugin automatically registers all sub-skills, which can be normally listed through the skill tool

2. understand-anything
   - Repository address: https://github.com/Lum1104/Understand-Anything
   - Installation method: Clone the repository, extract the corresponding skill files to the global directory, and complete the OpenCode-compatible frontmatter
   - Function: Codebase knowledge graph generation, semantic search, dependency relationship sorting

3. self-improvement
   - Installation method: Generate complete SKILL.md according to specifications
   - Core logic: Record development errors and solutions across sessions, automatically avoid similar problems, and automatically accumulate a pitfall avoidance knowledge base

4. caveman
   - Installation method: Generate complete SKILL.md according to specifications
   - Core logic: Simplify output content, cut 65% of redundant narrative phrases, and completely retain technical facts and code content

#### Code Quality and Architecture Category
5. architecture
   - Installation method: Generate complete SKILL.md according to specifications
   - Core logic: Output system architecture plans, technology selection, module division, Mermaid architecture diagrams, adapting to different project scales

6. code-reviewer
   - Installation method: Generate complete SKILL.md according to specifications
   - Core logic: Multi-dimensional code review, covering bugs, performance, security, and code smells, simultaneously outputting optimized code and modification reasons

7. test-generator
   - Installation method: Generate complete SKILL.md according to specifications
   - Core logic: Automatically generate unit/integration test cases, covering positive, abnormal, and boundary scenarios, adapting to mainstream testing frameworks

#### Frontend Design Specialization
8. impeccable
   - Repository address: https://github.com/pbakaus/impeccable
   - Installation method: Extract OpenCode-compatible skill files to the global directory, ensuring all 7 design domain rules and 23 special commands take effect

9. taste-skill
   - Repository address: https://github.com/Leonxlnx/taste-skill
   - Installation method: Clone the complete set of skills to the global directory, ensuring all 12 sub-skills (style, function, scenario categories) can be recognized

=== Final Verification and Output ===
After all installations are complete, output results in the following order:
1. Complete list of installed skills (skill name + corresponding directory path)
2. Core configuration snippet of opencode.json (plugin + permission.skill)
3. 3 basic calling examples (corresponding to general, code quality, and frontend categories respectively)
4. Final confirmation: All skills are format-compliant and can be directly loaded and used
```

#### General

- **Obra Superpowers (superpowers)**
    
    Core functions: Currently the most complete multi-agent development framework, integrating brainstorming, work tree management, test-driven development, sub-agent scheduling, systematic debugging, and more than 170 programming skills, covering the entire process from requirements to launch.
    
    Applicable scenarios: Full-stack development, complex project iterations, teams that need standardized development processes.
    
    Features: Inject professional development team work methodologies into agents, significantly improving code quality and task completion.
    
- **Understand-Anything**
    
    Core functions: Graph-based code understanding tool, capable of converting any codebase into an interactive knowledge graph, supporting fuzzy search, semantic search, and project navigation, quickly clarifying file dependencies, module relationships, and business logic.
    
    Applicable scenarios: Taking over unfamiliar projects, reading large open-source codebases, sorting out legacy system architectures.
    
    Features: Solves the pain point of AI "not seeing the whole picture and not understanding clearly" when handling large projects, significantly reducing code understanding costs.
    
- **self-improvement**
    
    Core functions: Endow agents with cross-session memory capabilities, automatically record pitfalls, error cases, and final solutions during development, and automatically avoid repeated errors when similar problems recur.
    
    Applicable scenarios: Long-term daily development, personal or team projects using fixed technology stacks.
    
    Features: The more it is used, the more it fits personal coding habits, equivalent to an exclusive pitfall avoidance knowledge base.
    
- **Caveman**
    
    Core functions: Reduce output tokens by an average of 65%, strip redundant narrative phrases, and completely retain all technical facts and code content.
    
    Applicable scenarios: Long-session development, large file generation, scenarios where token costs need to be controlled.
    
    Features: Significantly improve response speed and save model overhead without losing information.

#### Code Quality and Architecture

- **architecture**
    
    Core functions: Automatically complete system architecture design, generate architecture diagrams and technology selection plans, covering module division and deployment design.
    
    Applicable scenarios: New project setup, old system refactoring, technical scheme review and selection.
    
    Features: Built-in mainstream architecture patterns, adaptable to different project scales, with standardized and implementable output.
    
- **code-reviewer**
    
    Core functions: Multi-dimensional intelligent code review, automatically identifying potential bugs, performance issues, security vulnerabilities, and code smells.
    
    Applicable scenarios: Code submission quality inspection, stock code troubleshooting, team code specification unification.
    
    Features: Simultaneously provide optimized code and modification reasons, supporting custom review rules.
    
- **test-generator**
    
    Core functions: Automatically generate unit and integration test cases based on code, covering positive, abnormal, and boundary scenarios.
    
    Applicable scenarios: Stock project test supplementation, new feature synchronous testing, TDD development process.
    
    Features: Adapts to mainstream testing frameworks, focusing on scenarios that are easily missed by humans, improving test coverage.

#### Frontend Design Specialization

- **Impeccable**
    
    Core functions: Frontend design anti-pattern dictionary, automatically identifying and correcting AI-generated cheap UI, aligning with professional design standards.
    
    Applicable scenarios: Frontend page polishing, UI experience review, project design specification unification.
    
    Features: Covers 7 design domains, eliminating template-based cheapness from the root, improving page professionalism.
    
- **Taste Skill**
    
    Core functions: Contains 12 sub-skills, supporting multiple design style controls, with built-in complete screenshot-to-code workflow.
    
    Applicable scenarios: Multi-style frontend development, reference image code restoration, UI refactoring, and brand visual building.
    
    Features: Framework-agnostic, precise control over layout, animation, and density, with stable and unified output style.

### Common Plugins

#### oh-my-opencode-slim

This is currently the most downloaded and most discussed plugin suite in the OpenCode ecosystem, positioned similarly to Oh My Zsh in the terminal world. Its core goal is to comprehensively enhance OpenCode's development workflow, focusing on multi-Agent intelligent orchestration capabilities.

**Four Core Agents Explained:**

- Sisyphus - Chief Orchestration Agent: The core coordinator and "project manager" of the entire Agent team, the default primary entry Agent that takes effect globally. Responsible for user intent recognition, complex task decomposition, sub-Agent delegation and scheduling, output result verification, and overall progress advancement;

- Prometheus - Strategic Planner: Expert Agent focused on technical solution design, with the core principle of "only planning, not implementing code";

- Atlas - Context and Task Scheduler: Intelligently maintains session context, dynamically retaining core content by information priority;

- Hephaestus - Deep Execution Worker: Responsible for end-to-end implementation of specific development tasks;

Installation:

```
opencode plugin --global oh-my-opencode-slim
```

Note: After installation, the first startup will automatically initialize the Agent configuration. If you do not have a Claude subscription, you need to manually specify an available model for Sisyphus in the configuration file, otherwise the orchestration performance will drop significantly.

#### Dynamic Context Pruning (DCP)

Core problem solved: Conversation rounds increase → Context continuously expands → Token consumption increases exponentially → Model attention diverges, answer quality decreases → More prone to hallucinations and logical errors

The DCP plugin monitors conversation context in real-time in the background, following the principle of "retain core, trim redundancy" to dynamically optimize the message chain.

Installation:

```
opencode plugin --global @tarquinen/opencode-dcp
```

You can customize compression thresholds, retention rules, trigger timing, and other parameters in the `opencode.json` configuration file.

#### opencode-history-search

A historical session semantic search plugin that allows you to quickly retrieve past development records using natural language, without manually browsing historical chat windows.

Installation:

```
opencode plugin --global opencode-history-search
```

After installation, directly ask history-related questions in natural language in OpenCode conversations, and the plugin will automatically retrieve and return matching session content.
# Agent Playbook

> AI Agent (Claude Code) 实用指南、提示词和技能集合

[English](./README.md) | 简体中文

## 概述

本仓库整理并存储了使用 Claude Code 等 AI Agent 的实用资源，包括提示词模板、自定义技能、使用示例和最佳实践。

## 安装

### 方法一：符号链接（推荐）

将技能链接到全局 Claude Code 技能目录：

```bash
# 为每个技能创建符号链接
ln -s /path/to/agent-playbook/skills/*.md ~/.claude/skills/
```

示例：

```bash
ln -s ~/Documents/code/GitHub/agent-playbook/skills/self-improving-prd.md ~/.claude/skills/
ln -s ~/Documents/code/GitHub/agent-playbook/skills/architecting-solutions.md ~/.claude/skills/
ln -s ~/Documents/code/GitHub/agent-playbook/skills/planning-with-files.md ~/.claude/skills/
```

### 方法二：复制技能

直接将技能复制到全局 Claude Code 目录：

```bash
cp /path/to/agent-playbook/skills/*.md ~/.claude/skills/
```

### 方法三：添加到项目特定技能

用于项目特定用途，在项目中创建 `.claude/skills` 目录：

```bash
mkdir -p .claude/skills
cp /path/to/agent-playbook/skills/*.md .claude/skills/
```

### 验证安装

列出已安装的技能：

```bash
ls -la ~/.claude/skills/
```

## 项目结构

```text
agent-playbook/
├── prompts/       # 提示词模板和示例
├── skills/        # 自定义技能文档
├── agents/        # Agent 配置和用例
├── examples/      # 完整使用示例
└── README.md      # 项目文档
```

## 目录内容

### [prompts/](./prompts/)

各种场景的提示词模板：
- 代码生成
- 代码审查
- 调试
- 文档编写
- 其他用例

### [skills/](./skills/)

Claude Code 自定义技能文档：

#### 元技能

| 技能 | 描述 |
|------|------|
| **[skill-router](./skills/skill-router/)** | 智能路由，将用户请求引导至最合适的技能 |
| **[create-pr](./skills/create-pr/)** | 创建 PR 并自动更新中英文文档 |
| **[session-logger](./skills/session-logger/)** | 保存对话历史到会话日志文件 |

#### 核心开发

| 技能 | 描述 |
|------|------|
| **[commit-helper](./skills/commit-helper/)** | 遵循 Conventional Commits 规范的 Git 提交信息 |
| **[code-reviewer](./skills/code-reviewer/)** | 全面审查代码质量、安全性和最佳实践 |
| **[debugger](./skills/debugger/)** | 系统性调试和问题解决 |
| **[refactoring-specialist](./skills/refactoring-specialist/)** | 代码重构和技术债务减少 |

#### 文档与测试

| 技能 | 描述 |
|------|------|
| **[documentation-engineer](./skills/documentation-engineer/)** | 技术文档和 README 编写 |
| **[api-documenter](./skills/api-documenter/)** | OpenAPI/Swagger API 文档 |
| **[test-automator](./skills/test-automator/)** | 自动化测试框架设置和测试创建 |
| **[qa-expert](./skills/qa-expert/)** | 质量保证策略和质量标准 |

#### 架构与运维

| 技能 | 描述 |
|------|------|
| **[api-designer](./skills/api-designer/)** | REST 和 GraphQL API 架构设计 |
| **[security-auditor](./skills/security-auditor/)** | 覆盖 OWASP Top 10 的安全审计 |
| **[performance-engineer](./skills/performance-engineer/)** | 性能优化和分析 |
| **[deployment-engineer](./skills/deployment-engineer/)** | CI/CD 流水线和部署自动化 |

#### 规划与架构

| 技能 | 描述 |
|------|------|
| **[prd-planner](./skills/prd-planner/)** | 使用持久化文件规划创建 PRD（避免上下文切换） |
| **[prd-implementation-precheck](./skills/prd-implementation-precheck/)** | 实现 PRD 前进行预检查 |
| **[architecting-solutions](./skills/architecting-solutions.md)** | 技术方案和架构设计（非 PRD 专用） |
| **[planning-with-files](./skills/planning-with-files.md)** | 通用的多步骤任务文件规划 |
| **[self-improving-prd](./skills/self-improving-prd.md)** | 带反思循环的自我改进 PRD |

### [agents/](./agents/)

Agent 配置和使用模式：
- 特定场景的 Agent 配置
- Agent 协作模式
- 最佳实践和案例研究

### [examples/](./examples/)

完整的使用示例和教程

## 使用方法

安装后，技能在任何 Claude Code 会话中自动可用。你可以通过以下方式调用：

1. **直接激活** - 技能根据上下文自动激活（例如提到 "PRD"、"planning"）
2. **手动调用** - 明确要求 Claude 使用特定技能

示例：

```
你：帮我创建一个新认证功能的 PRD
```

architecting-solutions 技能将自动激活。

## 更新技能

当你更新 agent-playbook 中的技能时，符号链接确保你始终使用最新版本。更新方法：

```bash
cd /path/to/agent-playbook
git pull origin main
```

如果使用复制的技能，重新复制更新的文件：

```bash
cp /path/to/agent-playbook/skills/*.md ~/.claude/skills/
```

## 贡献

欢迎贡献！欢迎提交包含你自己的提示词、技能或用例的 PR。

## 许可证

MIT License

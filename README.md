# dsh-webnovel-writer

[中文](#中文) · [English](#english)

## 中文

`dsh-webnovel-writer` 是一个 DeepSeek Harness（DSH）能力插件。它不会创建或替换 agent preset，而是把网文创作能力注册到当前 profile 中的 agent：

- `webnovel-writing`：策划、大纲、文件持久化记忆、逐章写作、一致性审校、发布与可恢复回滚；
- `webnovel-style-profile`：从授权样本或抽象要求提炼可执行的文风画像，并用于章节自检；
- 一段轻量路由提示：遇到网文任务时先加载对应技能，不覆盖现有 persona。

### 安装

从 npm 安装（发布后）：

```bash
dsh plugin --profile web add dsh-webnovel-writer
```

从 GitHub 安装：

```bash
dsh plugin --profile web add github:RrcoVer0/dsh-webnovel-writer
```

重启 DSH 后，在任意已有 agent 中直接提出网文任务。例如：

```text
在当前工作区为《夜班诊室》建立项目，先给策划书和前 20 章大纲，等我确认后再写正文。
```

```text
读取现有进度、设定与记忆和第 12 章结尾，续写第 13 章。保留我给出的开头原文。
```

### 它不会做什么

- 不注册新的 preset，不替换模型或 persona；
- 不在插件启动时扫描、上传或修改作品文件；
- 不自带第三方小说原文或作者风格语料；
- 不绕过 DSH 的文件权限和审批机制。

插件只注册技能说明和路由提示。真正的文件读写由当前 agent 已有的 DSH 工具完成。

### 本地验证

```bash
npm test
npm run check
npm run pack:check
```

## English

`dsh-webnovel-writer` adds Chinese web-fiction workflows to agents in an existing DeepSeek Harness profile. It registers two runtime skills plus a short routing prompt; it does not install or replace an agent preset.

- `webnovel-writing`: planning, outlines, file-backed canon, chapter drafting, consistency review, publishing, and recoverable rollback.
- `webnovel-style-profile`: converts authorized samples or abstract style requirements into an actionable style profile and review checklist.

Install after npm publication:

```bash
dsh plugin --profile web add dsh-webnovel-writer
```

The plugin performs no network requests and does not modify manuscript files during startup. File operations remain under the host agent's normal tools, sandbox, and approval policy.

## Compatibility

- Node.js 20 or newer.
- DSH `0.1.6-alpha.2` through versions below `0.2.0`.
- Requires the host profile to provide the standard `skills` and `systemPrompt` services.

## License

MIT


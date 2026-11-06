# 约定（通用化版）

> ⚠️ 下列带「示例品牌」标记的条目是**原作者的 cbugs 规范**，不是 Obsidian 平台要求。按 `CUSTOMIZE.md` 替换。`rules/` 里保留了原始规范全文（已脱敏），可对照。

## 平台硬约束（不可改）

| 项 | 要求 |
|---|---|
| 产物 | `main.js`（CJS）、`manifest.json`、可选 `styles.css` |
| 位置 | `<vault>/.obsidian/plugins/<id>/` |
| `id` | 必须等于插件目录名，全局唯一 |
| external | `obsidian`、`electron`、`@codemirror/*`、`@lezer/*`、Node builtins 一律不打进 bundle |
| 重载 | 源码改动后必须重载插件（或靠热重载） |
| 版本 | `manifest.json` / `package.json` / `versions.json` 三者一致 |

## 示例品牌规范（可替换）

- 插件 ID 以 `cbugs-` 开头，目录名与 ID 一致
- 显示名以 `CBugs` 开头，作者固定 `cBugs`
- 起始版本 `0.1.0`，语义化版本
- 不写 `authorUrl` / `fundingUrl`
- ID 里连字符不超过 2 个（纯组织习惯，方便排序）

`rules/ob-manifest-rule.md` 有 ID → Name 的映射规则与示例。

## 代码与 UI 约定

- **样式走 `styles.css`，不用 `injectStyles()`**：方便热重载监听、也方便主题覆盖。
- **`addCommand` 必带 `icon`**：Obsidian 命令面板需要图标（官方 `setIcon` / lucide 名）。
- UI 优先官方原生 helper：`createEl()` / `createDiv()` / `createSpan()`、`Setting`、`Modal`、`ItemView`、`Notice`（见[官方 HTML elements 文档](https://docs.obsidian.md/Plugins/User+interface/HTML+elements)）。设置页标题用 `new Setting(...).setHeading()` 而非手写 `<h1>`，这也是 [Plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines) 的审核意见之一。
- 源码分模块放 `src/`，`main.ts` 只管生命周期（`onload` / `onunload` / 注册命令）。

## 初始化阶段的边界（原作者约定，可调整）

原始规范把「初始化」与「业务开发」严格分开：初始化只搭框架，**禁止**跑 `pnpm run build` / `pnpm run dev` / `ob-sync.sh` / `version-bump.mjs`，也禁止改 `main.ts` / `src/` / `styles.css`；这些交给使用者或后续阶段。

理由：框架与业务分离、保持模板纯净、提交由使用者自行管理。

⚠️ **实测矛盾**：同批文件里的 `REQUIREMENTS.md` 又把 `pnpm run build && ./ob-sync.sh` 写成「功能完成流程」。两者口径不一致。本套件的 `AGENTS.md` 采用更实用的版本：确认品牌/路径后由 Agent 跑完整个闭环，但**不擅自提交**。你按自己团队习惯选一种，别两套并存。

## 工具链

| 层 | 本套件默认 | 可替换 |
|---|---|---|
| 包管理 | pnpm（`packageManager` 字段声明版本） | npm / yarn / bun |
| 打包 | esbuild（`esbuild.config.mjs`） | Rollup / Vite / `Bun.build()`（注意层界，见 `pitfalls.md`） |
| 类型 | TypeScript，`tsc -noEmit` | — |
| 版本控制 | jj（原作者）或 git | — |
| 发布 | **不在本仓库范围内** | 见 `roadmap.md` 的范围说明 |

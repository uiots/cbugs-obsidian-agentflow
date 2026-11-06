# cbugs-obsidian-agentflow

> 一套给 coding agent 用的 Obsidian 社区插件开发工作流：脚手架 → 构建 → 自动同步 → 热重载。

[English](README.md) · [文档](docs/) · [Issues](https://github.com/uiots/cbugs-obsidian-agentflow/issues)

**项目状态：** 面向独立开发者的个人验证与快速实践工具、学习项目。它把一套能跑通的配置沉淀成可复制的起点，**不是**生产级框架、Obsidian 官方标准或团队规范。请按需扩展，结合你自己的项目调整；见[定制](#定制)。

## 为什么需要它

Obsidian 从 `<vault>/.obsidian/plugins/<id>/` 只加载三个产物：`main.js`、`manifest.json`、`styles.css`，而源码通常在别处。`esbuild --watch` 只在源码目录重建 `main.js`，不会把它搬进 vault，于是插件始终不重载。本仓库把这次搬运做成配置，并接到一个监听 vault 的热重载插件上。

## 仓库内容

| 路径 | 内容 |
| --- | --- |
| `AGENTS.md` | 给 coding agent 的入口指令与硬约束 |
| `CUSTOMIZE.md` | **必读**——采用前哪些必须替换 |
| `docs/workflow.md` | 脚手架 → 构建 → 同步 → 重载 → debug 的完整流程 |
| `docs/conventions.md` | 命名、manifest、版本、样式等约定 |
| `docs/pitfalls.md` | 12 条踩坑，逐条标注【实测】/【调研】/【取舍】 |
| `docs/ecosystem-notes.md` | 社区工具链调研结论与证据等级 |
| `docs/roadmap.md` | **尚未实现**的部分（尤其 release / 发布） |
| `rules/` | 原始规范文档，已脱敏，仅作参考 |
| `template/` | 可直接复制的插件脚手架（路径可配置的 `ob-sync.sh`、esbuild 配置） |
| `hot-reload/` | 自研热重载插件源码（与 `pjeby/hot-reload` 二选一） |

`docs/` 下的文档为中文。

## 环境要求

- Node.js 18+ 与 pnpm（npm / yarn / bun 亦可，见 `docs/conventions.md`）
- Obsidian 桌面端；自带的热重载插件使用了桌面端限定 API
- 一个可写的 **sandbox** vault 用于验证——不要把这套流程指向你的活跃库

## 快速开始

```bash
git clone https://github.com/uiots/cbugs-obsidian-agentflow.git
cd cbugs-obsidian-agentflow

cat CUSTOMIZE.md                       # 必读：采用前先按需替换

cp -R template/ ../my-plugin
cd ../my-plugin
pnpm install

echo "/path/to/your/vault/.obsidian/plugins" > .vault-path
# 或：export OBSIDIAN_PLUGINS_DIR=/path/to/your/vault/.obsidian/plugins

pnpm run sync                          # 首次部署：搬运三件套
pnpm run dev                           # watch；main.js 直接写进 vault
```

然后在 Obsidian → 社区插件里启用你的插件与 `hot-reload/`。把 `AGENTS.md` 交给你的 coding agent，并让它读 `docs/workflow.md`。

## 工作原理

```
源码（main.ts、styles.css）
  |  esbuild 打包 —— CJS；obsidian / electron / codemirror 保持 external
  v
main.js + manifest.json + styles.css
  |  搬运 —— ob-sync.sh，或 dev 模式把 outfile 直接写进 vault
  v
<vault>/.obsidian/plugins/<id>/
  |  监听到 vault 内文件变化
  v
hot-reload -> disablePlugin(id) -> enablePlugin(id)
```

- **模式 A（推荐）**：设置 `OBSIDIAN_PLUGINS_DIR`（或 `.vault-path`），`pnpm run dev` 会把 `main.js` 直接写进 vault，一条命令闭环。
- **模式 B**：`pnpm run build` 本地产出，再 `pnpm run sync` 搬运。路径缺失或目录不存在会报错退出，不会静默在别处建目录。

两种模式详见 `docs/workflow.md`。自带的热重载插件监听 vault 内文件变化，不需要 `.hotreload` 标记。

## 定制

`CUSTOMIZE.md` 列出采用前必须替换的内容：插件 ID、显示名与作者；vault 路径；包管理器与工具版本；版本控制系统；以及热重载实现。`rules/` 里是已脱敏的原始规范，仅作参考——它反映的是某一个开发者的环境，不是平台要求。

请把 `docs/` 当作参考，结合你自己的技术栈、vault 布局与发布流程来扩展，并在自己的机器上复验标 **【实测】** 的结论。

## 项目状态

| 阶段 | 状态 |
| --- | --- |
| 脚手架、命名 / manifest 约定 | ✅ 可用 |
| `pnpm run build` | ✅ sandbox 实跑验证 |
| `ob-sync.sh`（路径可配置、缺失报错） | ✅ sandbox 实跑验证 |
| dev 模式直写 vault | ✅ sandbox 实跑验证 |
| 热重载闭环 | ✅ 可构建、源码齐备；**实际重载未在 Obsidian 内驱动验证**，依赖内部 API（见 `docs/pitfalls.md`） |
| **Release / 发布**——tag、GitHub Actions、changelog、`versions.json`、社区目录提交、BRAT | ❌ **未完成** |

详见 `docs/roadmap.md`。这是一套仍在成长的工作流，不是成品框架；请勿假设发布阶段已经存在。

## 贡献

欢迎 issue 与 PR。补充踩坑时请标注 **【实测】**（附 OS、Obsidian 与工具版本）或 **【推测】**，见 `docs/pitfalls.md`。不要提交密钥、真实 vault 路径、`main.js` 或 `node_modules/`。

## 许可

MIT — 见 `LICENSE`。

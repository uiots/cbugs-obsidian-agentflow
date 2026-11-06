# Obsidian Agent Dev Kit

> An agent-ready starter kit for Obsidian community plugin development: scaffold → build → auto-sync → hot-reload. Ships conventions, hard-won pitfalls, and an honest roadmap.

一套**给 coding agent 用的** Obsidian 插件开发套件。

它本身不是插件，而是一套「开发模式 + 可复制资产」：clone 之后把 `template/` 复制成新插件，把根目录的 `AGENTS.md` 交给你的 Agent，就能快速搭起**脚手架 → 构建 → 自动同步到 vault → 自动热重载 → debug** 这一整套闭环。

## 这套东西解决什么

Obsidian 插件的产物只有三个文件（`main.js` / `manifest.json` / `styles.css`），但源码通常在别处。常见痛点是：改了代码、`esbuild --watch` 也重建了，插件却没重载——因为产物没进 vault，或者热重载没监听到。本仓库把这段搬运做成配置而不是人工步骤。

## 5 分钟上手

```bash
git clone https://github.com/<OWNER>/obsidian-agent-dev-kit.git
cd obsidian-agent-dev-kit

# 1) 先读定制清单（必读，别照单全收）
cat CUSTOMIZE.md

# 2) 复制脚手架
cp -R template/ ../my-plugin && cd ../my-plugin

# 3) 告诉它你的 vault 在哪（二选一）
echo "/path/to/your/vault/.obsidian/plugins" > .vault-path
# 或： export OBSIDIAN_PLUGINS_DIR=/path/to/your/vault/.obsidian/plugins

# 4) 装依赖 + 起 watch（产物直接写进 vault）
pnpm install
pnpm run dev

# 5) 在 Obsidian 里启用 hot-reload/ 这个插件（见 docs/workflow.md）
```

然后把 `AGENTS.md` 指给你的 Agent，让它按 `docs/workflow.md` 干活。

## 目录

| 路径 | 作用 |
|---|---|
| `CUSTOMIZE.md` | **必读**。哪些必须替换、哪些不建议照抄 |
| `AGENTS.md` | 给 coding agent 的入口指令与硬约束 |
| `docs/workflow.md` | 整套开发 / debug / 同步 / 热重载流程 |
| `docs/conventions.md` | 命名、manifest、版本、样式等约定（通用化版） |
| `docs/pitfalls.md` | 踩坑总结（含实测证据） |
| `docs/ecosystem-notes.md` | 社区技术栈调研结论与一手来源 |
| `docs/roadmap.md` | **未完成**事项，尤其是 release / 发布阶段 |
| `rules/` | 原始 cbugs 规范文档（已脱敏，含本机口味，仅作参考） |
| `template/` | 可直接复制的插件脚手架 |
| `hot-reload/` | 自研热重载插件源码（与 pjeby/hot-reload 二选一） |

## 当前成熟度（诚实声明）

| 阶段 | 状态 |
|---|---|
| 脚手架 / 命名 / manifest 约定 | ✅ 可用 |
| `pnpm run build` 产出三件套 | ✅ 实跑验证 |
| `ob-sync.sh` 自动同步（路径可配置） | ✅ 实跑验证（sandbox） |
| `esbuild --watch` 直写 vault | ✅ 实跑验证 |
| hot-reload 自动重载闭环 | ✅ 源码齐备、`pnpm run build` 实跑通过；**实际重载未在 Obsidian 内驱动验证**（未操作 UI），依赖内部 API 见 `pitfalls.md` |
| **release / 发布（tag、GH Actions、changelog、versions.json、社区目录提交、BRAT）** | ❌ **未完成**，见 `docs/roadmap.md` |

**这是一套还在成长的工作流，不是成品框架。** 请勿假设它覆盖发布阶段。

## 不要全采纳

`cbugs-` 前缀、`CBugs` 品牌、`jj` 版本控制、`pnpm@8`、外置盘路径、`@electron/remote` 热重载实现……都是**原作者的实际选择**，不是标准。哪些该换、换成什么，见 `CUSTOMIZE.md`。

## License

MIT — 见 `LICENSE`。欢迎 issue / PR 补充你自己的踩坑。

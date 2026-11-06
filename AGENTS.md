# AGENTS.md — 给 coding agent 的入口

> 你（Agent）正在一个 Obsidian 插件开发套件仓库里。开始前按顺序读：`CUSTOMIZE.md` → `docs/workflow.md` → `docs/conventions.md` → `docs/pitfalls.md`。

## 你的目标

帮使用者从 `template/` 快速起一个可开发、可 debug、可热重载的 Obsidian 插件；或维护本套件本身。

## 硬约束（不要违反）

1. **不要写活跃 vault**。开发/验证一律用临时 sandbox vault；只有使用者明确给出目标路径时才同步。
2. **不要提交 `.vault-path`、真实绝对路径、密钥、`node_modules/`、`main.js` 产物**。`.gitignore` 已列。
3. **不要 `git add -A`**。工作区可能混有其他 Agent 的未提交改动，按主题分组提交。
4. **`template/` 是模板，不是运行目录**。别在 `template/` 里装依赖或跑构建；先复制到新目录。
5. **不要假设 release 流程存在**。tag / GH Actions / 发布 / 社区目录提交尚未实现，见 `docs/roadmap.md`。
6. **品牌名与路径必须按 `CUSTOMIZE.md` 替换**，不要把 `cbugs-` / `CBugs` 当成标准输出给使用者。

## 标准工作流

```
1. 读 CUSTOMIZE.md，向使用者确认：品牌前缀、vault 路径、包管理器
2. cp -R template/ <DEV_ROOT>/<plugin-id>/
3. 写 .vault-path（或设 OBSIDIAN_PLUGINS_DIR）
4. 全局替换品牌/ID/description/minAppVersion，保持 manifest/package.json/versions.json 版本一致
5. pnpm install
6. pnpm run dev        # esbuild watch，产物直写 vault
7. 在 Obsidian 启用 hot-reload（见 docs/workflow.md）
8. 改一行 main.ts → 确认 vault 里 main.js 更新 → 确认插件自动重载
9. 每完成一个功能：pnpm run build && ./ob-sync.sh（如走手动同步模式）
```

## 两条同步模式，别混用

- **模式 A（推荐）**：`pnpm run dev` 时设置 `OBSIDIAN_PLUGINS_DIR`，esbuild 的 `outfile` 直接写进 vault → hot-reload 监听 → 改代码即重载。`ob-sync.sh` 只在首次部署 / 手动发布时用。
- **模式 B**：watch 写本地 `main.js`，每次手动跑 `./ob-sync.sh` 搬运。两段式，容易漏。

两套 hot-reload（本仓库自研版 / pjeby 版）**只启用一个**；自研版不需要 `.hotreload` 标记，pjeby 版需要。

## 排查顺序

改了代码没重载 → ① `main.js` 是否真的进了 vault 插件目录 → ② 热重载插件是否启用 → ③ `manifest.json` 的 `id` 是否与目录名一致 → ④ 看 `docs/pitfalls.md`。

## 提交

改本套件时：文档与模板分开提交，别把验证产物带进来。commit message 用 Conventional Commits。

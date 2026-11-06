# Obsidian 插件社区技术栈调研（2026-11）

> 目的：判断「更高效 / 更 native」的开发栈到底有哪些，避免把通用前端热度误当成 Obsidian 社区共识。证据等级已标注，**请按等级取用**。

## 官方基线（硬证据：raw `package.json` / `esbuild.config.mjs`）

[obsidianmd/obsidian-sample-plugin](https://github.com/obsidianmd/obsidian-sample-plugin)（4611★ / 1804 fork）：

- `esbuild 0.25.5` + `TypeScript 5.8` + `ESLint 9` + 官方 `eslint-plugin-obsidianmd` + npm
- `tsc -noEmit -skipLibCheck` 只做类型检查；产物单个 CJS `main.js`
- `external`：`obsidian` / `electron` / `@codemirror/*` / `@lezer/*` / `builtinModules`
- 官方文档仍以 Node.js 为前提；[Development workflow](https://docs.obsidian.md/Plugins/Getting+started/Development+workflow) 直接推荐 [pjeby/hot-reload](https://github.com/pjeby/hot-reload)（972★）
- 官方另有 [Svelte](https://docs.obsidian.md/Plugins/Getting+started/Use+Svelte+in+your+plugin) 与 React 专页、`obsidianmd/obsidian-workflows`（validate/lint/build/release GH Action）

## 社区路线（硬证据：仓库 README / 官方论坛帖 / GitHub API stars）

| 路线 | 代表 | 做了什么 | 热度 |
|---|---|---|---|
| Bun 一体化 | [dsebastien/obsidian-plugin-template](https://github.com/dsebastien/obsidian-plugin-template) | Bun 兼包管理+打包+测试（README 原话「no npm, no webpack, no esbuild」）、Tailwind v4、`bun test`、tag 自动发布、AGENTS.md | 19★，2024 建，2026-10 仍活跃 |
| Bun 轻改官方样板 | [rzbin/obsidian-plugin-template-bun](https://github.com/rzbin/obsidian-plugin-template-bun) | 官方 sample 换成 Bun，卖点「更快构建 + 更好 DX」 | 4★，2025-11 [论坛帖](https://forum.obsidian.md/t/obsidian-plugin-template-using-bun/107947) 287 views |
| 可组合脚手架 | [mnaoumov/create-obsidian-plugin](https://github.com/mnaoumov/create-obsidian-plugin) | `npm create @mnaoumov/obsidian-plugin`，wizard 选 bundler(esbuild/Parcel/Rollup/Vite/Webpack) × UI(none/Lit/Preact/React/Solid/Svelte/Vue) × 测试(Vitest/Jest) × 样式 × 包管理器，且可原地升级模板 | 3★，2026-11-01 [发布](https://forum.obsidian.md/t/create-obsidian-plugin-scaffold-and-later-update-an-obsidian-plugin-project/120773) |
| 减少样板 | [eth-p/esbuild-plugin-obsidian](https://github.com/eth-p/esbuild-plugin-obsidian) | 从 `package.json` 自动生成 `manifest.json` / `versions.json` | — |
| 现成 Bun 构建脚本 | [davisriedel/bun-obsidian-plugin-build-scripts](https://github.com/davisriedel/bun-obsidian-plugin-build-scripts) | `build()` / manifest 同步 / test vault / release，做成 git submodule 复用 | — |
| 零构建纯 JS | [beardicus/obsidian-simple-sample-plugin](https://github.com/beardicus/obsidian-simple-sample-plugin) | 直接写 `main.js`，无 TS / 无多文件 / 无第三方库，README 直接教装 Hot Reload | — |
| 在 Obsidian 内编译 | [In-App Builder](https://forum.obsidian.md/t/plugin-in-app-builder-build-your-plugins-right-inside-obsidian-beta/101887) | esbuild-wasm，beta | 小众 |

## 关键判断

1. **没有单一赢家**。社区共识仍是 esbuild 系 + 原生 DOM；`create-obsidian-plugin` 的 `none` UI 选项是一等公民，说明「不引入框架」是正路。
2. **真正被大规模采用的效率工具是 hot-reload**（972★，官方推荐），不是某个新打包器。
3. **Svelte 是「更 native 的框架」**（编译成 vanilla JS、无 VDOM、官方专页），但去掉框架更简。
4. **tsdown / Rolldown 在 Obsidian 场景未见普遍采用**，原因见 `pitfalls.md` §9。
5. **Bun 的收益不在打包速度**，见 `pitfalls.md` §7。

## 证据等级

| 等级 | 内容 |
|---|---|
| 硬证据 | 官方 raw `package.json` / `esbuild.config.mjs` / `src/main.ts`、官方文档、各仓库 raw README、GitHub API stars、本机 `test -d` 路径实测 |
| 搜索摘要级 | Reddit 关于 DX 痛点、React vs Svelte 偏好、Jest 速度的讨论——**正文被提取器整域拒绝**（`Website Not Supported`；Jina 403、curl 返回拦截页、pullpush TLS 526），仅引用搜索片段，未作强证据 |
| 未做的 | 未做统计调查；stars 只反映仓库关注度，不等于插件装机量 |

一手资料链接优先于二手总结；结论若与你的环境冲突，以你实跑为准。

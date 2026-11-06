# 踩坑总结

标注说明：**【实测】**＝原作者在本机读源码 / 跑命令验证过；**【调研】**＝来自官方文档或社区一手资料（见 `ecosystem-notes.md`）；**【取舍】**＝设计决策，不是 bug。换环境后请复验。

## 1. 【实测】vault 路径硬编码会静默漂移

原版 `ob-sync.sh` 把目标写死成某个外置盘绝对路径（形如 `<EXTERNAL_DISK>/Periodic/<old-vault>/.obsidian/plugins`）。实测：外置盘挂载着，但两份脚本里写死的两个不同旧路径**都已不存在**；真实 vault 在另一处本机目录。脚本用 `cp` 且 `mkdir -p`，路径不存在时会在错误位置静默建目录、不报错——最难查的那种失败。

→ 本套件改为环境变量 / `.vault-path` 显式配置，缺失即报错退出。

## 2. 【实测】源码与产物分离，watch 不会自动搬运

真实 vault 里 **0 个 `.ts` / `package.json` / `esbuild.config.mjs`，只有 `main.js` / `manifest.json` / `styles.css`**。说明源码在独立开发目录。`esbuild --watch` 只重建本目录 `main.js`，`ob-sync.sh` 是一次性 `cp`，两者不联动 → 改代码后必须手动跑同步，热重载才看得到。

→ 让 dev 模式的 `outfile` 直接写进 vault（模式 A），把两段式合并成一条命令。

## 3. 【实测】两套热重载并存，`.hotreload` 标记是残留

自研版用 `app.vault.on("raw")` 监听、**不需要** `.hotreload`；pjeby/hot-reload 靠插件目录里的 `.hotreload` 标记。部分旧 `ob-sync.sh` 还 `touch .hotreload`，全库共 10 处残留。两套同时启用会重复重载。

→ 只启用一个；清理残留标记。

## 4. 【取舍】自研热重载的实现边界

- 监听**所有**已启用插件的 `main.js` / `styles.css`，好处是不用逐个放标记，代价是任意插件产物变化都触发。
- `disablePlugin` → `enablePlugin` 是**全量重载**（不是 HMR），插件状态会丢。
- `bringToFront()` 依赖 `@electron/remote` / `electron.remote` 与 `app.plugins` 内部 API，桌面端限定，Obsidian 版本升级可能失效。
- `debounce(..., 500, true)` 合并连续文件写入。

→ 想更稳可用官方推荐的 [pjeby/hot-reload](https://github.com/pjeby/hot-reload)；想更可控就改成按目录白名单。

## 5. 【实测】规范文档自相矛盾

`ob-project-init.md` 明令初始化阶段禁止运行 `ob-sync.sh` / `build` / `dev`；`REQUIREMENTS.md` 却把 `build && ob-sync.sh` 定为「功能完成流程」。同一套资产两种口径，Agent 容易无所适从。

→ `conventions.md` 里显式指出并给出单一选择。

## 6. 【调研】esbuild 层界：换打包器会打断官方 Svelte

官方 [Use Svelte in your plugin](https://docs.obsidian.md/Plugins/Getting+started/Use+Svelte+in+your+plugin) 指定 `esbuild-svelte` 插件（`esbuild.build({ plugins: [sveltePlugin()] })`）。而 `Bun.build()` 用的是自己的 `BunPlugin`（`{name, setup}` + `onLoad/onResolve`），**不吃 esbuild 插件**（见 [Bun 官方迁移对照](https://bun.com/docs/bundler/esbuild)）。tsdown/Rolldown 同理要走 `rollup-plugin-svelte`。

→ 「换 Bun / tsdown 打包」与「用官方 Svelte」二选一；不引入 UI 框架则两者都不冲突。

## 7. 【调研】Bun 不是必选

插件产物就一个几 KB 的 `main.js`，esbuild 已近毫秒级。Bun 官方宣称比 esbuild 快 1.75x，那是 three.js 大 bundle 基准，插件体量感知不到。Bun 真正值钱的是「装依赖 / 跑测试 / 少一层工具」。

→ 已有 pnpm + esbuild 跑通几十个插件时，换 Bun 收益低于迁移成本。

## 8. 【调研】纯 Bun 模板仍强制 Node 跑 lint

社区最激进的 Bun 模板里有个 `require-node.mjs`：ESLint 必须跑在 Node 下，因为社区目录 reviewer 用 Node；Bun 下 `node:module` 的 `isBuiltin('bun:test')` 为真，`obsidianmd/no-nodejs-modules` 会把每个 `bun:test` 导入误判，报出 reviewer 不会报的错。`bunfig.toml` 设 `[run] bun=false` 也挡不住 fallback。

→ 「全 Bun」不现实，Node 那一层要显式保留；这也说明混合分层是对的。

## 9. 【调研】tsdown / Rolldown 是通用生态热点，不是 Obsidian 社区热点

Rolldown（Rust、Oxc、Vite 7 正迁移、VoidZero 背书）很热，但 Obsidian 一手资料里没见普遍采用；连 2026-11 发布的 `create-obsidian-plugin` 脚手架，bundler 选项也只有 esbuild / Parcel / Rollup / Vite / Webpack，**没有** tsdown/rolldown。

→ 别把通用前端热度当成 Obsidian 社区共识。

## 10. 【调研】去掉 UI 框架才是最简解

官方 sample plugin 的 `src/main.ts` 本身零框架（`Plugin` / `Modal` / `Notice` / `addCommand` / `addRibbonIcon`）。原生 helper + `Setting` + `styles.css` 就够了；Svelte 是「更 native 的框架」（编译成 vanilla JS、无 VDOM），但引入框架就多一层编译插件。

→ 设置页 / 几个 Modal / 若干命令：原生够；多面板状态驱动视图再考虑 Svelte / Lit / Preact。

## 11. 【实测】别污染活跃库、别混提 WIP

原作者工作区里有几十个插件带未提交改动（有的来自别的 Agent），`node_modules` 是软链、实体在缓存目录。验证一律用 sandbox vault；`git add -A` 会把别人的 WIP 混进自己的提交。

→ 见根 `AGENTS.md` 硬约束。

## 12. 【实测】release / 发布阶段尚未完成

tag 触发、GH Actions draft release、`versions.json` 自动 bump、changelog、manifest-beta、社区目录提交、BRAT……本套件**都还没实现**。当前 `version-bump.mjs` 只是本地版本同步脚本。

→ 见 `roadmap.md`，别假设它存在。

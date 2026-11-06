# hot-reload（自研版）

> ⚠️ 目录里的 `cbugs-hot-reload` / `CBugs Hot Reload` / `cBugs` 是**示例品牌**，按套件根 `CUSTOMIZE.md` 全局替换。

Obsidian 插件热重载工具。开发其他插件时，它监听 **vault 内**插件目录的 `main.js` / `styles.css` 变化，自动 `disablePlugin(id)` → `enablePlugin(id)`。

## 机制

```ts
app.vault.on("raw", (filename) => {
  // 只认 <pluginsFolder>/<dir>/main.js 与 styles.css
});
// debounce 500ms → disable → enable → Notice
```

- **不需要** `.hotreload` 标记（那是 [pjeby/hot-reload](https://github.com/pjeby/hot-reload) 的机制）。
- 与 [官方 Development workflow](https://docs.obsidian.md/Plugins/Getting+started/Development+workflow) 推荐的是同一类工具，但实现独立。

## 安装

```bash
cp -R hot-reload/ <DEV_ROOT>/<your-hot-reload-id>/
cd <your-hot-reload-id> && pnpm install && pnpm run build
# 同步到 vault 后在 Obsidian 设置里启用
```

二选一：**只启用一个热重载插件**，否则会重复重载。

## 已知边界（不是 bug，是取舍）

| 项 | 说明 |
|---|---|
| 监听范围 | 所有已启用插件；任意插件产物变化都会触发 |
| 重载粒度 | 全量 disable/enable，插件状态会丢，不是 HMR |
| 内部 API | `app.plugins`、`app.vault.on("raw")` 属内部接口，Obsidian 升级可能变 |
| Electron | `bringToFront()` 用 `@electron/remote` / `electron.remote`，桌面端限定；若窗口 API 不可用，Notice 会抛错并显示 ❌，**但插件其实已重载成功**——别被这条假失败误导 |
| 移动端 | 未适配（`isDesktopOnly` 相关逻辑未处理） |

想更稳：用 pjeby/hot-reload（记得让 `ob-sync.sh` `touch .hotreload`）；想更可控：把监听改成按目录白名单。见套件 `docs/pitfalls.md` §3/§4 与 `docs/roadmap.md`。

## 配合模式 A

设置 `OBSIDIAN_PLUGINS_DIR` / `.vault-path` 后，套件的 `esbuild.config.mjs` 会把 dev 产物直写 vault，这个插件立刻监听到并重载——这就是整套闭环的最后一环。

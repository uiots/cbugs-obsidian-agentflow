# AGENTS.md（插件模板内）

> 本文件随 `template/` 一起复制到新插件目录。完整说明见套件根目录 `AGENTS.md` / `CUSTOMIZE.md` / `docs/workflow.md`。

## 开工前

1. 按 `CUSTOMIZE.md` 全局替换 `cbugs-` / `CBugs` / `cBugs` / `cbugs-obsidian-plugin`。
2. 确认 `manifest.json` 的 `id` == 目录名，且与 `package.json`、`versions.json` 版本一致。
3. 配置 vault 路径：`OBSIDIAN_PLUGINS_DIR` 或 `.vault-path`（**不要提交**）。

## 命令

```bash
pnpm install
pnpm run dev      # watch；配了 vault 路径时直写 vault，hot-reload 自动重载
pnpm run build    # 产出到本地 main.js（发布用）
pnpm run sync     # = ./ob-sync.sh，手动搬三件套
```

## 约束

- 不要写活跃 vault；验证用 sandbox。
- 不要提交 `main.js` / `node_modules/` / `.vault-path` / 密钥。
- 不要 `git add -A`。
- 样式走 `styles.css`，不用 `injectStyles()`；命令必带 icon。
- release / 发布流程**尚未实现**（见套件 `docs/roadmap.md`）。

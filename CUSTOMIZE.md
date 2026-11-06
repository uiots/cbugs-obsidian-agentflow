# 定制清单（clone 后第一件事）

> 本仓库里的品牌名、路径、工具链都是**原作者的实际配置**。它们是「能跑通的示例」，不是「你应该照抄的标准」。下表逐项说明。

## 1. 必须替换

| # | 项目 | 示例值（本仓库） | 出现位置 | 换成 |
|---|---|---|---|---|
| 1 | 开发者品牌 / 插件 ID 前缀 | `cbugs-`、`CBugs`、`cBugs` | `template/manifest.json`、`package.json`、`main.ts`、`rules/*.md`、`hot-reload/manifest.json` | 你自己的前缀与显示名。建议只用一个前缀常量，全局替换 |
| 2 | vault 插件目录 | 无任何真实路径；模板用 `OBSIDIAN_PLUGINS_DIR` / `.vault-path` | `template/ob-sync.sh`、`template/esbuild.config.mjs`、`docs/workflow.md` | **你的** vault 的 `.obsidian/plugins` 绝对路径 |
| 3 | 开发工作区根目录 | 无 | `docs/*.md` 中以 `<DEV_ROOT>` 表示 | 你放插件源码的目录 |
| 4 | git 身份 | `you@example.com`（已脱敏） | `LICENSE`、提交配置 | 你的 name/email |
| 5 | GitHub 仓库地址 | `<OWNER>/obsidian-agent-dev-kit` | 各文档链接 | 你 fork 后的地址 |
| 6 | 插件 `id` / `name` / `description` | `cbugs-obsidian-plugin` / `CBugs Obsidian Plugin` | `template/manifest.json`、`package.json` | 你的插件信息；三者与 `versions.json` 保持一致 |
| 7 | `minAppVersion` | `0.15.0` | `template/manifest.json` | 你要支持的最低 Obsidian 版本 |
| 8 | 包管理器版本 | `pnpm@8.0.0`（模板示例） | `template/package.json`、`.npmrc` | 你本机版本（如 `pnpm@12`）；或改用 npm/yarn/bun，见下 |

### 替换后自检

```bash
# 还有没有残留的品牌名
grep -rn "cbugs\|CBugs\|cBugs" template/ hot-reload/ | head
# 还有没有残留的示例路径 / 占位符
grep -rn "<DEV_ROOT>\|/path/to/your\|<OWNER>" . | head
```

`.vault-path` 已在 `.gitignore` 中——**不要把你的真实 vault 路径提交进仓库**。

## 2. 不建议照抄（按自己情况裁剪）

| 项目 | 为什么是「本机口味」 | 可选替代 |
|---|---|---|
| `cbugs-` 命名与「连字符不超过 2 个」的限制 | 纯属原作者的组织习惯 | 任意 ID 规范，只要 manifest `id` 与目录名一致 |
| `jj` (Jujutsu) 版本控制 | 原作者改用 jj；团队/协作方可能不用 | 普通 git；两者都可，规范文档只是记录 |
| `pnpm@8` | 老版本锁死 | 新版 pnpm / npm / yarn / bun 均可，注意 external 配置不受影响 |
| 自研 hot-reload 的 `@electron/remote` 调用 | 依赖 Obsidian 内部 API 与 Electron 版本，桌面端限定 | 官方推荐的 [pjeby/hot-reload](https://github.com/pjeby/hot-reload)（用 `.hotreload` 标记），或自己用 `app.vault.on("raw")` 实现 |
| 热重载策略：监听**所有**启用插件 + 全量 `disable`/`enable` | 无需逐个放标记，但任意插件产物变化都会触发 | 按目录白名单 / 只重载指定插件 |
| 「初始化阶段禁止跑 build / dev / sync」 | 原作者的 Agent 分工约定 | 让 Agent 全自动跑完也行，见 `AGENTS.md` |
| `styles.css` 优先于 `injectStyles()`、`addCommand` 必带 icon | 品牌内部 UI 约定 | 按官方 [Plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines) 自行决定 |
| 外置盘 / 软链 `node_modules` | 原作者从外置盘抢救仓库后的历史安排 | 本机直接放即可 |

## 3. 保持不变的部分（这些是 Obsidian 平台约束，不是选择）

- 产物必须是 `main.js`（CJS）+ `manifest.json`（+ 可选 `styles.css`）
- `obsidian`、`electron`、`@codemirror/*`、`@lezer/*`、Node builtins 必须 `external`
- 插件目录必须位于 `<vault>/.obsidian/plugins/<id>/`
- 改了源码必须重载插件才生效

## 4. 文档里哪些是「经验」哪些是「事实」

- `docs/pitfalls.md` 里标 **实测** 的，是原作者在本机读源码 / 跑命令验证过的；换成你的环境后结论可能不同，请自行复验。
- `docs/ecosystem-notes.md` 明确标了证据等级（硬证据 / 搜索摘要 / 未获取），请按等级取用。
- `docs/roadmap.md` 列的是**没做的**，不是「未来一定有」。

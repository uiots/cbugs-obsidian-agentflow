# 开发 / debug / 同步 / 热重载流程

## 数据流

```
<DEV_ROOT>/<plugin-id>/          （源码，git/jj 仓库）
   main.ts + styles.css
        │  esbuild (bundle, CJS, external obsidian/electron/codemirror)
        ▼
   main.js / manifest.json / styles.css   ← 只有这三个是 Obsidian 认识的产物
        │  搬运
        ▼
<VAULT>/.obsidian/plugins/<plugin-id>/
        │  文件变化被监听
        ▼
   hot-reload 插件 → disablePlugin(id) → enablePlugin(id)
        │
        ▼
   Obsidian 里插件重载，改动生效
```

**关键**：Obsidian 不读源码目录。源码与产物分离时，中间那次「搬运」必须发生，否则 watch 再快也没用。

## 模式 A（推荐）：watch 直写 vault

`template/esbuild.config.mjs` 的 dev 分支读取 `OBSIDIAN_PLUGINS_DIR`：

```bash
export OBSIDIAN_PLUGINS_DIR=/path/to/your/vault/.obsidian/plugins
pnpm install
pnpm run dev
```

esbuild 的 `outfile` 直接指向 `<vault>/<plugin-id>/main.js`，`context.watch()` 每次重建都会改动 vault 里的文件 → hot-reload 立即监听到 → 自动重载。**一条命令闭环**，不需要中间脚本。

## 模式 B：手动搬运

```bash
pnpm run build          # 产出到本目录 main.js
./ob-sync.sh            # cp 三件套到 vault
```

`ob-sync.sh` 支持三种路径来源（优先级从高到低）：

1. 环境变量 `OBSIDIAN_PLUGINS_DIR`
2. 当前目录的 `.vault-path` 文件（内容是一行路径；已在 `.gitignore` 中）
3. 都没有 → **报错退出**，并提示怎么配

原版脚本把 vault 路径硬编码在文件里；一旦换盘 / 改目录名就会静默失效。**这是本套件最主要的改动**。

## 首次部署

```bash
cp -R template/ <DEV_ROOT>/<plugin-id>/
# 按 CUSTOMIZE.md 替换品牌、id、description、minAppVersion
echo "<VAULT>/.obsidian/plugins" > <DEV_ROOT>/<plugin-id>/.vault-path
cd <DEV_ROOT>/<plugin-id> && pnpm install && ./ob-sync.sh
```

然后在 Obsidian：设置 → 社区插件 → 启用刚同步的插件；再启用 `hot-reload/`（或 pjeby/hot-reload，二选一）。

## 热重载插件

`hot-reload/` 是自研版，机制：

```ts
app.vault.on("raw", (filename) => { /* 只认 plugins 目录下的 main.js / styles.css */ })
// → debounce 500ms → disablePlugin(id) → enablePlugin(id)
```

- 监听 **vault 内**文件，不监听源码目录。
- **不需要** `.hotreload` 标记（那是 pjeby 版的机制）。
- 用了 `app.plugins` / `@electron/remote` 等内部 API，属桌面端实现，兼容性见 `pitfalls.md`。

## Debug 清单

| 现象 | 先查 |
|---|---|
| 改代码没重载 | vault 里 `main.js` 的 mtime 有没有变；没变 = 搬运断了 |
| 搬运断了 | `OBSIDIAN_PLUGINS_DIR` / `.vault-path` 是否指向真实存在的目录 |
| 插件不出现在列表 | `manifest.json` 的 `id` 是否等于目录名；三件套是否齐全 |
| 重载报 Notice 失败 | 自研 hot-reload 的 `bringToFront()` 依赖 Electron 窗口 API |
| 构建报错 | `obsidian` 是否 external；`tsc -noEmit` 是否通过 |
| 两个热重载打架 | 只启用一个；清掉遗留的 `.hotreload` 文件 |

## 验证（用 sandbox，别碰活跃 vault）

```bash
SB=/tmp/ob-kit-sandbox
mkdir -p "$SB/vault/.obsidian/plugins"
cp -R template/ "$SB/my-plugin"
cd "$SB/my-plugin"
echo "$SB/vault/.obsidian/plugins" > .vault-path
pnpm install
pnpm run build                    # 应产出 main.js
OBSIDIAN_PLUGINS_DIR="$SB/vault/.obsidian/plugins" ./ob-sync.sh
ls "$SB/vault/.obsidian/plugins/my-plugin"   # 应有三件套
```

仓库 CI 之外，本套件的作者就是用这个流程实跑验证的（见 `README.md` 成熟度表）。

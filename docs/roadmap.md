# 未完成 / 成长空间

> 本套件是**还在成长的工作流**。`README.md` 的 Project status 表只勾选了已实跑验证的部分。以下明确列出**还没有**的东西，避免使用者误以为开箱即覆盖发布。

## 已闭环（当前范围）

- 脚手架模板、命名 / manifest / 版本约定
- `pnpm run build` 产出 `main.js` / `manifest.json` / `styles.css`
- `ob-sync.sh` 路径可配置 + 自动同步（sandbox 实跑）
- `esbuild --watch` 直写 vault
- 自研 hot-reload 自动重载（源码齐备；依赖内部 API 的边界已记录）

## 明确未完成：release / 发布阶段 ❌

| 缺项 | 说明 | 可参考的现成做法 |
|---|---|---|
| tag 触发的 GH Actions release | 目前无 workflow；`version-bump.mjs` 只在本地同步版本号 | [官方 Release your plugin with GitHub Actions](https://docs.obsidian.md/Plugins/Releasing/Release+your+plugin+with+GitHub+Actions)、[obsidianmd/obsidian-workflows](https://github.com/obsidianmd/obsidian-workflows) |
| draft release + 三件套资产上传 | 需要把 `main.js` / `manifest.json` / `styles.css` 挂到 release | 同上 |
| `versions.json` 自动维护 | 现为手工 / 本地脚本 | `eth-p/esbuild-plugin-obsidian` 可从 `package.json` 生成 |
| changelog / Conventional Commits → release notes | 未实现 | `gh release create --generate-notes` |
| `manifest-beta.json` + BRAT 测试分发 | 未实现 | 官方 Beta-testing plugins 文档 |
| 社区目录提交清单 | 提交前的自查未整理成 checklist | [Plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines) / Submission requirements |
| CI lint / build 对齐官方校验 | 未接 `eslint-plugin-obsidianmd` 规则集 | `obsidianmd/obsidian-workflows@v1` |

## 其他成长空间

- 自动化测试（模板目前零测试；`bun test` / Vitest 二选一）
- 移动端适配（`isDesktopOnly`、无 Node/Electron API 的热重载实现）
- Windows / Linux 路径与 shell 兼容（`ob-sync.sh` 目前是 bash）
- 多插件 workspace / monorepo 支持
- i18n、设置页 schema、命令图标规范的工具化校验
- 通用化 hot-reload：去掉 `@electron/remote` 依赖、改成按目录白名单
- 英文文档 / 示例视频

## 贡献方式

补充你自己的踩坑时，请标 **【实测】** 并写清环境（Obsidian 版本、OS、包管理器）；纯推断请标 **【推测】**。不确定的别写成结论。

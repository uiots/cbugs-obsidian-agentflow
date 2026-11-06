# 范围与扩展方向

> 本文只做**范围界定**，不是待办清单。本开源仓库**不包含** release / 发布部分；这既不是留给使用者的任务，也不是作者后续要补的承诺——没有谁需要专门来填补，也不存在「等我们自己补上」这件事。

## 本仓库覆盖的范围（已实跑验证）

- 插件脚手架、命名 / manifest / 版本约定
- `pnpm run build` 产出 `main.js` / `manifest.json` / `styles.css`
- `ob-sync.sh`：路径可配置、缺失报错、自动同步（sandbox 实跑）
- `esbuild --watch` 直写 vault
- 自研 hot-reload 源码（可构建；依赖 Obsidian 内部 API，实际重载未在 Obsidian 内驱动验证）

范围止于「插件能跑起来、改代码能自动重载」这一开发闭环，也就是 `README.md` 的 Project status 表列出的部分。

## 明确不在本仓库范围内：release / 发布

本仓库没有包含以下发布层内容：

| 项 | 说明 |
|---|---|
| tag 触发的 GitHub Actions release | 无 workflow；`version-bump.mjs` 只在本地同步版本号 |
| draft release + 三件套上传 | 无 |
| `versions.json` 自动维护 | 现为手工 / 本地脚本 |
| changelog / release notes | 无 |
| `manifest-beta.json` + BRAT 测试分发 | 无 |
| 社区目录提交清单 | 无 |
| CI lint / build 对齐官方校验 | 无 |

**这是「本仓库不包含」，不是「还没做 / 待补」。** 这个开源仓库分享的就是开发 debug 闭环这一层；发布层不在分享范围内。

## 自行扩展时可参考的现成做法（信息，不是本仓库 TODO）

如果你要在自己的项目里接发布，下面是社区现成做法，仅供参考：

| 方向 | 现成做法 |
|---|---|
| tag 触发 release | [官方 Release your plugin with GitHub Actions](https://docs.obsidian.md/Plugins/Releasing/Release+your+plugin+with+GitHub+Actions)、[obsidianmd/obsidian-workflows](https://github.com/obsidianmd/obsidian-workflows) |
| 版本号 / manifest 同步 | [eth-p/esbuild-plugin-obsidian](https://github.com/eth-p/esbuild-plugin-obsidian) 可从 `package.json` 生成 |
| release notes | `gh release create --generate-notes` |
| Beta 分发 | 官方 Beta-testing plugins 文档、BRAT |
| 提交前自查 | [Plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines) |

其它可选扩展方向（同样不是待办）：自动化测试、移动端适配、Windows / Linux shell 兼容、多插件 workspace、i18n、hot-reload 通用化。

## 贡献

欢迎补充你自己的踩坑：标 **【实测】** 并写清环境（Obsidian 版本、OS、包管理器），纯推断标 **【推测】**。不需要「帮本仓库补 release」——发布层本来就在这个仓库的范围之外。

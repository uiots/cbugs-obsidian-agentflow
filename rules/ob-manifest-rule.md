> 原作者规范原文（已脱敏：外置盘路径→`${OBSIDIAN_PLUGINS_DIR}`/`<EXTERNAL_DISK>`，示例邮箱→`you@example.com`）。**含本机口味，仅作参考**；通用化版见 `../docs/conventions.md`，替换清单见 `../CUSTOMIZE.md`。

---

# Obsidian Plugin Manifest.json 规范

## CBugs 系列插件规范

### 核心要求
- **id**: 必须以 `cbugs-` 开头
- **name**: 必须以 `CBugs` 开头
- **version**: 起始版本为 `0.1.0`
- **如果项目有 package.json，则同步更新 package.json 中的相应字段**

### ID 与 Name 映射规则
- **格式**: `cbugs-[word1]-[word2]-[word3]` → `CBugs Word1 Word2 Word3`
- **转换规则**:
  - 将 `cbugs` 转换为 `CBugs`
  - 将所有连字符 `-` 替换为空格 ` `
  - 后面的每个单词首字母大写

#### 映射示例
```
cbugs-telescope-plugin    → CBugs Telescope Plugin
cbugs-growth-ring         → CBugs Growth Ring
cbugs-note-merger         → CBugs Note Merger
cbugs-folder-organizer    → CBugs Folder Organizer
cbugs-finocus-files       → CBugs Finocus Files
cbugs-pin-recent-files    → CBugs Pin Recent Files
```

### 作者信息规范

#### 统一标准
- **manifest.json 中的 author**: 固定为 `cBugs`
- **package.json 中的 author**: 固定为 `cBugs`
- **不添加 `authorUrl` 和 `fundingUrl` 字段**
- **所有插件保持一致的作者标识**

#### 作者信息设置步骤
1. 在 `manifest.json` 中设置 `"author": "cBugs"`
2. 在 `package.json` 中设置 `"author": "cBugs"`
3. 移除任何 `authorUrl` 和 `fundingUrl` 字段
4. 确保版本管理工具（如 version-bump.mjs）同步更新这些字段

### 标准示例
```json
{
  "id": "cbugs-folder-organizer",
  "name": "CBugs Folder Organizer",
  "version": "0.1.0",
  "minAppVersion": "0.15.0",
  "description": "快速移动文件和文件夹的工具",
  "author": "cBugs",
  "isDesktopOnly": false
}
```
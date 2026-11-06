> 原作者规范原文（已脱敏：外置盘路径→`${OBSIDIAN_PLUGINS_DIR}`/`<EXTERNAL_DISK>`，示例邮箱→`you@example.com`）。**含本机口味，仅作参考**；通用化版见 `../docs/conventions.md`，替换清单见 `../CUSTOMIZE.md`。

---

# Obsidian 插件项目初始化规范

## 核心规范

### 命名规范
- **插件 ID**：必须以 `cbugs-` 开头，格式为 `cbugs-[插件名]-plugin`
  - **推荐格式**：尽量使用两个 `-` 连接的名称（如 `cbugs-xxx-plugin`）
  - **⚠️ 重要限制**：**强烈不推荐使用 3 个及以上 `-` 连接的 ID 名称**
  - **长名称处理**：如果插件名称较长，应该通过缩减词汇来简化，而不是增加连字符数量
  - **缩减建议**：可以省略最后的 `-plugin` 后缀，或对中间词汇进行缩写
  - 示例：`cbugs-simple-plugin` ✓ (推荐格式，2 个 `-`)
  - 示例：`cbugs-create-link` ✓ (省略 -plugin，2 个 `-`)
  - 示例：`cbugs-inline-copy` ✓ (缩减词汇，2 个 `-`)
  - 示例：`cbugs-copy-inline-code` ✗ (3 个 `-`，不推荐，应缩减为 `cbugs-inline-copy`)
  - 示例：`cbugs-very-long-name-plugin` ✗ (4 个 `-`，严重不推荐)
- **插件名称**：必须以 `CBugs` 开头
- **目录名**：与插件 ID 完全一致

### 版本规范
- **初始版本**：必须从 `0.1.0` 开始，遵循语义化版本控制
- **版本一致性**：manifest.json、package.json、versions.json 保持一致

### 作者规范
- **统一标识**：所有插件 author 固定为 `cBugs`
- **移除字段**：不添加 `authorUrl` 和 `fundingUrl`

### 技术栈
- **包管理器**：pnpm（替代 npm）
- **版本控制**：jj（替代 git）
- **构建工具**：集成 lint 检查，无需额外 eslint

## 初始化范围限制

### ⚠️ 严格禁止的操作

项目初始化阶段**仅负责框架部署**，以下操作严格禁止：

#### 不能运行的脚本
- ❌ **禁止运行 `ob-sync.sh`**：同步脚本仅供用户手动执行
- ❌ **禁止运行 `pnpm run build`**：构建操作由用户在开发时执行
- ❌ **禁止运行 `pnpm run dev`**：开发模式由用户自行启动
- ❌ **禁止运行 `version-bump.mjs`**：版本管理由用户控制

#### 不能修改的文件
- ❌ **禁止修改 `main.ts`**：业务逻辑文件完全不动
- ❌ **禁止修改 `src/` 目录**：所有业务代码保持模板原样
- ❌ **禁止修改 `styles.css`**：样式文件保持模板原样

#### 不能执行的操作
- ❌ **禁止业务开发**：不编写任何业务逻辑代码
- ❌ **禁止功能实现**：不实现用户需求的具体功能
- ❌ **禁止测试运行**：不进行插件功能测试
- ❌ **禁止插件安装**：不将插件安装到 Obsidian

### ✅ 初始化仅做的事

初始化阶段**只负责**以下工作：

1. **项目结构搭建**：克隆模板、创建目录
2. **配置文件更新**：修改 manifest.json、package.json、versions.json
3. **工具链配置**：设置 pnpm、jj、.gitignore
4. **辅助文件创建**：生成 ob-sync.sh、AGENTS.md
5. **初始提交**：提交 Initial Commit

### 📝 原则说明

- **框架与业务分离**：初始化只管框架，业务开发是独立阶段
- **用户自主控制**：脚本运行、构建、测试由用户决定
- **保持模板纯净**：不对模板代码进行任何业务性修改

## 配置文件标准

### manifest.json
```json
{
  "id": "cbugs-[插件名]-plugin",
  "name": "CBugs [插件名]",
  "version": "0.1.0",
  "minAppVersion": "0.15.0",
  "description": "插件描述",
  "author": "cBugs",
  "isDesktopOnly": false
}
```

### package.json
```json
{
  "name": "cbugs-[插件名]-plugin",
  "version": "0.1.0",
  "description": "插件描述",
  "main": "main.js",
  "author": "cBugs",
  "license": "MIT",
  "packageManager": "pnpm@8.0.0",
  "keywords": ["obsidian", "plugin", "cbugs"],
  "scripts": {
    "dev": "node esbuild.config.mjs",
    "build": "tsc -noEmit -skipLibCheck && node esbuild.config.mjs production",
    "version": "node version-bump.mjs && git add manifest.json versions.json"
  }
}
```

### versions.json
```json
{
  "0.1.0": "0.15.0"
}
```

## 项目结构

### 目录层级
```
[当前工作目录]/
└── [插件ID]/                # 目录名 = manifest.json.id
    ├── main.ts             # 主插件文件
    ├── manifest.json       # 插件配置
    ├── package.json       # 项目配置
    ├── tsconfig.json      # TypeScript 配置
    ├── esbuild.config.mjs # 构建配置
    ├── version-bump.mjs   # 版本管理
    ├── versions.json      # 版本历史
    ├── ob-sync.sh         # 插件同步脚本
    ├── .gitignore        # 忽略文件
    └── AGENTS.md          # AI 开发助手规范文档
```

### .gitignore 规则
```gitignore
# 版本控制工具
.git/
.jj/

# 开发工具元数据
.crush/
.cursor/
.claude/
.history/
.lh/
.ll/
.serena/

# pnpm
pnpm-lock.yaml
.pnpm-store/
```

## AI 开发助手规范文档标准

### AGENTS.md 模板
```markdown
# AI 开发助手规范文档

## 业务需求

[用户原文描述]

### 需求记录说明
- **原文保留**：必须一字不差地保留用户的原始需求描述
- **完整记录**：直接复制粘贴用户的原话
- **不做改写**：不要对用户需求进行总结、改写或优化，保持原样
- **目的**：确保后续业务开发时可以准确理解用户的真实意图

## 项目管理规范

### 版本控制
- **工具**: 使用 jj（Jujutsu）替代 Git 进行项目管理
- **工作流**: jj 提供了更现代的版本控制体验，支持智能合并和分支管理
- **说明**: 用户自行管理提交操作，项目初始化不替用户创建开发提交

### 包管理
- **管理器**: 使用 pnpm 替代 npm
- **构建命令**: `pnpm run build`
- **开发模式**: `pnpm run dev`
- **说明**: pnpm run build 已包含类型检查，不需要单独运行 eslint

### 开发约定
- **提交管理**: 用户自行管理提交，项目初始化仅完成框架部署
- **代码检查**: 构建流程已集成 lint 检查，无需额外执行
- **依赖管理**: 使用 pnpm 进行依赖安装和管理

---
*本文档在项目初始化时创建，记录用户原始需求和开发规范*
*开始业务开发时请参考本文档*
```

### 文档说明
- **统一规范**：AGENTS.md 整合了业务需求和项目管理规范
- **AI 助手指引**：为 AI 开发助手提供完整的项目上下文
- **需求追溯**：保留用户原始需求，确保开发方向准确

## 完整初始化命令

### 初始化脚本
```bash
# 1. 克隆官方模板
git clone https://github.com/obsidianmd/obsidian-sample-plugin.git [插件ID]
cd [插件ID]

# 2. 转换为 pnpm 项目
rm -f package-lock.json
pnpm install

# 3. 配置忽略文件
cat >> .gitignore << 'EOF'

# 版本控制工具
.git/
.jj/

# 开发工具元数据
.crush/
.cursor/
.claude/
.history/
.lh/
.ll/
.serena/

# pnpm
pnpm-lock.yaml
.pnpm-store/
EOF

# 4. 版本管理初始化
rm -rf .git
jj git init --colocate

# 5. 更新配置文件
# 更新 manifest.json、package.json、versions.json 为标准配置

# 6. 创建同步脚本
cat > ob-sync.sh << 'EOF'
#!/bin/bash

# Obsidian 插件同步脚本
# 用于将开发目录中的插件文件同步到 Obsidian 插件目录

# 获取脚本所在目录作为源目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

OBSIDIAN_PLUGINS_DIR="${OBSIDIAN_PLUGINS_DIR}"

# 需要同步的核心文件
SYNC_FILES=("main.js" "manifest.json" "styles.css")

# 确定源目录和插件名称
SOURCE_DIR="$SCRIPT_DIR"
PLUGIN_NAME=$(grep '"id"' "$SOURCE_DIR/manifest.json" | cut -d '"' -f 4)

# 确定目标目录
TARGET_DIR="$OBSIDIAN_PLUGINS_DIR/$PLUGIN_NAME"

echo "🔄 同步插件: $PLUGIN_NAME"
echo "📂 目标位置: $TARGET_DIR"

# 检查源目录是否存在
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ 错误: 源目录不存在: $SOURCE_DIR"
    exit 1
fi

# 检查是否有 manifest.json（验证是否为有效的插件目录）
if [ ! -f "$SOURCE_DIR/manifest.json" ]; then
    echo "❌ 错误: 源目录中未找到 manifest.json，请确认这是一个有效的插件目录"
    exit 1
fi

# 创建目标目录（如果不存在）
mkdir -p "$TARGET_DIR"

# 同步核心文件
echo "📋 开始同步文件..."
for file in "${SYNC_FILES[@]}"; do
    if [ -f "$SOURCE_DIR/$file" ]; then
        cp "$SOURCE_DIR/$file" "$TARGET_DIR/"
        echo "✅ 已同步: $file"
    fi
done


echo "🎉 插件同步完成!"

EOF
chmod +x ob-sync.sh

# 7. 创建 AI 开发助手规范文档
cat > AGENTS.md << 'EOF'
# AI 开发助手规范文档

## 业务需求

[用户原文描述]

### 需求记录说明
- **原文保留**：必须一字不差地保留用户的原始需求描述
- **完整记录**：直接复制粘贴用户的原话
- **不做改写**：不要对用户需求进行总结、改写或优化，保持原样
- **目的**：确保后续业务开发时可以准确理解用户的真实意图

## 项目管理规范

### 版本控制
- **工具**: 使用 jj（Jujutsu）替代 Git 进行项目管理
- **工作流**: jj 提供了更现代的版本控制体验，支持智能合并和分支管理
- **说明**: 用户自行管理提交操作，项目初始化不替用户创建开发提交

### 包管理
- **管理器**: 使用 pnpm 替代 npm
- **构建命令**: `pnpm run build`
- **开发模式**: `pnpm run dev`
- **说明**: pnpm run build 已包含类型检查，不需要单独运行 eslint

### 开发约定
- **提交管理**: 用户自行管理提交，项目初始化仅完成框架部署
- **代码检查**: 构建流程已集成 lint 检查，无需额外执行
- **依赖管理**: 使用 pnpm 进行依赖安装和管理

---
*本文档在项目初始化时创建，记录用户原始需求和开发规范*
*开始业务开发时请参考本文档*
EOF

# 8. 完成初始化提交
echo "🔧 开发框架部署完成，准备提交 Initial Commit..."
jj commit -m "Initial Commit - Framework setup complete

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <you@example.com>"

echo "✅ Initial Commit 已提交，插件项目初始化完成"
echo "📝 注意：业务逻辑开发不在初始化范围内，需要单独进行"
```

## 初始化工作流程

1. **确定插件信息**
   - 根据用户需求确定插件功能和名称
   - 确定 `manifest.json` 中的 `id` 值

2. **创建项目结构**
   - 克隆模板到插件目录
   - 进入插件目录

3. **项目配置**
   - 更新配置文件为标准格式
   - 创建 AGENTS.md 记录业务需求和开发规范

4. **环境设置**
   - 转换为 pnpm 项目
   - 配置版本控制（jj）
   - 创建同步脚本

5. **初始提交**
   - 完成框架部署后提交 Initial Commit

## 初始化检查清单

### 必须完成项
- [ ] 目录名以 `cbugs-` 开头，与插件 ID 一致
- [ ] 使用 jj 进行版本管理
- [ ] 转换为 pnpm 项目
- [ ] 更新三个配置文件为标准格式
- [ ] 作者信息设置为 `cBugs`
- [ ] 版本号统一为 `0.1.0`
- [ ] 配置 .gitignore 规则
- [ ] 创建 ob-sync.sh 脚本
- [ ] 创建 AGENTS.md 记录原始需求和开发规范
- [ ] 提交 Initial Commit
- [ ] 完全不动 main.ts 等业务逻辑文件

### 可选配置
- [ ] 添加合适的关键词到 package.json
- [ ] 设置合适的插件描述
- [ ] 配置 isDesktopOnly 标志

## 更新日志

### 2025-11-02 更新
- **文档整合**：将 REQUIREMENTS.md 合并到 AGENTS.md
- **统一规范**：AGENTS.md 现在包含业务需求和项目管理规范
- **AI 助手指引**：为 AI 开发助手提供完整的项目上下文
- **范围限制**：新增"初始化范围限制"章节，明确禁止运行框架脚本和修改业务代码
- **需求简化**：合并"功能概述"和"详细需求"为统一的"业务需求"部分

### 2025-10-22 更新
- **移除 Serena**：移除所有 Serena MCP 工具相关要求和说明
- **简化流程**：初始化流程从 9 步简化为 8 步
- **检查清单**：移除 Serena MCP 工具激活项目的检查项

### 2025-10-18 更新
- **文档重构**：精简重复内容，调整框架结构
- **模板标准化**：统一配置文件格式和要求
- **管理规范**：集成 jj、pnpm 等技术栈使用说明
- **REQUIREMENTS.md**：包含项目管理和开发约定说明
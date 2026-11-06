> 原作者规范原文（已脱敏：外置盘路径→`${OBSIDIAN_PLUGINS_DIR}`/`<EXTERNAL_DISK>`，示例邮箱→`you@example.com`）。**含本机口味，仅作参考**；通用化版见 `../docs/conventions.md`，替换清单见 `../CUSTOMIZE.md`。

---

# Obsidian 插件通用框架初始化指南

## 概述

本文档用于指导 AI 助手创建一个**业务无关的通用 Obsidian 插件开发框架**。

这是一个可复制粘贴的模板框架，使用占位符代替具体业务信息，便于后续快速创建新项目。

### 使用流程
1. 使用本文档指导，在当前工作目录下创建通用模板框架
2. 当有具体业务需求时，复制整个模板目录到新位置
3. 根据业务需求修改 id、name、description 等配置
4. 同时展开业务逻辑开发

## 核心原则

### 命名规范
- **目录名**: `cbugs-obsidian-plugin`（模板名称）
- **插件 ID**: `cbugs-obsidian-plugin`（占位符）
- **插件名称**: `CBugs Obsidian Plugin`（占位符）
- **描述**: `A generic obsidian plugin template for cBugs development`（占位符）
- **作者**: `cBugs`（固定）
- **版本**: `0.1.0`（固定）

### 技术栈
- **包管理器**: pnpm
- **版本控制**: jj
- **构建工具**: esbuild + TypeScript

## 完整初始化命令

### 初始化脚本
```bash
# 1. 克隆官方模板到当前目录
git clone https://github.com/obsidianmd/obsidian-sample-plugin.git cbugs-obsidian-plugin
cd cbugs-obsidian-plugin

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

# 5. 更新 manifest.json
cat > manifest.json << 'EOF'
{
	"id": "cbugs-obsidian-plugin",
	"name": "CBugs Obsidian Plugin",
	"version": "0.1.0",
	"minAppVersion": "0.15.0",
	"description": "A generic obsidian plugin template for cBugs development",
	"author": "cBugs",
	"isDesktopOnly": false
}
EOF

# 6. 更新 package.json
cat > package.json << 'EOF'
{
	"name": "cbugs-obsidian-plugin",
	"version": "0.1.0",
	"description": "A generic obsidian plugin template for cBugs development",
	"main": "main.js",
	"author": "cBugs",
	"license": "MIT",
	"packageManager": "pnpm@8.0.0",
	"keywords": ["obsidian", "plugin", "cbugs", "template"],
	"scripts": {
		"dev": "node esbuild.config.mjs",
		"build": "tsc -noEmit -skipLibCheck && node esbuild.config.mjs production",
		"version": "node version-bump.mjs && git add manifest.json versions.json"
	},
	"devDependencies": {
		"@types/node": "^16.11.6",
		"@typescript-eslint/eslint-plugin": "5.29.0",
		"@typescript-eslint/parser": "5.29.0",
		"builtin-modules": "3.3.0",
		"esbuild": "0.17.3",
		"obsidian": "latest",
		"tslib": "2.4.0",
		"typescript": "4.7.4"
	}
}
EOF

# 7. 更新 versions.json
cat > versions.json << 'EOF'
{
	"0.1.0": "0.15.0"
}
EOF

# 8. 创建同步脚本
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

# 9. 创建 README 说明文档
cat > README.md << 'EOF'
# CBugs Obsidian Plugin Template

这是一个通用的 Obsidian 插件开发模板框架。

## 使用方法

### 1. 复制模板
将整个 `cbugs-obsidian-plugin` 目录复制到新位置，并重命名为你的插件目录名（遵循 `cbugs-xxx` 或 `cbugs-xxx-plugin` 命名规范）。

### 2. 修改配置
根据你的业务需求修改以下文件中的占位符：

#### manifest.json
- `id`: 修改为符合规范的插件 ID（如 `cbugs-your-feature`）
- `name`: 修改为插件的实际名称（如 `CBugs Your Feature`）
- `description`: 修改为插件的功能描述

#### package.json
- `name`: 修改为与 manifest.json 中的 id 一致
- `description`: 修改为插件的功能描述
- `keywords`: 根据需要添加或修改关键词

### 3. 创建需求文档
创建 `REQUIREMENTS.md` 记录业务需求（一字不差保留用户原始描述）。

### 4. 开始开发
- 运行 `pnpm run dev` 启动开发模式
- 运行 `pnpm run build` 构建插件
- 运行 `./ob-sync.sh` 同步到 Obsidian

## 技术栈

- **包管理器**: pnpm
- **版本控制**: jj
- **构建工具**: esbuild + TypeScript
- **版本**: 0.1.0
- **作者**: cBugs

## 注意事项

- main.ts 保持官方模板原样，业务逻辑在后续开发中实现
- 所有配置文件已预配置为标准格式
- 已配置 .gitignore 忽略开发工具元数据
EOF

# 10. 创建 REQUIREMENTS.md 模板
cat > REQUIREMENTS.md << 'EOF'
# 业务需求文档

## 重要说明

**本文件是模板占位符，在开始业务开发前必须完成以下修改：**

### 1. 修改配置文件

根据业务核心功能修改以下内容：

#### 命名规范

**插件 ID 命名规则：**
- 必须以 `cbugs-` 开头
- 推荐格式：尽量使用两个 `-` 连接的名称（如 `cbugs-xxx-plugin`）
- 长度限制：不要超过 2 个 `-` 连接
- 长名称处理：如果插件名称较长，可以省略最后的 `-plugin` 后缀，自行取舍
- 示例：
  - `cbugs-simple-plugin` ✓ (推荐格式)
  - `cbugs-create-link` ✓ (省略 -plugin)
  - `cbugs-very-long-name-plugin` ✗ (超过 2 个 `-`，不推荐)

**插件名称命名规则：**
- 必须以 `CBugs` 开头
- 使用标题大写格式（Title Case）
- 示例：`CBugs Simple Plugin`、`CBugs Create Link`

**目录名规则：**
- 与插件 ID 完全一致

#### manifest.json
- `id`: 当前为 `cbugs-obsidian-plugin`，需修改为符合命名规范的具体功能 ID
- `name`: 当前为 `CBugs Obsidian Plugin`，需修改为符合命名规范的具体功能名称
- `description`: 当前为通用描述，需修改为具体功能描述

#### package.json
- `name`: 与 manifest.json 的 id 保持一致
- `description`: 与 manifest.json 的 description 保持一致
- `keywords`: 根据业务功能添加相关关键词

#### 目录重命名
- 将项目目录从当前名称重命名为与 manifest.json 的 id 一致的名称

### 2. 记录业务需求

**重要：必须一字不差地保留用户原始需求描述**

将下方"功能概述"和"详细需求"的占位符内容替换为用户的实际原话：
- 不要改写、总结或优化用户的描述
- 直接复制粘贴用户的原始表达
- 保持用户的语气和用词
- 目的是确保开发时准确理解用户的真实意图

---

## 功能概述
[一字不差地复制粘贴用户对功能的概述描述]

## 详细需求
[一字不差地复制粘贴用户对功能的详细需求描述]

## 项目管理说明

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
- **功能完成流程**: 每完成一个功能后，执行 `pnpm run build && sh ob-sync.sh` 自动构建并同步到 Obsidian

---
*本文档在业务开发开始时更新，记录用户原始需求*
*开发过程中请参考本文档确保实现符合需求*
EOF

# 11. 改造 AGENTS.md（如果存在）
if [ -f "AGENTS.md" ]; then
    echo "📝 检测到 AGENTS.md，进行 pnpm 改造..."
    # 将所有 npm 命令替换为 pnpm
    sed -i '' 's/npm install/pnpm install/g' AGENTS.md
    sed -i '' 's/npm run build/pnpm run build/g' AGENTS.md
    sed -i '' 's/npm run dev/pnpm run dev/g' AGENTS.md
    sed -i '' 's/npm run/pnpm run/g' AGENTS.md
    echo "✅ AGENTS.md 已更新为使用 pnpm"
else
    echo "ℹ️  未检测到 AGENTS.md，跳过此步骤"
fi

# 12. 完成初始化提交
echo "🔧 通用框架模板部署完成，准备提交 Initial Commit..."
jj commit -m "Initial Commit - Generic template framework setup

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <you@example.com>"

echo "✅ Initial Commit 已提交，通用模板框架初始化完成"
echo "📝 此模板可复制用于创建新的插件项目"
```

## 初始化工作流程

1. **创建通用框架**
   - 克隆官方模板到 `obsidian-plugin-template` 目录
   - 使用占位符配置所有文件

2. **环境设置**
   - 转换为 pnpm 项目
   - 配置版本控制（jj）
   - 创建同步脚本模板

3. **配置文件标准化**
   - 使用占位符更新 manifest.json
   - 使用占位符更新 package.json
   - 更新 versions.json

4. **文档创建**
   - 创建 README.md 使用说明
   - 创建 REQUIREMENTS.md 模板
   - 改造 AGENTS.md（如果存在）

5. **初始提交**
   - 提交通用框架的 Initial Commit

## 配置文件模板

### manifest.json
```json
{
	"id": "cbugs-obsidian-plugin",
	"name": "CBugs Obsidian Plugin",
	"version": "0.1.0",
	"minAppVersion": "0.15.0",
	"description": "A generic obsidian plugin template for cBugs development",
	"author": "cBugs",
	"isDesktopOnly": false
}
```

### package.json
```json
{
	"name": "cbugs-obsidian-plugin",
	"version": "0.1.0",
	"description": "A generic obsidian plugin template for cBugs development",
	"main": "main.js",
	"author": "cBugs",
	"license": "MIT",
	"packageManager": "pnpm@8.0.0",
	"keywords": ["obsidian", "plugin", "cbugs", "template"],
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

## 从模板创建新项目的步骤

### 1. 复制模板
```bash
cp -r cbugs-obsidian-plugin cbugs-[your-plugin-name]
cd cbugs-[your-plugin-name]
```
#!/usr/bin/env bash
# Sync the three release artifacts into the Obsidian vault.
# CUSTOMIZE: never hardcode the vault path. Provide it via OBSIDIAN_PLUGINS_DIR
#            or a .vault-path file next to this script (gitignored).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

VAULT_PLUGINS_DIR="${OBSIDIAN_PLUGINS_DIR:-}"
if [ -z "$VAULT_PLUGINS_DIR" ] && [ -f "$SCRIPT_DIR/.vault-path" ]; then
    VAULT_PLUGINS_DIR="$(tr -d '[:space:]' < "$SCRIPT_DIR/.vault-path")"
fi

if [ -z "$VAULT_PLUGINS_DIR" ]; then
    echo "❌ 未配置 vault 插件目录。" >&2
    echo "   export OBSIDIAN_PLUGINS_DIR=/path/to/vault/.obsidian/plugins" >&2
    echo "   或: echo /path/to/vault/.obsidian/plugins > .vault-path" >&2
    exit 1
fi
if [ ! -d "$VAULT_PLUGINS_DIR" ]; then
    echo "❌ vault 插件目录不存在: $VAULT_PLUGINS_DIR" >&2
    echo "   请按 CUSTOMIZE.md 换成你自己的真实路径（且不要提交该路径）。" >&2
    exit 1
fi
if [ ! -f "$SCRIPT_DIR/manifest.json" ]; then
    echo "❌ 找不到 manifest.json，这不是有效的插件目录。" >&2
    exit 1
fi

SYNC_FILES=("main.js" "manifest.json" "styles.css")
PLUGIN_ID="$(grep '"id"' "$SCRIPT_DIR/manifest.json" | cut -d '"' -f 4)"
TARGET_DIR="$VAULT_PLUGINS_DIR/$PLUGIN_ID"

echo "🔄 同步插件: $PLUGIN_ID"
echo "📂 目标: $TARGET_DIR"
mkdir -p "$TARGET_DIR"
for f in "${SYNC_FILES[@]}"; do
    if [ -f "$SCRIPT_DIR/$f" ]; then
        cp "$SCRIPT_DIR/$f" "$TARGET_DIR/"
        echo "✅ 已同步: $f"
    else
        echo "⏭️  跳过（不存在）: $f"
    fi
done
echo "🎉 完成。改了代码没重载时，先确认这里的 main.js mtime 变了。"
# 本套件自带 hot-reload 不需要 .hotreload 标记；若你改用 pjeby/hot-reload，
# 在此加一行: touch "$TARGET_DIR/.hotreload"

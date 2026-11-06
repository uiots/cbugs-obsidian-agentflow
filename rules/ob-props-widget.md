> 原作者规范原文（已脱敏：外置盘路径→`${OBSIDIAN_PLUGINS_DIR}`/`<EXTERNAL_DISK>`，示例邮箱→`you@example.com`）。**含本机口味，仅作参考**；通用化版见 `../docs/conventions.md`，替换清单见 `../CUSTOMIZE.md`。

---

# Obsidian 属性类型（Widget）获取方法

## 概述

Obsidian 使用 `metadataTypeManager` 来管理属性的类型定义。属性类型在 Obsidian 内部称为 "widget"。

**重要原则：只使用单一方案，不使用 fallback，保持代码简单清晰，便于调试。**

## 属性类型获取方法（唯一方案）

### 方法

只使用 `metadataTypeManager.getAllProperties()` 获取已注册的属性类型。

```typescript
const metadataTypeManager = (app as any).metadataTypeManager;
const registeredProperties = metadataTypeManager?.getAllProperties?.() || {};

// 获取特定属性的类型
const propertyName = 'types';
const registered = registeredProperties[propertyName.toLowerCase()];

if (registered?.widget) {
  const propertyType = registered.widget; // 'multitext'
} else {
  // 属性未注册，跳过或使用默认处理
}
```

### 实现示例

```typescript
async scanProperties(): Promise<PropertyInfo[]> {
  const propertyMap = new Map<string, PropertyInfo>();
  const files = this.app.vault.getMarkdownFiles();

  // 获取已注册的属性定义
  const metadataTypeManager = (this.app as any).metadataTypeManager;
  const registeredProperties = metadataTypeManager?.getAllProperties?.() || {};

  for (const file of files) {
    const cache = this.app.metadataCache.getFileCache(file);
    if (!cache?.frontmatter) continue;

    for (const [key, value] of Object.entries(cache.frontmatter)) {
      if (key === 'position') continue; // 跳过系统属性

      // 只使用注册的属性类型
      const registered = registeredProperties[key.toLowerCase()];
      if (!registered?.widget) continue; // 跳过未注册的属性

      const propertyType = registered.widget;

      // 存储属性信息...
      if (!propertyMap.has(key)) {
        propertyMap.set(key, {
          name: key,
          type: propertyType,
          count: 0,
          files: []
        });
      }

      const info = propertyMap.get(key)!;
      info.count++;
      info.files.push(file.path);
    }
  }

  return Array.from(propertyMap.values());
}
```

### 注意事项

- **属性名是小写**：`registeredProperties` 的键都是小写，查询时使用 `key.toLowerCase()`
- **未注册属性处理**：如果 `!registered?.widget`，直接跳过该属性
- **无 fallback**：不从 `cache.frontmatterTypes` 获取，不从值推断类型

## 图标获取方法（唯一方案）

### 方法

只使用 `metadataTypeManager.registeredTypeWidgets` 获取图标。

```typescript
function getIconForType(app: App, type: string): string {
  const metadataTypeManager = (app as any).metadataTypeManager;
  const registeredTypeWidgets = metadataTypeManager?.registeredTypeWidgets;

  if (registeredTypeWidgets && registeredTypeWidgets[type]) {
    const icon = registeredTypeWidgets[type].icon;
    // 移除 'lucide-' 前缀
    return icon.replace('lucide-', '');
  }

  // 类型未找到，返回默认图标
  return 'minus';
}
```

### 使用示例

```typescript
import { setIcon } from 'obsidian';

// 1. 获取属性类型
const registered = registeredProperties['types'];
const propertyType = registered.widget; // 'multitext'

// 2. 获取图标
const iconName = getIconForType(app, propertyType); // 'list'

// 3. 设置图标到 DOM 元素
const iconEl = document.createElement('div');
setIcon(iconEl, iconName);
```

### 注意事项

- **移除前缀**：`registeredTypeWidgets[type].icon` 返回 `'lucide-list'`，需要移除 `'lucide-'` 前缀
- **默认图标**：如果类型不存在，返回 `'minus'`
- **无手动映射**：不使用硬编码的 icon map

## 属性对象结构

每个属性对象包含以下字段：

```typescript
{
  name: string;        // 属性名称（小写）
  widget: string;      // 属性类型/widget
  occurrences: number; // 使用次数
}
```

## 示例输出

```javascript
{
  aliases: { name: 'aliases', widget: 'aliases', occurrences: 0 },
  attachments: { name: 'attachments', widget: 'multitext', occurrences: 18 },
  created: { name: 'created', widget: 'datetime', occurrences: 4678 },
  cssclasses: { name: 'cssclasses', widget: 'multitext', occurrences: 0 },
  tags: { name: 'tags', widget: 'tags', occurrences: 1876 },
  types: { name: 'types', widget: 'multitext', occurrences: 6 }
}
```

## 所有可用的 Widget 类型

通过 `metadataTypeManager.registeredTypeWidgets` 可以看到所有支持的 widget 类型：

- `text` - 文本
- `multitext` - 列表/多行文本
- `number` - 数字
- `checkbox` - 复选框
- `date` - 日期
- `datetime` - 日期时间
- `tags` - 标签
- `aliases` - 别名
- `file` - 文件链接
- `folder` - 文件夹链接
- `property` - 属性引用

## Widget 类型对应的图标

每个 widget 类型都有对应的 Lucide 图标：

```typescript
const registeredTypeWidgets = metadataTypeManager.registeredTypeWidgets;

// 示例：
registeredTypeWidgets.multitext.icon  // 'lucide-list'
registeredTypeWidgets.datetime.icon   // 'lucide-clock'
registeredTypeWidgets.tags.icon       // 'lucide-tags'
registeredTypeWidgets.text.icon       // 'lucide-text'
registeredTypeWidgets.number.icon     // 'lucide-binary'
```

## 完整实现示例

```typescript
import { App, setIcon } from 'obsidian';

interface PropertyInfo {
  name: string;
  type: string;
  count: number;
  files: string[];
}

class PropertyScanner {
  constructor(private app: App) {}

  async scanProperties(): Promise<PropertyInfo[]> {
    const propertyMap = new Map<string, PropertyInfo>();
    const files = this.app.vault.getMarkdownFiles();

    const metadataTypeManager = (this.app as any).metadataTypeManager;
    const registeredProperties = metadataTypeManager?.getAllProperties?.() || {};

    for (const file of files) {
      const cache = this.app.metadataCache.getFileCache(file);
      if (!cache?.frontmatter) continue;

      for (const [key, value] of Object.entries(cache.frontmatter)) {
        if (key === 'position') continue;

        const registered = registeredProperties[key.toLowerCase()];
        if (!registered?.widget) continue;

        const propertyType = registered.widget;

        if (!propertyMap.has(key)) {
          propertyMap.set(key, {
            name: key,
            type: propertyType,
            count: 0,
            files: []
          });
        }

        const info = propertyMap.get(key)!;
        info.count++;
        info.files.push(file.path);
      }
    }

    return Array.from(propertyMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  getIconForType(type: string): string {
    const metadataTypeManager = (this.app as any).metadataTypeManager;
    const registeredTypeWidgets = metadataTypeManager?.registeredTypeWidgets;

    if (registeredTypeWidgets && registeredTypeWidgets[type]) {
      const icon = registeredTypeWidgets[type].icon;
      return icon.replace('lucide-', '');
    }

    return 'minus';
  }

  renderPropertyItem(property: PropertyInfo, containerEl: HTMLElement): void {
    const itemEl = containerEl.createDiv({ cls: 'tree-item-self' });

    // 图标
    const iconEl = itemEl.createDiv({ cls: 'tree-item-icon' });
    const iconName = this.getIconForType(property.type);
    setIcon(iconEl, iconName);

    // 属性名
    const textEl = itemEl.createDiv({ cls: 'tree-item-inner' });
    textEl.setText(property.name);

    // 计数
    const countEl = itemEl.createDiv({ cls: 'tree-item-flair-outer' });
    countEl.setText(property.count.toString());
  }
}
```

## 设计原则

### 为什么不使用 Fallback？

1. **简单清晰**：单一数据源，代码逻辑直观易懂
2. **易于调试**：出错只需检查 `metadataTypeManager` API，不需要追踪多个分支
3. **保持一致**：完全依赖 Obsidian 的定义，避免推断错误
4. **明确责任**：如果属性没有显示，说明用户需要在 Obsidian 设置中定义属性类型

### 处理未注册属性

如果属性未在 Obsidian 中注册：
- **当前方案**：直接跳过，不显示在列表中
- **用户操作**：在 Obsidian 设置 > 核心插件 > 属性 中为该属性定义类型
- **优点**：强制用户规范使用属性，避免"幽灵属性"

## MetadataTypeManager 可用方法

```typescript
metadataTypeManager.getAllProperties()      // 获取所有属性定义
metadataTypeManager.getPropertyInfo(name)   // 获取特定属性信息
metadataTypeManager.getTypeInfo(type)       // 获取类型信息
metadataTypeManager.getWidget(type)         // 获取 widget 定义
metadataTypeManager.setType(name, type)     // 设置属性类型
metadataTypeManager.unsetType(name)         // 取消属性类型设置
```

## 参考

- 项目：CBugs Props Manager
- 文件：`src/services/PropertyScanner.ts`
- 日期：2025-01-18
- 原则：单一方案，无 fallback

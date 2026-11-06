import { Plugin, Notice, debounce } from "obsidian";

// Type declarations for Obsidian internals
declare module "obsidian" {
  interface App {
    plugins: {
      manifests: Record<string, PluginManifest>;
      getPluginFolder(): string;
      enabledPlugins: Set<string>;
      disablePlugin(pluginId: string): Promise<void>;
      enablePlugin(pluginId: string): Promise<void>;
    };
  }

  interface Vault {
    on(type: "raw", handler: (filename: string) => void): EventRef;
  }
}

export default class HotReloadPlugin extends Plugin {
  // 将 Obsidian 窗口拉到前台，尽可能使用 Electron 原生 API；失败则返回 false
  private bringToFront(): boolean {
    const win = this.getBrowserWindow();
    if (!win) return false;

    try {
      win.show();
      win.focus();

      if (typeof win.moveTop === "function") {
        win.moveTop();
      }
      return true;
    } catch (error) {
      console.error("Hot Reload: bringToFront failed", error);
      return false;
    }
  }

  private getBrowserWindow(): any | null {
    // 优先 @electron/remote，Obsidian 1.x 常用
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const remote = require("@electron/remote");
      const { BrowserWindow } = remote;
      return (
        BrowserWindow?.getFocusedWindow?.() ??
        BrowserWindow?.getAllWindows?.()?.[0] ??
        null
      );
    } catch (error) {
      console.warn("Hot Reload: @electron/remote not available", error);
    }

    // 退化到 electron.remote（部分发行版仍提供）
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const electron = require("electron");
      const remote = electron?.remote;
      return (
        remote?.getCurrentWindow?.() ??
        remote?.BrowserWindow?.getAllWindows?.()?.[0] ??
        null
      );
    } catch (error) {
      console.warn("Hot Reload: electron.remote not available", error);
      return null;
    }
  }

  private showNotice(message: string, duration: number) {
    const ok = this.bringToFront();
    if (!ok) {
      throw new Error("Hot Reload: bringToFront failed, aborting notice");
    }
    new Notice(message, duration);
  }

  private reloadPlugin = debounce(
    async (pluginId: string) => {
      if (!this.app.plugins.enabledPlugins.has(pluginId)) {
        console.log(
          `Hot Reload: Plugin ${pluginId} is not enabled, skipping reload`,
        );
        return;
      }

      try {
        console.log(`Hot Reload: ⏸️  Disabling plugin ${pluginId}...`);
        await this.app.plugins.disablePlugin(pluginId);

        console.log(`Hot Reload: ▶️  Enabling plugin ${pluginId}...`);
        await this.app.plugins.enablePlugin(pluginId);

        console.log(`Hot Reload: ✅ Successfully reloaded ${pluginId}`);
        this.showNotice(`🔄 ${pluginId}`, 8000);
      } catch (error) {
        console.error(`Hot Reload: ❌ Failed to reload ${pluginId}:`, error);
        this.showNotice(`❌ ${pluginId}`, 8000);
      }
    },
    500,
    true,
  );

  async onload() {
    this.addCommand({
      id: "simulate-hot-reload",
      name: "Simulate Hot Reload (Cmd+6)",
      hotkeys: [{ modifiers: ["Mod"], key: "6" }],
      callback: () => {
        const pluginId = this.manifest.id;
        this.reloadPlugin(pluginId);
      },
    });

    this.app.workspace.onLayoutReady(() => {
      console.log("Hot Reload: Plugin started - monitoring all plugins");
      this.showNotice("Hot Reload: Monitoring all plugins", 1500);

      this.registerEvent(this.app.vault.on("raw", this.onFileChange));
      console.log("Hot Reload: File watching enabled for all plugins");
    });
  }

  onunload() {
  }

  private onFileChange = (filename: string) => {
    const pluginsFolder = this.app.plugins.getPluginFolder();
    if (!filename.startsWith(pluginsFolder + "/")) return;

    const pathParts = filename.split("/");
    if (pathParts.length < 3) return;

    const fileName = pathParts[pathParts.length - 1];
    if (fileName !== "main.js" && fileName !== "styles.css") return;

    const pluginDirName = pathParts[pathParts.length - 2];
    const pluginId = this.findPluginIdByDir(pluginDirName);
    
    if (!pluginId) {
      console.log(`Hot Reload: Plugin not found for directory: ${pluginDirName}`);
      return;
    }

    console.log(`Hot Reload: 🔥 ${fileName} changed for ${pluginId}`);
    this.reloadPlugin(pluginId);
  };

  private findPluginIdByDir(dirName: string): string | null {
    for (const manifest of Object.values(this.app.plugins.manifests)) {
      if (manifest.dir && manifest.dir.endsWith(`/${dirName}`)) {
        return manifest.id;
      }
    }
    return null;
  }
}
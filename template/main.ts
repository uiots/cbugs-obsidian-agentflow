import { App, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";

interface MySettings { greeting: string; }
const DEFAULT_SETTINGS: MySettings = { greeting: "Hello" };

export default class MyPlugin extends Plugin {
    settings!: MySettings;

    async onload() {
        await this.loadSettings();

        // CUSTOMIZE: addCommand 必带 icon（本套件的示例品牌约定）
        this.addCommand({
            id: "show-greeting",
            name: "Show greeting",
            icon: "message-circle",
            callback: () => new Notice(this.settings.greeting),
        });

        this.addSettingTab(new MySettingTab(this.app, this));
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class MySettingTab extends PluginSettingTab {
    plugin: MyPlugin;
    constructor(app: App, plugin: MyPlugin) { super(app, plugin); this.plugin = plugin; }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        // 官方推荐：用 Setting / setHeading，而不是手写 <h1>，也别用 innerHTML 拼 DOM
        new Setting(containerEl).setName("My Plugin").setHeading();
        new Setting(containerEl)
            .setName("Greeting")
            .setDesc("Text shown by the command.")
            .addText((t) => t
                .setValue(this.plugin.settings.greeting)
                .onChange(async (v) => {
                    this.plugin.settings.greeting = v;
                    await this.plugin.saveSettings();
                }));
    }
}

# cbugs-obsidian-agentflow

> An agent-ready development workflow for Obsidian community plugins: scaffold → build → auto-sync → hot-reload.

[简体中文](README.zh-CN.md) · [Documentation](docs/) · [Issues](https://github.com/uiots/cbugs-obsidian-agentflow/issues)

**Status:** A personal learning and rapid-prototyping toolkit for individual developers. It codifies one working setup into a copyable starting point — not a production framework, an Obsidian standard, or a team convention. Extend and adapt it to your own project; see [Customize](#customize).

## Why

Obsidian loads only three artifacts from `<vault>/.obsidian/plugins/<id>/`: `main.js`, `manifest.json` and `styles.css`. Source usually lives elsewhere. `esbuild --watch` rebuilds `main.js` in the source directory, but nothing copies it into the vault — so the plugin never reloads. This repository turns that copy step into configuration and wires it to a hot-reload plugin that watches the vault.

## What's included

| Path | Contents |
| --- | --- |
| `AGENTS.md` | Entry instructions and hard constraints for coding agents |
| `CUSTOMIZE.md` | **Required reading** — what to replace before adopting |
| `docs/workflow.md` | Full scaffold → build → sync → reload → debug workflow |
| `docs/conventions.md` | Naming, manifest, versioning and styling conventions |
| `docs/pitfalls.md` | 12 pitfalls, each labelled Verified / Researched / Trade-off |
| `docs/ecosystem-notes.md` | Community tooling survey with evidence grades |
| `docs/roadmap.md` | What is **not** implemented (notably release / publishing) |
| `rules/` | Original conventions, scrubbed; reference only |
| `template/` | Copyable plugin scaffold (configurable `ob-sync.sh`, esbuild config) |
| `hot-reload/` | Self-built hot-reload plugin source (alternative to `pjeby/hot-reload`) |

The `docs/` files are written in Chinese.

## Requirements

- Node.js 18+ and pnpm (npm / yarn / bun work too — see `docs/conventions.md`)
- Obsidian desktop; the bundled hot-reload plugin uses desktop-only APIs
- A writable **sandbox** vault for verification — never point this at your active vault

## Quick start

```bash
git clone https://github.com/uiots/cbugs-obsidian-agentflow.git
cd cbugs-obsidian-agentflow

cat CUSTOMIZE.md                       # required: replace before adopting

cp -R template/ ../my-plugin
cd ../my-plugin
pnpm install

echo "/path/to/your/vault/.obsidian/plugins" > .vault-path
# or: export OBSIDIAN_PLUGINS_DIR=/path/to/your/vault/.obsidian/plugins

pnpm run sync                          # first deploy: copies the three artifacts
pnpm run dev                           # watch; writes main.js straight into the vault
```

Then enable both your plugin and `hot-reload/` under Obsidian → Community plugins. Hand `AGENTS.md` to your coding agent and point it at `docs/workflow.md`.

## How it works

```
source (main.ts, styles.css)
  |  esbuild bundle — CJS; obsidian / electron / codemirror kept external
  v
main.js + manifest.json + styles.css
  |  copy — ob-sync.sh, or dev-mode outfile written directly into the vault
  v
<vault>/.obsidian/plugins/<id>/
  |  vault file change detected
  v
hot-reload -> disablePlugin(id) -> enablePlugin(id)
```

- **Mode A (recommended):** set `OBSIDIAN_PLUGINS_DIR` (or `.vault-path`) and `pnpm run dev` writes `main.js` directly into the vault. One command closes the loop.
- **Mode B:** `pnpm run build` produces locally, then `pnpm run sync` copies. A missing or non-existent path exits with an error instead of silently creating directories elsewhere.

Both modes are described in `docs/workflow.md`. The bundled hot-reload plugin listens on vault file changes and needs no `.hotreload` marker.

## Customize

`CUSTOMIZE.md` lists what to replace before adopting: plugin ID, display name and author; vault path; package manager and tool versions; version-control system; and the hot-reload implementation. `rules/` contains the original conventions (scrubbed) as a reference — they reflect one developer's environment, not platform requirements.

Treat `docs/` as a reference, combine it with your own stack, vault layout and release process, and re-verify anything labelled **Verified** on your own machine. Findings marked **【实测】** in the Chinese docs were measured on the original author's setup.

## Project status

| Stage | Status |
| --- | --- |
| Scaffold, naming / manifest conventions | ✅ Ready |
| `pnpm run build` | ✅ Verified in sandbox |
| `ob-sync.sh` (configurable path, fails loudly) | ✅ Verified in sandbox |
| Dev-mode direct write to vault | ✅ Verified in sandbox |
| Hot-reload loop | ✅ Builds; source complete. In-app reload not UI-verified; uses internal APIs (see `docs/pitfalls.md`) |
| **Release / publishing** — tags, GitHub Actions, changelog, `versions.json`, community submission, BRAT | ❌ **Not implemented** |

See `docs/roadmap.md`. This is a growing workflow, not a finished framework; do not assume the publishing stage exists.

## Contributing

Issues and PRs are welcome. When adding a pitfall, label it **Verified** (with OS, Obsidian and tool versions) or **Inferred** — see `docs/pitfalls.md`. Never commit secrets, real vault paths, `main.js` or `node_modules/`.

## License

MIT — see `LICENSE`.

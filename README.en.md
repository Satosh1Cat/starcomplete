# StarComplete

[中文](./README.md) | [English](./README.en.md)

Rerank existing IntelliSense and **star** the likely items. No chat, no repo edits, no model training.

Repo: https://github.com/Satosh1Cat/starcomplete

## What it is

The language service already lists legal candidates. StarComplete does one job: using the current file, imports, receiver, and common API frequencies, it **stars and pins** the most likely items at the top.

TypeScript / JavaScript (including TSX / JSX). Local only. No network.

## Clone

```bash
git clone https://github.com/Satosh1Cat/starcomplete.git
cd starcomplete
npm install
```

## Eval

```bash
npm test
```

Must pass: ranker unit tests, plus offline Top-1 / Top-3 **above** the original candidate order in the fixtures. No fixtures, no claim of “smarter.”

Build the extension:

```bash
npm run build
```

## Install the VSIX

The repo root ships `starcomplete-0.1.1.vsix`. If it is missing after a clone, build and package:

```bash
npm run build
cd extension
npx --yes @vscode/vsce package
```

Then install in **VS Code** or **Cursor**:

1. Command Palette (macOS: ⌘⇧P, Windows / Linux: Ctrl+Shift+P)
2. Run **Extensions: Install from VSIX…**
3. Pick `starcomplete-0.1.1.vsix` (repo root or `extension/`)

CLI (`code` or `cursor` on your PATH):

```bash
code --install-extension ./starcomplete-0.1.1.vsix
# or
cursor --install-extension ./starcomplete-0.1.1.vsix
```

Open the Command Palette and run `Developer: Reload Window`. The status bar should show **★ StarComplete**.

## Try it

**In the editor (extension installed):**

1. Open `extension/examples/playground.ts`
2. Put the caret to the right of the dot in `console.`
3. Trigger completions: Ctrl+Space (on macOS that is Control, not Command)
4. The top of the list should show **★ log**, **★ error**, **★ warn**

If you only see `assert` / `clear` / `count` with no ★, that is the stock language-service order. The extension is not active.

**In a browser (no extension):** open `playground/index.html`.

## Docs

1. [docs/00-problem.md](./docs/00-problem.md) — the problem is ranking, not “AI writes code”
2. [docs/01-users-jtbd.md](./docs/01-users-jtbd.md) — users and jobs-to-be-done
3. [docs/02-competitive.md](./docs/02-competitive.md) — competitors
4. [docs/03-prd-mvp.md](./docs/03-prd-mvp.md) — MVP spec
5. [docs/04-metrics-eval.md](./docs/04-metrics-eval.md) — eval gate
6. [docs/05-layer-map.md](./docs/05-layer-map.md) — layer map
7. [docs/06-roadmap.md](./docs/06-roadmap.md) — roadmap

## License

[MIT](./LICENSE)

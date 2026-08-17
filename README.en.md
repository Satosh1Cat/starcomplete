# StarComplete

[中文](./README.md) | [English](./README.en.md)

Rerank existing IntelliSense and **star** the likely items. No chat, no repo edits, no model training.

Repo: https://github.com/Satosh1Cat/starcomplete

## Install (Cursor / Mac)

The Extensions panel has **no** Install from VSIX. Do not look for that menu. Use the terminal:

```bash
git clone git@github.com:Satosh1Cat/starcomplete.git
cd starcomplete
npm install
npm test
npm run build
```

Install the extension (a VSIX is already in the repo):

```bash
/Applications/Cursor.app/Contents/Resources/app/bin/cursor --install-extension ./starcomplete-0.1.1.vsix
```

Then press **⌘⇧P** and run `Developer: Reload Window`. The bottom-right corner should show **★ StarComplete**.

More click-by-click steps: [打开方式.md](./打开方式.md).

## Try it

1. Open `extension/examples/playground.ts`
2. If the line is already `console.log();`, delete `log()` and leave `console.`
3. Put the caret to the right of the dot: `console.|`
4. Press **Control+Space** (Control in the bottom-left, not Command)
5. The top of the list should show **★ log**, **★ error**, **★ warn**

If you only see `assert` / `clear` / `count` with no ★, that is stock TypeScript completion. It is not success.

If the extension will not install, open `playground/index.html` in a browser.

## Eval

```bash
npm test
```

Must pass: ranker unit tests, plus offline Top-1 / Top-3 above the original candidate order. No fixtures, no claim of “smarter.”

## Docs

1. [docs/00-problem.md](./docs/00-problem.md) — the problem is ranking, not “AI writes code”
2. [docs/03-prd-mvp.md](./docs/03-prd-mvp.md) — MVP spec
3. [docs/04-metrics-eval.md](./docs/04-metrics-eval.md) — eval gate

Also: users / competitors / [layer map](./docs/05-layer-map.md) / roadmap.

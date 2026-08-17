# StarComplete

给 VS Code 已有的 IntelliSense **重新排序并打星标**。不聊天，不改仓库，不训练模型。

仓库在 `/Users/macbookpro/starcomplete`，不是 NewIdea。

## 安装并跑通评测

在终端执行：

```bash
cd /Users/macbookpro/starcomplete
npm install
npm test
npm run build
```

`npm test` 必须通过：ranker 单测 + 离线 Top-1 / Top-3 高于原始候选顺序。

## 在 Cursor 里看星标补全（Mac）

扩展面板里没有 **Install from VSIX**，不要去找。用终端装：

```bash
/Applications/Cursor.app/Contents/Resources/app/bin/cursor --install-extension /Users/macbookpro/starcomplete/starcomplete-0.1.1.vsix
```

装完后按 **⌘⇧P**，运行 `Developer: Reload Window`。

然后：

1. 打开 `/Users/macbookpro/starcomplete/extension/examples/playground.ts`。
2. 把光标放在 `console.` 的点后面，按 **Control+Space**（Control，不是 Command）。
3. 列表顶部应出现带 **★ StarComplete** 的项。

扩展装不上时，用浏览器打开 `/Users/macbookpro/starcomplete/playground/index.html`。

开发调试仍可用 F5：**Run StarComplete**（会先 `npm run build`，再开扩展开发窗口）。命令面板可跑 **StarComplete: Show extracted context**。

## 文档（先读这三页）

1. [docs/00-problem.md](./docs/00-problem.md) — 问题是排序，不是「AI 写代码」
2. [docs/03-prd-mvp.md](./docs/03-prd-mvp.md) — MVP 规格
3. [docs/04-metrics-eval.md](./docs/04-metrics-eval.md) — 评测门

其余：用户 / 竞品 / [分层](./docs/05-layer-map.md) / 路线图。

# StarComplete

[中文](./README.md) | [English](./README.en.md)

给编辑器已有的 IntelliSense **重新排序并打星标**。不聊天，不改仓库，不训练模型。

仓库：https://github.com/Satosh1Cat/starcomplete

## 安装（Cursor / Mac）

扩展面板里**没有** Install from VSIX，不要去找那个菜单。用终端：

```bash
git clone git@github.com:Satosh1Cat/starcomplete.git
cd starcomplete
npm install
npm test
npm run build
```

装插件（仓库里已打好包）：

```bash
/Applications/Cursor.app/Contents/Resources/app/bin/cursor --install-extension ./starcomplete-0.1.1.vsix
```

然后按 **⌘⇧P**，运行 `Developer: Reload Window`。右下角应出现 **★ StarComplete**。

更细的点击步骤见 [打开方式.md](./打开方式.md)。

## 怎么试

1. 打开 `extension/examples/playground.ts`
2. 如果已经是 `console.log();`，删掉 `log()`，只留 `console.`
3. 光标放在点右边：`console.|`
4. 按 **Control+Space**（键盘左下角 Control，不是 Command）
5. 列表最上面应出现 **★ log**、**★ error**、**★ warn**

只看到 `assert` / `clear` / `count`、名字前没有 ★，那是 TypeScript 自带补全，还没成功。

装不上扩展时，用浏览器打开 `playground/index.html`。

## 评测

```bash
npm test
```

必须通过：ranker 单测 + 离线 Top-1 / Top-3 高于原始候选顺序。没有 fixtures 不准说「更智能」。

## 文档

1. [docs/00-problem.md](./docs/00-problem.md) — 问题是排序，不是「AI 写代码」
2. [docs/03-prd-mvp.md](./docs/03-prd-mvp.md) — MVP 规格
3. [docs/04-metrics-eval.md](./docs/04-metrics-eval.md) — 评测门

其余：用户 / 竞品 / [分层](./docs/05-layer-map.md) / 路线图。

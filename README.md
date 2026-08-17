# StarComplete

[中文](./README.md) | [English](./README.en.md)

给编辑器已有的 IntelliSense **重新排序并打星标**。不聊天，不改仓库，不训练模型。

仓库：https://github.com/Satosh1Cat/starcomplete

## 它是什么

语言服务已经列出合法候选。StarComplete 只做一件事：按当前文件、import、接收者和常见 API 频率，把最可能的几项 **★ 置顶**。

适用 TypeScript / JavaScript（含 TSX / JSX）。本地运行，不走网络。

## 克隆

```bash
git clone https://github.com/Satosh1Cat/starcomplete.git
cd starcomplete
npm install
```

## 评测

```bash
npm test
```

必须通过：ranker 单测，以及离线 Top-1 / Top-3 **高于** fixtures 里的原始候选顺序。没有 fixtures，不准说「更智能」。

构建扩展：

```bash
npm run build
```

## 安装 VSIX

仓库根目录提供 `starcomplete-0.1.1.vsix`。若克隆后没有该文件，先构建再打包：

```bash
npm run build
cd extension
npx --yes @vscode/vsce package
```

然后在 **VS Code** 或 **Cursor** 里安装：

1. 命令面板（macOS：⌘⇧P，Windows / Linux：Ctrl+Shift+P）
2. 运行 **Extensions: Install from VSIX…**
3. 选中 `starcomplete-0.1.1.vsix`（根目录或 `extension/` 下）

命令行（`code` 或 `cursor` 已在 PATH 中时）：

```bash
code --install-extension ./starcomplete-0.1.1.vsix
# 或
cursor --install-extension ./starcomplete-0.1.1.vsix
```

再打开命令面板，运行 `Developer: Reload Window`。状态栏应出现 **★ StarComplete**。

## 怎么试

**编辑器里（扩展已装上）：**

1. 打开 `extension/examples/playground.ts`
2. 把光标放在 `console.` 的点右边
3. 触发补全：Ctrl+Space（macOS 是 Control，不是 Command）
4. 列表最上面应出现 **★ log**、**★ error**、**★ warn**

只看到 `assert` / `clear` / `count`、名字前没有 ★，那是语言服务自带顺序，扩展还没生效。

**浏览器（不装扩展）：** 打开 `playground/index.html`。

## 文档

1. [docs/00-problem.md](./docs/00-problem.md) — 问题是排序，不是「AI 写代码」
2. [docs/01-users-jtbd.md](./docs/01-users-jtbd.md) — 用户与任务
3. [docs/02-competitive.md](./docs/02-competitive.md) — 竞品
4. [docs/03-prd-mvp.md](./docs/03-prd-mvp.md) — MVP 规格
5. [docs/04-metrics-eval.md](./docs/04-metrics-eval.md) — 评测门
6. [docs/05-layer-map.md](./docs/05-layer-map.md) — 分层
7. [docs/06-roadmap.md](./docs/06-roadmap.md) — 路线图

## 许可

[MIT](./LICENSE)

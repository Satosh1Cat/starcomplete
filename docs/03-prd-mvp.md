# PRD · MVP

## 一句话

在 TypeScript / JavaScript 的补全列表里，把规则排序看好的项**打星并置顶**。

## 用户与场景

见 [01-users-jtbd.md](./01-users-jtbd.md)。第一语言：TS/JS。因为语言服务已经给出候选，我们只重排——IntelliCode 的原招。

## 体验

- 触发：用户在 `.ts` / `.js` / `.tsx` / `.jsx` 里唤起补全（`.` 或已有前缀）。
- 可见：最多 3 条带 ★ 的项出现在列表顶部；`detail` 写简短理由（imported / 同文件 / 常见 API）。
- 第一条可 `preselect`。
- 原 IntelliSense 列表仍在，不替换语言服务。
- 无聊天窗、无侧栏、无「问 AI」。

## 上下文（进 ranker 的全部）

- 当前文件全文（只为抽 import 和标识符计数，不索引别的文件）
- 光标偏移
- 当前行前缀 → 接收者（`console` in `console.`）和已打前缀（`fil` in `items.fil`）
- 当前函数名（能抽到就抽）
- 语言 ID

不读 `node_modules`，不建 repo index。

## 排序（v0 不接大模型）

纯函数，见 `ranker/`。信号：

1. 前缀匹配
2. 是否已出现在 import
3. 同文件标识符共现
4. 接收者频率表（`console.log`、`JSON.parse`、数组方法…）
5. 点后面的 method/function kind 小加成

热路径禁止第二次 LLM。超过 **p95 50ms** 算产品失败，不是「再等模型」。

## 延迟

| 段 | 预算 |
| --- | --- |
| 特征 + 排序 | p95 < 50ms |
| 向语言服务取候选 | 编辑器自己的时间，不计入我们的 50ms |
| 网络 | v0 为 0 |

## 非目标

聊天、多文件重构、自动 commit、训练基座、中国中转、企业 SSO、Python、整行生成。

## 验收

1. F5 开扩展，在 `console.` 下 ★ `log` 在顶部。
2. `npm test`：离线 Top-1 和 Top-3 **严格高于** fixtures 里的原始顺序。
3. 没有 fixtures 的「我觉得更聪明」不算验收。

## v1.1（写在这里以免现在就做）

整行补全：买 E5，接受率有数之后。提示只含当前函数 + import。不用 Batch/Flex 打光标。

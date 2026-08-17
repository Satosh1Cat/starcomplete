# 分层决策（做 / 买 / 不做）

地图是 NewIdea 的 [第 1 章 9 步](../../NewIdea/book/zh/part-01-value-chain/ch-01-nine-steps.md) 和 [第 2 章 26 层](../../NewIdea/book/zh/part-01-value-chain/ch-02-refined-26.md)。产品坐在 **G4（IDE 形态）**。每加功能先改这页，再改代码。

## 现在做

| 层 | 名称 | 我们具体做什么 | 为什么现在 |
| --- | --- | --- | --- |
| G4 | 按形态分的产品 | VS Code 扩展，星标置顶 | 这就是产品 |
| G2（最小） | 上下文 | 当前文件 + 光标前一行 + import + 当前函数名 | 第 11 章：最小够用，不是整仓 RAG |
| — | 特征提取 | import、共现、接收者、前缀。见第 23 章 | 热路径等不起第二个 LLM |
| D1 / 评测门 | 质量 | 自己的 fixtures：Top-1 / Top-3，不是 SWE-bench | 第 5 章：评测是决策；榜必须匹配任务 |

## 以后才买

| 层 | 何时买 | 买什么 |
| --- | --- | --- |
| E2 + E5 | v1.1 整行补全，且接受率已有数 | 托管推理 + Completions/Responses 方言 |
| E4 | 只有离线回放 / 批评测 | Batch。禁止用在光标主循环 |
| F2 | 自己用一周之后 | 接受 / 忽略 / p95 日志。先记本地文件即可 |
| E3 | 团队模型阶段 | 托管 LoRA。v0 用频率表代替 |

## 不做（角色不是实验室）

| 层 | 为什么不做 |
| --- | --- |
| A1 / A2 | 不租芯片、不建 GPU 云 |
| C1 | 不预训练 |
| E1 | 不自建 vLLM |
| F3 | 只排本地候选，没有多模型网关 |
| F1 / F4 | 没有 org 账单、没有等保 |
| G1 | 没有 tool loop |
| G3 | 没有 MCP / Skills |

## 故意推迟

G2 的 relatedness、仓库索引、compaction、session。MVP 窗口只有「当前函数 + import + 光标」。第 12 章的 L0–L4 在接 API 之前不必假装实现；一旦接 E5，system 前缀必须字节稳定，否则 cache 全 miss。

## 9 步上我们在哪

数据（公共先验表，不是 Scale）→ 不做训练 → 不「得到 LLM」→ 不部署引擎 → 不买 inference（v0）→ 没有 API 契约 → 没有 Gateway → **应用（本扩展）** → 用户（开发者自己）。

Cursor 在第 8 步且常跳过第 7 步。我们比 Cursor 更瘦：第 8 步里只做补全重排这一角。

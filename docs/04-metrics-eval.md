# 指标与评测门

评测是**决策**：出荷、改规则、还是禁止宣称「更智能」。不是体感。见 NewIdea [第 5 章](../../NewIdea/book/zh/part-01-value-chain/ch-05-eval-gate.md)。

## 为什么不用 SWE-bench

SWE-bench 量的是 issue → patch → 测试。那是 G1 coding agent 的门。我们的任务是：给定语言服务候选 + 当前文件，把期望符号排到前面。用错的榜会逼产品做成 agent。

## 离线门（出荷）

每条 fixture：`fileText` + `cursorOffset` + `candidates`（模拟 IntelliSense 顺序）+ `expected`。

| 指标 | 定义 | MVP 门 |
| --- | --- | --- |
| Top-1 | 排序后第一项 == expected | 高于 baseline，且绝对 ≥ 60% |
| Top-3 | expected 落在前三 | 高于 baseline，且绝对 ≥ 85% |
| 延迟 | `extractFeatures` + `rank` 墙钟 | 全套 fixtures p95 < 50ms |

baseline = 候选**原始顺序**（字母序或语言服务序）。只报自己的 Top-1、不报 baseline，算刷榜。

Harness 冻结在 `eval/src/score.ts`。改排序必须跑同一套 fixtures。改 fixture 集合要在 PR 里写原因——否则分数不可比。

## 线上门（自己用一周）

| 指标 | 定义 | 用来决定什么 |
| --- | --- | --- |
| 接受率 | 点了 ★ 项 / 弹出过 ★ 的次数 | 规则是否值得留 |
| 忽略率 | 弹出 ★ 但选了非星或取消 | 星标是否在骗人 |
| p95 延迟 | 特征+排序 | 超 50ms 就减特征，不加模型 |

v0 不强制埋点后端。先能在开发者工具里看日志。F2 可观测性是「以后买/做」，不是出荷阻塞，但**没有接受率不准开 v1.1**。

## 不是指标

- Arena Elo、MMLU、SWE-bench
- 「看起来像 AI」
- 星标条数（多星不是更好）

## 怎么跑

```bash
npm run eval
```

失败条件写在打分器里：ranked Top-1 / Top-3 必须都高于 baseline，否则 exit 1。

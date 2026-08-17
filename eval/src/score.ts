import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { extractFeatures, rank, type Candidate } from "@starcomplete/ranker";

interface Fixture {
  id: string;
  languageId?: string;
  fileText: string;
  cursorOffset?: number;
  cursorAt?: string;
  candidates: Candidate[];
  expected: string;
}

interface CaseResult {
  id: string;
  expected: string;
  baselineTop1: boolean;
  baselineTop3: boolean;
  rankedTop1: boolean;
  rankedTop3: boolean;
  rankedOrder: string[];
  baselineOrder: string[];
  elapsedMs: number;
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixtureDir = join(root, "fixtures");

function loadFixtures(): Fixture[] {
  return readdirSync(fixtureDir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => JSON.parse(readFileSync(join(fixtureDir, name), "utf8")) as Fixture);
}

function cursorOffset(fixture: Fixture): number {
  if (typeof fixture.cursorOffset === "number") {
    return fixture.cursorOffset;
  }
  if (fixture.cursorAt) {
    const index = fixture.fileText.indexOf(fixture.cursorAt);
    if (index < 0) {
      throw new Error(`${fixture.id}: cursorAt not found`);
    }
    return index + fixture.cursorAt.length;
  }
  return fixture.fileText.length;
}

function hitAt(labels: string[], expected: string, k: number): boolean {
  return labels.slice(0, k).includes(expected);
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[index] ?? 0;
}

function rate(results: CaseResult[], key: keyof CaseResult): number {
  return results.filter((item) => item[key] === true).length / results.length;
}

function main(): void {
  const fixtures = loadFixtures();
  if (fixtures.length === 0) {
    console.error("No fixtures in eval/fixtures");
    process.exit(1);
  }

  const results: CaseResult[] = fixtures.map((fixture) => {
    const offset = cursorOffset(fixture);
    const features = extractFeatures({
      languageId: fixture.languageId ?? "typescript",
      fileText: fixture.fileText,
      cursorOffset: offset,
    });
    const started = performance.now();
    const ranked = rank(fixture.candidates, features);
    const elapsedMs = performance.now() - started;
    const baselineOrder = fixture.candidates.map((item) => item.label);
    const rankedOrder = ranked.map((item) => item.label);
    return {
      id: fixture.id,
      expected: fixture.expected,
      baselineTop1: hitAt(baselineOrder, fixture.expected, 1),
      baselineTop3: hitAt(baselineOrder, fixture.expected, 3),
      rankedTop1: hitAt(rankedOrder, fixture.expected, 1),
      rankedTop3: hitAt(rankedOrder, fixture.expected, 3),
      rankedOrder: rankedOrder.slice(0, 5),
      baselineOrder: baselineOrder.slice(0, 5),
      elapsedMs,
    };
  });

  const baselineTop1 = rate(results, "baselineTop1");
  const baselineTop3 = rate(results, "baselineTop3");
  const rankedTop1 = rate(results, "rankedTop1");
  const rankedTop3 = rate(results, "rankedTop3");
  const p95 = percentile(
    results.map((item) => item.elapsedMs),
    95,
  );

  for (const item of results) {
    const mark = item.rankedTop1 ? "OK " : item.rankedTop3 ? "T3 " : "MISS";
    console.log(
      `${mark} ${item.id}: expected ${item.expected}; ranked [${item.rankedOrder.join(", ")}] (was [${item.baselineOrder.join(", ")}])`,
    );
  }

  console.log("");
  console.log(
    `Top-1  baseline ${(baselineTop1 * 100).toFixed(0)}% → ranked ${(rankedTop1 * 100).toFixed(0)}%  (gate ≥ 60% and > baseline)`,
  );
  console.log(
    `Top-3  baseline ${(baselineTop3 * 100).toFixed(0)}% → ranked ${(rankedTop3 * 100).toFixed(0)}%  (gate ≥ 85% and > baseline)`,
  );
  console.log(`p95 ranker ${p95.toFixed(2)}ms  (gate < 50ms)`);

  const failed =
    rankedTop1 < 0.6 ||
    rankedTop3 < 0.85 ||
    rankedTop1 <= baselineTop1 ||
    rankedTop3 <= baselineTop3 ||
    p95 >= 50;

  if (failed) {
    console.error("Eval gate failed.");
    process.exit(1);
  }
  console.log("Eval gate passed.");
}

main();

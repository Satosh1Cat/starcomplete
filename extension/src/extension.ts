import { extractFeatures, priorCandidates, rank, type Candidate } from "@starcomplete/ranker";
import * as vscode from "vscode";

const LANGUAGES = ["typescript", "javascript", "typescriptreact", "javascriptreact"];
const LATENCY_BUDGET_MS = 50;

let fetching = false;

export function activate(context: vscode.ExtensionContext): void {
  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  status.text = "★ StarComplete";
  status.tooltip = "StarComplete is on. Type console. then Control+Space.";
  status.show();

  context.subscriptions.push(
    status,
    vscode.languages.registerCompletionItemProvider(LANGUAGES, { provideCompletionItems }, "."),
    vscode.commands.registerCommand("starcomplete.showContext", showContext),
  );
}

export function deactivate(): void {
  fetching = false;
}

async function provideCompletionItems(
  document: vscode.TextDocument,
  position: vscode.Position,
): Promise<vscode.CompletionItem[] | undefined> {
  if (fetching) {
    return undefined;
  }

  fetching = true;
  let list: vscode.CompletionList | undefined;
  try {
    list = await vscode.commands.executeCommand<vscode.CompletionList>(
      "vscode.executeCompletionItemProvider",
      document.uri,
      position,
    );
  } catch {
    list = undefined;
  } finally {
    fetching = false;
  }

  const raw = list?.items ?? [];
  const started = Date.now();
  const features = extractFeatures({
    languageId: document.languageId,
    fileText: document.getText(),
    cursorOffset: document.offsetAt(position),
  });
  const merged = mergeCandidates(raw.map(toCandidate), priorCandidates(features.receiver));
  if (merged.length === 0) {
    return undefined;
  }
  const ranked = rank(merged, features);
  const elapsed = Date.now() - started;
  if (elapsed > LATENCY_BUDGET_MS) {
    console.warn(`StarComplete ranker ${elapsed}ms (budget ${LATENCY_BUDGET_MS}ms)`);
  }

  return ranked
    .filter((item) => item.starred)
    .slice(0, 3)
    .map((item, index) => toStarredItem(item.label, item.kind, item.reasons, index, raw));
}

function mergeCandidates(fromTs: Candidate[], fromPriors: Candidate[]): Candidate[] {
  const merged = [...fromTs];
  const seen = new Set(fromTs.map((item) => item.label));
  for (const item of fromPriors) {
    if (!seen.has(item.label)) {
      merged.push(item);
      seen.add(item.label);
    }
  }
  return merged;
}

function toCandidate(item: vscode.CompletionItem): Candidate {
  const label = typeof item.label === "string" ? item.label : item.label.label;
  const kind = item.kind === undefined ? undefined : vscode.CompletionItemKind[item.kind];
  return { label, kind };
}

function toStarredItem(
  label: string,
  kindName: string | undefined,
  reasons: string[],
  index: number,
  raw: readonly vscode.CompletionItem[],
): vscode.CompletionItem {
  const kind = kindFromName(kindName) ?? inferKind(label, raw);
  const item = new vscode.CompletionItem({ label: `★ ${label}`, description: "StarComplete" }, kind);
  item.sortText = `0${index}_${label}`;
  item.filterText = label;
  item.detail = reasons.length > 0 ? reasons.join(" · ") : "StarComplete";
  item.insertText = label;
  item.preselect = index === 0;
  return item;
}

function kindFromName(kindName: string | undefined): vscode.CompletionItemKind | undefined {
  if (!kindName) {
    return undefined;
  }
  const value = (vscode.CompletionItemKind as unknown as Record<string, vscode.CompletionItemKind>)[kindName];
  return typeof value === "number" ? value : undefined;
}

function inferKind(label: string, raw: readonly vscode.CompletionItem[]): vscode.CompletionItemKind {
  const found = raw.find((item) => {
    const name = typeof item.label === "string" ? item.label : item.label.label;
    return name === label;
  });
  return found?.kind ?? vscode.CompletionItemKind.Method;
}

async function showContext(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    await vscode.window.showInformationMessage("StarComplete: open a TypeScript file first.");
    return;
  }
  const features = extractFeatures({
    languageId: editor.document.languageId,
    fileText: editor.document.getText(),
    cursorOffset: editor.document.offsetAt(editor.selection.active),
  });
  const summary = [
    `receiver: ${features.receiver ?? "(none)"}`,
    `prefix: ${features.prefix || "(none)"}`,
    `function: ${features.currentFunction ?? "(none)"}`,
    `imports: ${features.imports.slice(0, 8).join(", ") || "(none)"}`,
  ].join("\n");
  await vscode.window.showInformationMessage(summary);
}

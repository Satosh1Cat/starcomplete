import type { CompletionContext, Features } from "./types";

const KEYWORDS = new Set([
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "let",
  "new",
  "null",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "undefined",
  "var",
  "void",
  "while",
  "with",
  "yield",
  "async",
  "await",
  "from",
  "of",
  "as",
  "type",
  "interface",
]);

export function extractFeatures(ctx: CompletionContext): Features {
  const { fileText, languageId } = ctx;
  const cursorOffset = clamp(ctx.cursorOffset, 0, fileText.length);
  const lineStart = fileText.lastIndexOf("\n", cursorOffset - 1) + 1;
  const linePrefix = fileText.slice(lineStart, cursorOffset);
  const member = linePrefix.match(/([A-Za-z_$][\w$]*)\s*\.\s*([A-Za-z_$][\w$]*)?$/);
  const receiver = member ? member[1] : null;
  const typedMember = member ? member[2] ?? "" : bareIdentifier(linePrefix);

  return {
    languageId,
    prefix: typedMember,
    receiver,
    typedMember,
    imports: extractImports(fileText),
    identifierCounts: countIdentifiers(fileText),
    currentFunction: extractCurrentFunction(fileText, cursorOffset),
    linePrefix,
  };
}

export function extractImports(text: string): string[] {
  const names = new Set<string>();
  for (const match of text.matchAll(/import\s+(?:type\s+)?([\s\S]*?)\s+from\s+['"][^'"]+['"]/g)) {
    parseImportClause(match[1], names);
  }
  for (const match of text.matchAll(/(?:const|let|var)\s+\{([^}]+)\}\s*=\s*require\s*\(/g)) {
    splitImportedNames(match[1], names);
  }
  for (const match of text.matchAll(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*require\s*\(/g)) {
    names.add(match[1]);
  }
  return [...names];
}

function parseImportClause(clause: string, names: Set<string>): void {
  const trimmed = clause.trim();
  const defaultAndNamed = trimmed.match(/^([A-Za-z_$][\w$]*)\s*,\s*\{([^}]+)\}$/);
  if (defaultAndNamed) {
    names.add(defaultAndNamed[1]);
    splitImportedNames(defaultAndNamed[2], names);
    return;
  }
  const named = trimmed.match(/^\{([^}]+)\}$/);
  if (named) {
    splitImportedNames(named[1], names);
    return;
  }
  const namespace = trimmed.match(/^\*\s+as\s+([A-Za-z_$][\w$]*)$/);
  if (namespace) {
    names.add(namespace[1]);
    return;
  }
  if (/^[A-Za-z_$][\w$]*$/.test(trimmed)) {
    names.add(trimmed);
  }
}

function splitImportedNames(inner: string, names: Set<string>): void {
  for (const part of inner.split(",")) {
    const bit = part.trim();
    if (!bit) {
      continue;
    }
    const aliased = bit.match(/^(?:type\s+)?([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/);
    if (aliased) {
      names.add(aliased[2] ?? aliased[1]);
    }
  }
}

function countIdentifiers(text: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const match of text.matchAll(/[A-Za-z_$][\w$]*/g)) {
    const name = match[0];
    if (KEYWORDS.has(name)) {
      continue;
    }
    counts[name] = (counts[name] ?? 0) + 1;
  }
  return counts;
}

function extractCurrentFunction(text: string, offset: number): string | null {
  const before = text.slice(0, offset);
  const matches = [
    ...before.matchAll(
      /(?:function\s+([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:function\b|\())/g,
    ),
  ];
  const last = matches.at(-1);
  if (!last) {
    return null;
  }
  return last[1] ?? last[2] ?? null;
}

function bareIdentifier(linePrefix: string): string {
  const match = linePrefix.match(/([A-Za-z_$][\w$]*)$/);
  return match ? match[1] : "";
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

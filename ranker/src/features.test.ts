import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extractFeatures, extractImports } from "./features";

describe("extractImports", () => {
  it("reads named, default, and namespace imports", () => {
    const text = `
      import fs from "fs";
      import { readFile, writeFile as wf } from "fs/promises";
      import * as path from "path";
    `;
    const names = extractImports(text);
    assert.deepEqual(new Set(names), new Set(["fs", "readFile", "wf", "path"]));
  });
});

describe("extractFeatures", () => {
  it("finds receiver and typed member on the current line", () => {
    const fileText = "const items = [1];\nitems.fil";
    const features = extractFeatures({
      languageId: "typescript",
      fileText,
      cursorOffset: fileText.length,
    });
    assert.equal(features.receiver, "items");
    assert.equal(features.typedMember, "fil");
    assert.equal(features.currentFunction, null);
  });

  it("records the enclosing function name", () => {
    const fileText = "function handle() {\n  console.\n}";
    const cursorOffset = fileText.indexOf("console.") + "console.".length;
    const features = extractFeatures({
      languageId: "typescript",
      fileText,
      cursorOffset,
    });
    assert.equal(features.receiver, "console");
    assert.equal(features.currentFunction, "handle");
  });
});

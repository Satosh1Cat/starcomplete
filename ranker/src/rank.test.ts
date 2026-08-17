import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extractFeatures } from "./features";
import { rank } from "./rank";

describe("rank", () => {
  it("stars console.log over alphabetical assert", () => {
    const fileText = "console.";
    const features = extractFeatures({
      languageId: "typescript",
      fileText,
      cursorOffset: fileText.length,
    });
    const ranked = rank(
      [{ label: "assert" }, { label: "clear" }, { label: "log" }, { label: "error" }],
      features,
    );
    assert.equal(ranked[0]?.label, "log");
    assert.equal(ranked[0]?.starred, true);
  });

  it("boosts an imported symbol on the same receiver", () => {
    const fileText = `import { readFile, writeFile } from "fs";\nfs.`;
    const features = extractFeatures({
      languageId: "typescript",
      fileText,
      cursorOffset: fileText.length,
    });
    const ranked = rank(
      [{ label: "access" }, { label: "chmod" }, { label: "readFile" }, { label: "unlink" }],
      features,
    );
    assert.equal(ranked[0]?.label, "readFile");
    assert.ok(ranked[0]?.reasons.includes("imported"));
  });
});

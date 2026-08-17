import { readFile, writeFile } from "fs/promises";
import path from "path";

const items = [1, 2, 3];
const app = {
  use() {},
  get() {},
  post() {},
  listen() {},
};

export async function demo() {
  // Put the cursor after each dot and trigger completions (Ctrl+Space).
  console.
  JSON.
  items.
  app.
  await readFile(path.join(".", "x"));
  await writeFile("y", "ok");
}

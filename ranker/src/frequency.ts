/** Public priors. Not a trained model. Receiver keys are matched case-insensitively. */
export const RECEIVER_PRIORS: Record<string, Record<string, number>> = {
  console: { log: 10, error: 7, warn: 5, debug: 4, info: 3, table: 2, time: 2, assert: 1 },
  json: { parse: 9, stringify: 9 },
  math: { max: 6, min: 6, floor: 5, ceil: 4, round: 4, random: 5, abs: 4 },
  object: { keys: 8, values: 6, entries: 5, assign: 4, fromEntries: 3 },
  promise: { all: 6, resolve: 5, reject: 4, race: 3, allSettled: 3 },
  fs: { readFile: 8, writeFile: 7, readFileSync: 4, writeFileSync: 4, promises: 5, existsSync: 3 },
  path: { join: 9, resolve: 6, dirname: 5, basename: 4, extname: 3 },
  app: { use: 9, get: 8, post: 7, listen: 6, put: 4, delete: 4 },
  res: { json: 9, status: 8, send: 7, end: 3 },
  req: { body: 8, params: 7, query: 7, headers: 4 },
  document: { getElementById: 9, querySelector: 8, querySelectorAll: 6, createElement: 7 },
  process: { env: 9, cwd: 4, exit: 4, argv: 3 },
};

export const ARRAY_PRIORS: Record<string, number> = {
  map: 10,
  filter: 9,
  forEach: 8,
  find: 8,
  reduce: 7,
  includes: 6,
  push: 6,
  length: 5,
  slice: 5,
  some: 5,
  every: 4,
  findIndex: 4,
  flatMap: 4,
  sort: 3,
  join: 3,
  concat: 2,
};

export const PROMISE_INSTANCE_PRIORS: Record<string, number> = {
  then: 9,
  catch: 7,
  finally: 5,
};

const ARRAY_RECEIVER = /^(arr|array|items|itemList|list|results|rows|ids|values|elements|nodes|xs|ys)$/i;
const PROMISE_RECEIVER = /^(p|promise|pending|ready)$/i;

export function priorCandidates(receiver: string | null): { label: string; kind: string }[] {
  if (!receiver) {
    return [];
  }
  const key = receiver.toLowerCase();
  const table = RECEIVER_PRIORS[key]
    ?? (ARRAY_RECEIVER.test(receiver) ? ARRAY_PRIORS : undefined)
    ?? (PROMISE_RECEIVER.test(receiver) ? PROMISE_INSTANCE_PRIORS : undefined);
  if (!table) {
    return [];
  }
  return Object.entries(table)
    .sort((a, b) => b[1] - a[1])
    .map(([label]) => ({ label, kind: "Method" }));
}

export function priorFor(receiver: string | null, label: string): number {
  if (!receiver) {
    return 0;
  }
  const key = receiver.toLowerCase();
  const table = RECEIVER_PRIORS[key];
  if (table && table[label] !== undefined) {
    return table[label];
  }
  if (ARRAY_RECEIVER.test(receiver) && ARRAY_PRIORS[label] !== undefined) {
    return ARRAY_PRIORS[label];
  }
  if (PROMISE_RECEIVER.test(receiver) && PROMISE_INSTANCE_PRIORS[label] !== undefined) {
    return PROMISE_INSTANCE_PRIORS[label];
  }
  return 0;
}

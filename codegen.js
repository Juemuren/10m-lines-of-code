#!/usr/bin/env node

import { createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { pipe, range } from "./utils.js";

const BEGIN = "/* CODEGEN-BEGIN */";
const END = "/* CODEGEN-END */";
const INPUT = "input.js";
const OUTPUT = "output.js";

const [
  max = 10000,
  batchSize = 4096,
] = process.argv.slice(2).map(Number);

const renderCase = (n) =>
  `case ${n}n: return ${n % 2 === 0};\n`;

const renderBatch = (start) => Array.from(
  { length: Math.min(batchSize, max - start + 1) },
  (_, offset) => renderCase(start + offset)
).join("");

function* generate([before, after]) {
  yield `${before}${BEGIN}\n`;
  yield* range(0, max, batchSize).map(renderBatch);
  yield `${END}${after}`;
}

const codegen = pipe(
  (source) => [source.split(BEGIN)[0], source.split(END)[1]],
  generate,
);

const source = await readFile(INPUT, "utf8");
await pipeline(
  Readable.from(codegen(source)),
  createWriteStream(OUTPUT)
);

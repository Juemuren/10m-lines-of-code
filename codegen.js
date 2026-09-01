#!/usr/bin/env node

import { createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { pipe, range } from "./utils.js";

const BEGIN = "/* CODEGEN-BEGIN */";
const END = "/* CODEGEN-END */";

const [
  limit = 10000,
  input = "input.js",
  output = "output.js"
] = process.argv.slice(2);
const max = Number(limit);

const renderCase = (n) =>
  `case ${n}n: return ${n % 2 === 0};\n`;

function* generate([before, after]) {
  yield `${before}${BEGIN}\n`;
  yield* range(0, max).map(renderCase);
  yield `${END}${after}`;
}

const codegen = pipe(
  (source) => [source.split(BEGIN)[0], source.split(END)[1]],
  generate,
);

const source = await readFile(input, "utf8");
await pipeline(
  Readable.from(codegen(source)),
  createWriteStream(output)
);

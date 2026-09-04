#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { pipe, range } from "./utils.js";

const BEGIN = "/* CODEGEN-BEGIN */";
const END = "/* CODEGEN-END */";
const INPUT = "input.js";
const OUTPUT = "output.js";

const [
  max = 10000000,
  batchSize = 4096,
] = process.argv.slice(2).map(Number);

const source = await readFile(INPUT, "utf8");

const codegen = pipe(
  splitSource(BEGIN, END),
  generate(max, batchSize, BEGIN, END),
);

await writeFile(OUTPUT, codegen(source));

function splitSource(begin, end) {
  return source => ({
    before: source.split(begin)[0],
    after: source.split(end)[1],
  });
};

function generate(max, batchSize, begin, end) {
  return function* ({ before, after }) {
    yield `${before}${begin}\n`;
    yield* range(0, max, batchSize).map(renderBatch(max, batchSize));
    yield `${end}${after}`;
  };
};

function renderBatch(max, batchSize) {
  return start => Array.from(
    { length: Math.min(batchSize, max - start + 1) },
    (_, offset) => renderCase(start + offset)
  ).join("");
};

function renderCase(n) {
  return `case ${n}n: return ${n % 2 === 0};\n`;
};

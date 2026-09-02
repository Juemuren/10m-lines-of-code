#!/usr/bin/env node

import { spawn } from "node:child_process";
import { once } from "node:events";
import { performance } from "node:perf_hooks";
import { createInterface } from "node:readline";
import { pipe } from "./utils.js";

const benchmarks = [
  {
    args: ["output.js"],
    inputs: ["10000000", "9999999", "0", "9999998"],
  },
  {
    args: ["--no-lazy", "output.js"],
    inputs: ["10000000", "9999999", "0", "9999998"],
  },
  {
    args: ["input.js"],
    inputs: ["10", "9", "0", "8"],
  },
];

const measureBenchmark = async ({ args, inputs }) => {
  const started = performance.now();
  const child = spawn(process.execPath, args, {
    stdio: ["pipe", "pipe", "inherit"],
  });
  const readline = createInterface({ input: child.stdout });

  await once(readline, "line");
  const startup = performance.now() - started;

  const measureReply = async (input) => {
    const sentAt = performance.now();

    child.stdin.write(`${input}\n`);
    await once(readline, "line");

    return performance.now() - sentAt;
  };

  const replies = await Array.fromAsync(
    inputs,
    measureReply,
  );

  child.stdin.end();
  await once(child, "close");

  return {
    command: ["node", ...args].join(" "),
    startup,
    replies,
  };
};

const measureBenchmarks = (benchmarks) => Array.fromAsync(
  benchmarks,
  measureBenchmark,
);

const formatTime = (ms) => ms >= 1000
  ? `${(ms / 1000).toFixed(2)} s`
  : `${ms.toFixed(2)} ms`;

const formatResult = ({ command, startup, replies }) => ({
  command,
  startup: formatTime(startup),
  replies: replies.map(formatTime),
});

const toTableRow = ({ command, startup, replies }) => ({
  "运行命令": command,
  "启动": startup,
  ...Object.fromEntries(replies.map((time, index) => [
    `第 ${index + 1} 次回复`,
    time,
  ])),
});

const toTable = pipe(
  (measurements) => measurements.map(formatResult),
  (results) => results.map(toTableRow),
);

const measurements = await measureBenchmarks(benchmarks);

console.table(toTable(measurements));

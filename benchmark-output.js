import { spawn } from "node:child_process";
import { once } from "node:events";
import { performance } from "node:perf_hooks";
import { createInterface } from "node:readline";

const benchmarks = [
  {
    command: "node output.js",
    args: ["output.js"],
    inputs: ["10000000", "9999999", "0", "9999998"],
  },
  {
    command: "node --no-lazy output.js",
    args: ["--no-lazy", "output.js"],
    inputs: ["10000000", "9999999", "0", "9999998"],
  },
  {
    command: "node input.js",
    args: ["input.js"],
    inputs: ["10", "9", "0", "8"],
  },
];

const run = async ({ args, inputs }) => {
  const started = performance.now();
  const child = spawn(process.execPath, args, {
    stdio: ["pipe", "pipe", "inherit"],
  });
  const lines = createInterface({ input: child.stdout });

  await once(lines, "line");
  const startup = performance.now() - started;

  const measureReply = async (input) => {
    const sentAt = performance.now();

    child.stdin.write(`${input}\n`);
    await once(lines, "line");

    return performance.now() - sentAt;
  };

  const replies = await Array.fromAsync(
    inputs.values().map(measureReply)
  );

  child.stdin.end();
  await once(child, "close");

  return { startup, replies };
};

const format = (ms) => ms >= 1000
  ? `${(ms / 1000).toFixed(2)} s`
  : `${ms.toFixed(2)} ms`;

const toResult = async (benchmark) => {
  const { startup, replies } = await run(benchmark);
  return {
    "运行命令": benchmark.command,
    "启动": format(startup),
    ...Object.fromEntries(replies.map((time, index) => [
      `第 ${index + 1} 次回复`,
      format(time),
    ])),
  };
};

const results = await Array.fromAsync(
  benchmarks.values().map(toResult)
);

console.table(results);

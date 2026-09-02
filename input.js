#!/usr/bin/env node

import { createInterface } from "node:readline";
import { pipe } from "./utils.js";

console.log("奇偶数判断");

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

readline.on("line", (input) => {
  console.log(processInput(input));
  readline.prompt();
});

readline.prompt();

const parseInteger = (s) =>
  /^\d+$/.test(s)
    ? BigInt(s)
    : null;

const checkParity = (n) => {
  if (n === null) return "请输入整数";

  switch (isEven(n)) {
    case true: return "是偶数";
    case false: return "不是偶数";
    default: return "超出范围";
  }
};

const processInput = pipe(
  (s) => s.trim(),
  parseInteger,
  checkParity
);

const isEven = (n) => {
  switch (n) {
/* CODEGEN-BEGIN */
case 0n: return true;
case 1n: return false;
case 2n: return true;
case 3n: return false;
case 4n: return true;
case 5n: return false;
case 6n: return true;
case 7n: return false;
case 8n: return true;
case 9n: return false;
case 10n: return true;
/* CODEGEN-END */
default: return null;
  }
};

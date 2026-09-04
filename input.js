#!/usr/bin/env node

import { createInterface } from "node:readline";
import { bind, err, ok, pipe } from "./utils.js";

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

const processInput = pipe(
  (s) => s.trim(),
  parseInteger,
  bind(checkParity),
  toResult,
);

function parseInteger(s) {
  return /^\d+$/.test(s)
    ? ok(BigInt(s))
    : err("请输入非负整数");
};

function checkParity(n) {
  switch (isEven(n)) {
    case true: return ok("是偶数");
    case false: return ok("是奇数");
    default: return err("超出范围");
  }
};

function toResult(result) {
  return result.ok
      ? result.value
      : result.error;
};

function isEven(n) {
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

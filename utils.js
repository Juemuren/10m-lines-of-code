export function pipe(...fns) {
  return (value) => fns.reduce((value, fn) => fn(value), value);
}

export function* range(min, max) {
  for (let n = min; n <= max; n++) yield n;
}
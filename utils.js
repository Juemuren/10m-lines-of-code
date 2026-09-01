export function pipe(...fns) {
  return (value) => fns.reduce((value, fn) => fn(value), value);
}

export function* range(min, max, step = 1) {
  for (let n = min; n <= max; n += step) yield n;
}

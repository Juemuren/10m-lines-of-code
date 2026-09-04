export function pipe(...fns) {
  return (value) =>
    fns.reduce(
      (value, fn) => fn(value),
      value
    );
}

export function* range(min, max, step = 1) {
  for (let n = min; n <= max; n += step) yield n;
}

export function ok(value) {
  return {
    ok: true,
    value
  };
} 

export function err(error) {
  return {
    ok: false,
    error
  };
};

export function bind(fn) {
  return result =>
    result.ok
      ? fn(result.value)
      : result;
};

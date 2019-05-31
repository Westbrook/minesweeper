const valueSymbol = Symbol('value');

export function memoize(cb) {
  const memos = new Map();
  return (...args) => {
    let memo = memos;
    let i = 0;
    const ct = args.length;
    while (memo.has(args[i]) && i < ct - 1) {
      memo = memo.get(args[i]);
      i += 1;
    }
    if (i === ct - 1 && memo.has(valueSymbol)) {
      memo = memo.get(valueSymbol);
    } else {
      while (i < ct) {
        memo.set(args[i], new Map());
        memo = memo.get(args[i]);
        i += 1;
      }
      memo.set(valueSymbol, cb(...args));
      memo = memo.get(valueSymbol);
    }
    return memo;
  };
}

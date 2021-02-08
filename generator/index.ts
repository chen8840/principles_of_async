function* gen() {
  yield 'g';
}
var g = gen();
console.log(g.next()); // {value: 'g', done: false}
g.next(); // {value: undefined, done: true}
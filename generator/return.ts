function* gen() {
  yield 'g1';
  yield 'g2';
  return 'a';
}
var g = gen();
g.next();
g.return('return');
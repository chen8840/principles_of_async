function* gen() {
  console.log('b1');
  yield 'g1';
  console.log('b2');
  yield 'g2';
  console.log('b3');
  yield 'g3';
  console.log('b4');
  return 'g4';
}

var g = gen();
var next = g.next();
while(!next.done) {
  console.log(next);
  next = g.next();
}
console.log(next);
function* gen() {
  var a = yield 'g';
  console.log(a);
}
var g = gen();
g.next();
g.next('a'); // 'a'
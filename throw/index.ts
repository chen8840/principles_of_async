function* gen() {
  try {
    yield 'a';
  } catch(err) {
    console.log('内部捕获', err);
  }

  var b = yield 'b';
  console.log(b);
}

var g = gen();
g.next();
g.throw('err');
console.log(g.next());
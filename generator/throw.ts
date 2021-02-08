function* gen() {
  try {
    yield 'g1';
    // throw new Error('err');
  } catch(err) {
    console.log('内部捕获', err);
  }
}

var g = gen();
g.next();
// g.next();
g.throw('err');
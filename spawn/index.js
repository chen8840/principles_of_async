function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch(e) {
        return reject(e);
      }
      if(next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    step(function() { return gen.next(undefined); });
  });
}

function asyncTest() {
  return spawn(function* () {
    const hello = yield new Promise((resolve) => {
      setTimeout(() => {
        resolve('hello i am async');
      }, 1000);
    });
    console.log(hello);

    // catchError
    try {
      yield new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            aa
          } catch(err) {
            reject(err);
          }
        }, 2000);
      });
    } catch(err) {
      console.error('error', err);
    }
  });
}

var interval = setInterval(() => {
  console.log('tick');
}, 200);
asyncTest().then(() => clearInterval(interval));
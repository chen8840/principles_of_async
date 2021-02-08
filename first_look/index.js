async function asyncTest () {
  const hello = await new Promise((resolve) => {
    setTimeout(() => {
      resolve('hello i am async');
    }, 1000);
  });
  console.log(hello);

  // catchError
  try {
    await new Promise((resolve, reject) => {
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
}

var interval = setInterval(() => {
  console.log('tick');
}, 200);
asyncTest().then(() => clearInterval(interval));

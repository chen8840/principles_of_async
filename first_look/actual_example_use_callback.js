function putElephantIntoRefrigerator(cb) {
  openRefrigeratorDoor(() => {
    putElephantIn(() => {
      closeRefrigeratorDoor(() => {
        cb();
      });
    });
  });
}

function openRefrigeratorDoor(cb) {
  // ...
  cb();
}

function putElephantIn(cb) {
  // ...
  cb();
}

function closeRefrigeratorDoor(cb) {
 // ...
 cb();
}

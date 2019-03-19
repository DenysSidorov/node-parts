const promise = new Promise(function(resolve, reject) {

  setTimeout(function() {
    resolve("OK");
  }, 1000);

  setTimeout(function() {
    reject(new Error("WOPS!"));
  }, 2000);

});


promise.then(function(result) {
  console.log("Result", result);
}, function(err) {
  console.log("Caught", err);
});

const promise = new Promise( function(resolve, reject) {
  setTimeout(function() {
    // reject()!
    throw new Error("WOPS");
  }, 1);
});


promise.then( function(result) {
  console.log("Result", result);
},  function(err) {
  console.log("Caught", err);
});

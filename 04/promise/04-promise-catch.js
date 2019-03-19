new Promise( function(resolve, reject) {

}).then( function(result) {

}).catch( function(err) {

});

// vs

new Promise( function(resolve, reject) {
  
}).then(
   function(result) { },
   function(err) { /* ... */ }
);

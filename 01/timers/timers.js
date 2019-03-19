const fs = require('fs');

// tasks queue        [request1, request2, request3]
// 0.365ms, 0.730ms, 1095ms
// microtasks queue   []

console.time('loop');
let a = 0;
for (let i = 0; i < 10000; i++) {
  a++;
}
console.timeEnd('loop');

// console.log('start'); // 1
// const a = 1;
// fs.readFile(__filename, (err, content) => {
//   console.log(a);
//   console.log('read file'); // 7
// });
//
// setImmediate(() => {
//   console.log(a);
//   console.log('immediate'); // 6
// });
//
// new Promise(resolve => {
//   console.log('promise create'); // 2
//   resolve('promise then');
// }).then(value => console.log(value)); // 5
//
// process.nextTick(() => {
//   console.log('nextTick1'); // 4
// });
//
// console.log('end'); // 3

// V8 + libuv

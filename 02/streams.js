const fs = require('fs');

const stream = fs.createReadStream('adsfasdf', {
  highWaterMark: 40,
  encoding: 'utf-8'
});

// Readable, Writable, Duplex, Transform

// paused | flowing
// stream.pipe(streamOut)
// stream.on('data', chunk => {})
// stream.resume() | stream.pause()

// let i = 0;
// stream.on('data', chunk => {
//   i++;
//   if (i > 3) {
//     stream.removeAllListeners('data');
//     stream.destroy();
//   }
//   console.log(chunk);
// });
//
// stream.on('error', err => {
//   console.log('error');
// });
//
// stream.on('end', () => {
//   console.log(i);
//   console.log('end');
// });
//
// stream.on('close', () => {
//   console.log('close');
// });

// ------
// stream.on('readable', () => {
// });

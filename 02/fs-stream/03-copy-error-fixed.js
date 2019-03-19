const fs = require('fs');
const zlib = require('zlib');
const stream = require('stream');

const fileIn = fs.createReadStream(__filename, {highWaterMark: 100});
const gzip = zlib.createGzip();
const fileOut = fs.createWriteStream(__filename + ".gz");

stream.pipeline(
  fileIn,
  gzip,
  fileOut,
  err => {
    if (err) cleanup();
    else console.log('finished');
  }
);

// fileIn
//   .on('error', cleanup)
//   .pipe(gzip)
//   .on('error', cleanup)
//   .pipe(fileOut)
//   .on('error', cleanup);

// fileIn.on('error', cleanup);
// fileOut.on('error', cleanup);
// gzip.on('error', cleanup);

function cleanup() {
  fs.unlink(fileOut.path, err => { // eslint-disable-line
    if (err && err.code == 'ENOENT') {
      /* it's ok if no such file, ignore the error */
    } else if (err) {
      throw err;
    }
  });

  // close both files (otherwise won't be closed! no close event!)
  fileIn.destroy();
  fileOut.destroy();
}

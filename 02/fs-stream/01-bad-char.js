const fs = require('fs');

const fileStream = fs.createReadStream('bad-char.txt', {
  highWaterMark: 9, // читать по 9 байт для наглядности
  // encoding: 'utf8'
});

let content = '';

fileStream.on('data', data => {
  content += data;
});

fileStream.on('end', () => {
  console.log(content);
});

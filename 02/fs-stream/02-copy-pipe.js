// Копирование файлов
// Проблема - какая? Зачем pipe?
const fs = require('fs');

function handler(req, res) {
  const fileIn = fs.createReadStream(__filename, {highWaterMark: 100});
  // const fileOut = fs.createWriteStream(__filename + ".out", {highWaterMark: 100});

  // fileIn.on('data', data => {
  //   console.log(res.write(data));
  // });
  //
  // fileIn.on('end', () => {
  //   res.end();
  // });

  fileIn.pipe(res);

}

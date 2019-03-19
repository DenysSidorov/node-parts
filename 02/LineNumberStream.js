const stream = require('stream');
const fs = require('fs');
const os = require('os');

class LineNumberStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.isFileBegins = true;
    this.line = 1;
  }

  _transform(chunk, encoding, callback) {
    let str = chunk.toString('utf-8');

    if (this.isFileBegins) {
      str = `${this.line++}. ${str}`;
      this.isFileBegins = false;
    }

    let pieces = str.split(os.EOL);

    if (pieces.length === 0) {
      return callback(null, Buffer.from(str));
    }

    let newStr = pieces.reduce((_newStr, piece, i) => {
      if (i === 0)
        _newStr = piece;
      else
        _newStr = `${_newStr}${os.EOL}${this.line++}. ${piece}`;

      return _newStr;
    }, '');

    callback(null, Buffer.from(newStr));
  }
}

const s = fs.createReadStream(__filename, {
  highWaterMark: 10
});
const o = fs.createWriteStream(`${__filename}.out`);

s
  .pipe(new LineNumberStream())
  .pipe(o);

/*
Stream that once configured can be included in stream pipeline
and will count amount of bytes processed. Will throw error if
limit will be exceeded.
*/
const stream = require('stream');

module.exports = class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.size = 0;
  }

  _transform(chunk, encoding, callback) {
    this.size += chunk.length;

    if (this.size > this.limit) {
      const error = new Error();
      error.code = 'LIMIT_EXCEEDED';
      callback(error);
    } else {
      callback(null, chunk);
    }
  }
};

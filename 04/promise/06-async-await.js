// const fs = require('fs').promises;
const _fs = require('fs');
const fs = _fs.promises;

async function read(path) {
  const stat = await fs.stat(path);

  if (stat.isDirectory()) {
    const files = await fs.readdir(path);
    return files;
  } else {
    const content = await fs.readFile(path);
    return content;
  }
}

read(__dirname)
  .then(console.log)
  .catch(console.error);

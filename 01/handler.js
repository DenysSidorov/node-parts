let i = 0

const handleRequest = (req, res) => {
  i++;
  res.end(`Hello world. ${i}`)
}

module.exports = handleRequest

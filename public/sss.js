
function hash(str) {
  const crypto = require('crypto');
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}





var a = aws("sss")
var b = aws("sss")

console.log(a,b);
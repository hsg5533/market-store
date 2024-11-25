const sha256 = require("sha256");
module.exports = {
  enc: function (n) {
    return sha256(n);
  },
};

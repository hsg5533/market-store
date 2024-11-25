const mysql = require("mysql2"),
  db_info = {
    host: "localhost",
    port: "3306",
    user: "root",
    password: "1234",
    database: "market",
  };
module.exports = {
  init: function o() {
    let n = mysql.createConnection(db_info);
    return (
      n.connect(function (n) {
        n &&
          (console.log("error when connecting to db:", n), setTimeout(o, 2e3));
      }),
      n.on("error", function (n) {
        if ((console.log("db error", n), "PROTOCOL_CONNECTION_LOST" === n.code))
          o();
        else throw n;
      }),
      n
    );
  },
  connect: function (o) {
    o.connect(function (o) {
      o
        ? console.error("데이터베이스 연결 오류 : " + o)
        : console.log("데이터베이스 연결 완료");
    });
  },
};

const QRCode = require("qrcode"),
  superagent = require("superagent"),
  db = require("./mysql.js"),
  conn = db.init(),
  host = "http://192.168.0.201:5500";
module.exports = {
  qrsave: function (e, o) {
    var n = e.body;
    let t = host + `/?code=${n.code}`;
    QRCode.toDataURL(t, (e, t) => {
      let a = t.replace(/.*,/, "");
      var c = "update link set encode_png=? where code=?";
      console.log("QR코드 저장: " + c);
      var r = [a, n.code];
      conn.query(c, r, function (e) {
        e ? console.log("QR코드 저장 오류: " + e) : o.sendStatus(200);
      });
    });
  },
  qrload: function (e, o) {
    var n = "select encode_png from link where code=?";
    console.log("QR코드 출력: " + n);
    var t = [e.params.code];
    conn.query(n, t, function (n, t) {
      if (n) console.log("QR코드 출력 오류: " + n);
      else if (0 != t.length)
        try {
          let a = new Buffer.from(t[0].encode_png, "base64");
          o.writeHead(200, { "Context-Type": "text/html" }), o.end(a);
        } catch (c) {
          "ERR_INVALID_ARG_TYPE" == c.code
            ? (console.log(e.params.code + "의 QR코드 없음"), o.send())
            : (console.log(e.params.code + "의 Buffer 오류: "),
              console.log(c.code));
        }
      else console.log(e.params.code + "의 QR코드 없음"), o.send();
    });
  },
  qrdown: function (e, o) {
    var n = "select * from link where code=?";
    console.log("QR코드 다운로드: " + n);
    var t = [e.params.code];
    conn.query(n, t, function (n, t) {
      n
        ? console.log("QR코드 다운로드 오류: " + n)
        : 0 != t.length
        ? (o.set(
            "Content-Disposition",
            `attachment; filename=qrcode_${e.params.code}.png`
          ),
          superagent(host + `/qrload/${e.params.code}`).pipe(o))
        : o.sendStatus(400);
    });
  },
};

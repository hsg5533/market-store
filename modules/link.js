const db = require("./mysql.js"),
  conn = db.init();
module.exports = {
  makecode: function (e, n) {
    var o = e.body;
    let r = "",
      t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var c = 0; c < o.num; c++) {
      for (var a = 0; a < 2; a++)
        r +=
          Math.floor(100 * Math.random()) +
          1 +
          t.charAt(Math.floor(Math.random() * t.length));
      var i = "insert into link (code) values (?) ";
      console.log("코드 생성: " + i);
      var l = [r];
      conn.query(i, l, function (e) {
        e && console.log("코드 생성 오류: " + e);
      }),
        (r = "");
    }
    n.sendStatus(200);
  },
  getLink: function (e, n) {
    var o = "select * from link";
    console.log("링크 전체 출력: " + o),
      conn.query(o, function (e, o) {
        e ? console.log("링크 전체 출력 오류: " + e) : n.send(o);
      });
  },
  getLinkActive: function (e, n) {
    var o = e.body,
      r = "select * from link where active=?";
    console.log("링크 출력: " + r);
    var t = [o.status];
    conn.query(r, t, function (e, o) {
      e ? console.log("링크 출력 오류: " + e) : n.send(o);
    });
  },
  linkUpdate: function (e, n) {
    var o = e.body,
      r =
        "update link set store_regnumber=?, storename=?, active='y' where code=?";
    console.log("링크 연결: " + r);
    var t = [o.regnumber, o.storename, o.code];
    conn.query(r, t, function (e) {
      if (e) console.log("링크 연결 오류: " + e);
      else {
        var r = "update store set link_code=? where regnumber=?";
        console.log("가맹점 링크 연결: " + r);
        var t = [o.code, o.regnumber];
        conn.query(r, t, function (e) {
          e ? console.log("가맹점 링크 연결 오류: " + e) : n.sendStatus(200);
        });
      }
    });
  },
};

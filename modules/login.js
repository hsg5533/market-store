const db = require("./mysql.js"),
  conn = db.init();
module.exports = {
  adminLogin: function (e, n) {
    var r = e.body,
      o = "select * from admin where id=?";
    console.log("관리자 아이디 조회: " + o);
    var s = [r.id];
    conn.query(o, s, function (e, o) {
      e
        ? console.log("관리자 아이디 조회 오류: " + e)
        : 0 != o.length && o[0].password == r.password
        ? n.sendStatus(200)
        : n.sendStatus(400);
    });
  },
  storeLogin: function (e, n) {
    var r = e.body,
      o = "select * from store_admin where regnumber=?";
    console.log("점주 아이디 조회: " + o);
    var s = [r.regnumber];
    conn.query(o, s, function (e, o) {
      e
        ? console.log("점주 아이디 조회 오류: " + e)
        : 0 != o.length && o[0].password == r.password
        ? n.sendStatus(200)
        : n.sendStatus(400);
    });
  },
  changePassword: function (e, n) {
    var r = e.body,
      o = "update store_admin set password=? where regnumber=?";
    console.log("점주 비밀번호 변경: " + o);
    var s = [r.password, r.regnumber];
    conn.query(o, s, function (e) {
      e ? console.log("점주 비밀번호 변경 오류: " + e) : n.sendStatus(200);
    });
  },
  resetPassword: function (e, n) {
    var r = e.body,
      o =
        "select name,owner,regnumber from store where name=? and owner=? and regnumber=?";
    console.log("점주 데이터 조회: " + o);
    var s = [r.name, r.owner, r.phone];
    conn.query(o, s, function (e, o) {
      if (e) console.log("점주 데이터 조회 오류: " + e);
      else if (0 == o.length) n.sendStatus(400);
      else if (
        o[0].name == r.name &&
        o[0].owner == r.owner &&
        o[0].regnumber == r.phone
      ) {
        var s = "update store_admin set password=? where regnumber=?";
        console.log("점주 비밀번호 초기화: " + s);
        var t = [r.phone.substring(7), r.phone];
        conn.query(s, t, function (e) {
          e
            ? console.log("점주 비밀번호 초기화 오류: " + e)
            : n.sendStatus(200);
        });
      }
    });
  },
};

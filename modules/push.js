const fetch = require("node-fetch"),
  db = require("./mysql.js"),
  conn = db.init(),
  sendPushNotification = async (t, e, n) => {
    let o = await (
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sound: "default", to: t, title: e, body: n }),
      })
    ).json();
    console.log("Push notification sent:", o);
  };
module.exports = {
  getToken: function (t, e) {
    conn.query("select token from token", function (t, n) {
      t ? console.log("토큰 출력 오류: " + t) : e.send(n);
    });
  },
  tokenRegist: function (t, e) {
    var n = t.body,
      o = "select count(*) as count from token where user=?";
    console.log("토큰 조회: " + o);
    var s = [n.user];
    conn.query(o, s, function (t, o) {
      if (t) console.log("토큰 조회 오류: " + t);
      else if (0 == o[0].count) {
        var s = "insert into token (user,token) values (?,?)";
        console.log("토근 등록: " + s);
        var c = [n.user, n.token];
        conn.query(s, c, function (t) {
          t ? console.log("토큰 등록 오류:" + t) : e.sendStatus(200);
        });
      } else {
        var s = "update token set token=? where user=?";
        console.log("토큰 수정: " + s);
        var c = [n.token, n.user];
        conn.query(s, c, function (t) {
          t ? console.log("토큰 수정 오류:" + t) : e.sendStatus(200);
        });
      }
    });
  },
  notification: async function (t, e) {
    try {
      let { token: n, title: o, message: s } = t.body;
      await sendPushNotification(n, o, s), e.status(200).send({ success: !0 });
    } catch (c) {
      console.error(c), e.status(500).send({ success: !1, error: c });
    }
  },
};

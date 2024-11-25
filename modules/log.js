const db = require("./mysql.js"),
  hashing = require("./hashing.js"),
  conn = db.init();
module.exports = {
  visitRegist: function (o, n) {
    var e = o.body,
      t =
        "insert into visit (link_code,storecode,storename,ip,platform,date,year,month,day,week,hour,minute,second) values (?,?,?,?,?,?,year(now()),month(now()),day(now()),week(now()),hour(now()),minute(now()),second(now()))";
    console.log("방문기록 등록: " + t);
    var r = [e.link_code, e.storecode, e.storename, e.ip, e.platform, e.date];
    conn.query(t, r, function (o) {
      o ? console.log("방문기록 등록 오류: " + o) : n.send(hashing.enc(e.ip));
    });
  },
  connectRegist: function (o, n) {
    var e = o.body,
      t =
        "insert into connect (ip,platform,category_code,category_name) values (?,?,?,?)";
    console.log("접속기록 등록: " + t);
    var r = [e.ip, e.platform, e.categorycode, e.categoryname];
    conn.query(t, r, function (o) {
      o ? console.log("접속기록 등록 오류: " + o) : n.sendStatus(200);
    });
  },
  searchRegist: function (o, n) {
    var e = o.body,
      t = "insert into search (ip,platform,word) values (?,?,?)";
    console.log("검색기록 등록: " + t);
    var r = [e.ip, e.platform, e.word];
    conn.query(t, r, function (o) {
      o ? console.log("검색기록 등록 오류: " + o) : n.sendStatus(200);
    });
  },
  getVisit: function (o, n) {
    var e = "select count(*) as count from visit";
    console.log("방문기록 전체 출력: " + e),
      conn.query(e, function (o, e) {
        o ? console.log("방문기록 전체 출력 오류: " + o) : n.send(e[0]);
      });
  },
  getVisitToday: function (o, n) {
    var e = o.body;
    if (null == e.storecode) {
      var t =
        "select count(*) as count from visit where year=year(now()) and month=month(now()) and day=day(now())";
      console.log("오늘 방문기록 출력: " + t),
        conn.query(t, function (o, e) {
          o ? console.log("오늘 방문기록 출력 오류: " + o) : n.send(e[0]);
        });
    } else {
      var t =
        "select count(*) as count from visit where year=year(now()) and month=month(now()) and day=day(now()) and storecode=?";
      console.log("오늘 방문기록 출력: " + t);
      var r = [e.storecode];
      conn.query(t, r, function (o, e) {
        o ? console.log("오늘 방문기록 출력 오류: " + o) : n.send(e[0]);
      });
    }
  },
  getVisitMonth: function (o, n) {
    var e = o.body;
    if (null == e.month) {
      var t =
        "select storecode,year,month,count(*) as count from visit where year=year(now()) and storecode=? group by month";
      console.log("월별 방문기록 출력: " + t);
      var r = [e.storecode];
      conn.query(t, r, function (o, e) {
        o ? console.log("월별 방문기록 출력 오류: " + o) : n.send(e);
      });
    } else {
      var t =
        "select storecode,year,month,count(*) as count from visit where year=year(now()) and storecode=? and month=?";
      console.log("월별 방문기록 출력: " + t);
      var r = [e.storecode, e.month];
      conn.query(t, r, function (o, e) {
        o ? console.log("월별 방문기록 출력 오류: " + o) : n.send(e[0]);
      });
    }
  },
  getVisitHour: function (o, n) {
    var e = o.body,
      t =
        "select count(*) as count from visit where year=year(now()) and month=month(now()) and day=day(now()) and hour=?";
    console.log("시간별 방문기록 출력: " + t);
    var r = [e.hour];
    conn.query(t, r, function (o, e) {
      o ? console.log("시간별 방문기록 출력 오류: " + o) : n.send(e[0]);
    });
  },
  getVisitDate: function (o, n) {
    var e = o.body;
    if (null == e.storecode) {
      var t =
        "select count(*) as count from visit where year=year(now()) and month=month(now()) and week=week(now()) and date=?";
      console.log("요일별 방문기록 출력: " + t);
      var r = [e.date];
      conn.query(t, r, function (o, e) {
        o ? console.log("요일별 방문기록 출력 오류: " + o) : n.send(e[0]);
      });
    } else {
      var t =
        "select count(*) as count from visit where year=year(now()) and date=? and storecode=?";
      console.log("요일별 방문기록 출력: " + t);
      var r = [e.date, e.storecode];
      conn.query(t, r, function (o, e) {
        o ? console.log("요일별 방문기록 출력 오류: " + o) : n.send(e[0]);
      });
    }
  },
  getVisitPlatform: function (o, n) {
    var e = "select platform,count(*) as count from visit group by platform;";
    console.log("플랫폼별 방문기록 출력: " + e),
      conn.query(e, function (o, e) {
        o ? console.log("플랫폼별 방문기록 출력 오류: " + o) : n.send(e);
      });
  },
  getSearch: function (o, n) {
    var e = "select word,count(*) as count from search group by word";
    console.log("검색기록 전체 출력: " + e),
      conn.query(e, function (o, e) {
        o ? console.log("검색기록 전체 출력 오류:" + o) : n.send(e);
      });
  },
};

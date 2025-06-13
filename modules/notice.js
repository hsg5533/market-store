const fs = require("fs-extra"),
  db = require("./mysql.js"),
  conn = db.init();
module.exports = {
  noticeRegist: function (e, n) {
    var t = e.body,
      o = "select count(*)+1 as num from notice order by num desc";
    console.log("공지사힝 번호 생성: " + o),
      conn.query(o, function (o, i) {
        if (o) console.log("공지사항 번호 생성 오류: " + o);
        else {
          var l =
            "insert into notice (num,title,writer,content,link1,link2) values (?,?,?,?,?,?)";
          console.log("공지사항 등록: " + l);
          var u = [i[0].num, t.title, t.writer, t.content, t.link1, t.link2];
          conn.query(l, u, function (t) {
            if (t) console.log("공지사항 등록 오류: " + t);
            else if (null != e.file) {
              console.log("공지사항 이미지 등록: " + l);
              var o = [
                i[0].num,
                e.file.destination,
                e.file.filename,
                e.file.mimetype,
              ];
              conn.query(
                "insert into notice_file (num,savefolder,savefile,file_type) values (?,?,?,?)",
                o,
                function (e) {
                  e
                    ? console.log("공지사항 이미지 등록 오류: " + e)
                    : n.sendStatus(200);
                }
              );
            } else n.sendStatus(200);
          });
        }
      });
  },
  getNotice: function (e, n) {
    var t = "select * from notice order by `key` desc";
    console.log("공지사항 전체 출력: " + t),
      conn.query(t, function (e, t) {
        e ? console.log("공지사항 전체 출력 오류: " + e) : n.send(t);
      });
  },
  getNoticeDetail: function (e, n) {
    var t = e.body,
      o = "select * from notice where num=?";
    console.log("공지사항 상세 출력: " + o);
    var i = [t.num];
    conn.query(o, i, function (e, t) {
      e ? console.log("공지사항 상세 출력 오류: " + e) : n.send(t[0]);
    });
  },
  getNoticeImg: function (e, n) {
    var t = "select * from notice_file where num=" + e.params.num;
    console.log("공지사항 이미지 출력: " + t),
      conn.query(t, function (e, t) {
        e
          ? console.log("공지사항 이미지 출력 오류: " + e)
          : 0 != t.length
          ? fs.readFile("uploads/" + t[0].savefile, function (e, t) {
              n.writeHead(200, { "Context-Type": "text/html" }), n.end(t);
            })
          : n.sendStatus(200);
      });
  },
  hitNotice: function (e, n) {
    var t = e.body,
      o = "update notice set hit=hit+1 where num=?";
    console.log("조회수 증가: " + o);
    var i = [t.num];
    conn.query(o, i, function (e) {
      e ? console.log("조회수 증가 오류" + e) : n.sendStatus(200);
    });
  },
  deleteNotice: function (e, n) {
    var t = e.body,
      o = "delete from notice where num=?";
    console.log("공지사항 삭제: " + o);
    var i = [t.num];
    conn.query(o, i, function (e) {
      e ? console.log("공지사항 삭제 오류: " + e) : n.sendStatus(200);
    });
  },
};

const fs = require("fs"),
  db = require("./mysql.js"),
  conn = db.init();
module.exports = {
  inquiryRegist: function (n, e) {
    var i = n.body,
      t = "select count(*)+1 as num from inquiry";
    console.log("문의사항 번호 생성: " + t),
      conn.query(t, function (t, o) {
        if (t) console.log("문의사항 번호 생성 오류" + t);
        else {
          var r =
            "insert into inquiry (num,title,writer,content) values (?,?,?,?)";
          console.log("문의사항 등록: " + r);
          var u = [o[0].num, i.title, i.writer, i.content];
          conn.query(r, u, function (i) {
            if (i) console.log("문의사항 등록 오류: " + i);
            else if (null != n.file) {
              console.log("문의사항 이미지 등록: " + r);
              var t = [
                o[0].num,
                n.file.destination,
                n.file.filename,
                n.file.mimetype,
              ];
              conn.query(
                "insert into inquiry_file (num,savefolder,savefile,file_type) values (?,?,?,?)",
                t,
                function (n) {
                  n
                    ? console.log("문의사항 이미지 등록 오류: " + n)
                    : e.sendStatus(200);
                }
              );
            } else e.sendStatus(200);
          });
        }
      });
  },
  inquiryReply: function (n, e) {
    var i = n.body,
      t = "insert into inquiry_reply (num,writer,content) values (?,?,?)";
    console.log("문의사항 답변 등록: " + t);
    var o = [i.num, i.writer, i.content];
    conn.query(t, o, function (n) {
      if (n) console.log("문의사항 답변 등록 오류: " + n);
      else {
        var t = "update inquiry set reply='y' where num=?";
        console.log("문의사항 답변 업데이트: " + t);
        var o = [i.num];
        conn.query(t, o, function (n) {
          n
            ? console.log("문의사항 답변 업데이트 오류: " + n)
            : e.sendStatus(200);
        });
      }
    });
  },
  getInquiry: function (n, e) {
    var i = "select * from inquiry order by `key` desc";
    console.log("문의사항 전체 출력: " + i),
      conn.query(i, function (n, i) {
        n ? console.log("문의사항 전체 출력 오류: " + n) : e.send(i);
      });
  },
  getInquiryDetail: function (n, e) {
    var i = n.body,
      t = "select * from inquiry where num=?";
    console.log("문의사항 상세 출력: " + t);
    var o = [i.num];
    conn.query(t, o, function (n, i) {
      n ? console.log("문의사항 상세 출력 오류: " + n) : e.send(i[0]);
    });
  },
  getInquiryImg: function (n, e) {
    var i = "select * from inquiry_file where num=" + n.params.num;
    console.log("문의사항 이미지 출력: " + i),
      conn.query(i, function (n, i) {
        n
          ? console.log("문의사항 이미지 출력 오류: " + n)
          : 0 != i.length
          ? fs.readFile("uploads/" + i[0].savefile, function (n, i) {
              e.writeHead(200, { "Context-Type": "text/html" }), e.end(i);
            })
          : e.sendStatus(200);
      });
  },
  getInquiryReply: function (n, e) {
    var i = n.body,
      t = "select * from inquiry_reply where num=?";
    console.log("문의사항 답변 출력: " + t);
    var o = [i.num];
    conn.query(t, o, function (n, i) {
      n ? console.log("문의사항 답변 출력 오류: " + n) : e.send(i);
    });
  },
  deleteInquiry: function (n, e) {
    var i = n.body,
      t = "delete from inquiry where num=?";
    console.log("문의사항 삭제: " + t);
    var o = [i.num];
    conn.query(t, o, function (n) {
      n ? console.log("문의사항 삭제 오류: " + n) : e.sendStatus(200);
    });
  },
};

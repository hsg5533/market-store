const fs = require("fs"),
  db = require("./mysql.js"),
  conn = db.init();
module.exports = {
  categoryRegist: function (e, o) {
    var t = e.body,
      n = "insert into category (code,name) value (?,?)";
    console.log("품목 등록: " + n);
    var a = [t.code, t.name];
    conn.query(n, a, function (n) {
      if (n) console.log("품목 등록 오류: " + n);
      else if (null != e.file) {
        var a = "update category set image=? where code=?";
        console.log("품목 이미지 등록: " + a);
        var c = [e.file.filename, t.code];
        conn.query(a, c, function (e) {
          e ? console.log("품목 이미지 등록 오류: " + e) : o.sendStatus(200);
        });
      } else o.sendStatus(200);
    });
  },
  categoryUpdate: function (e, o) {
    var t = e.body,
      n = "update category set name=?,regdate=now() where code=?";
    console.log("품목 수정: " + n);
    var a = [t.name, t.code];
    conn.query(n, a, function (n) {
      if (n) console.log("품목 수정 오류: " + n);
      else if (null != e.file) {
        var a = "update category set image=? where code=?";
        console.log("품목 이미지 수정: " + a);
        var c = [e.file.filename, t.code];
        conn.query(a, c, function (e) {
          e ? console.log("품목 이미지 수정 오류: " + e) : o.sendStatus(200);
        });
      } else o.sendStatus(200);
    });
  },
  categoryActive: function (e, o) {
    var t = e.body;
    if (!1 == t.boolean) {
      var n = "update category set active='n' where code=?";
      console.log("품목 비활성화: " + n);
      var a = [t.code];
      conn.query(n, a, function (e) {
        e ? console.log("품목 비활성화 오류: " + e) : o.sendStatus(200);
      });
    } else {
      var n = "update category set active='y' where code=?";
      console.log("품목 활성화: " + n);
      var a = [t.code];
      conn.query(n, a, function (e) {
        e ? console.log("품목 활성화 오류: " + e) : o.sendStatus(200);
      });
    }
  },
  getCategoryImg: function (e, o) {
    var t = "select image from category where code=" + e.params.code;
    console.log("품목 이미지 출력: " + t),
      conn.query(t, function (e, t) {
        e
          ? console.log("품목 이미지 출력 오류: " + e)
          : 0 != t.length
          ? fs.readFile("uploads/" + t[0].image, function (e, t) {
              o.writeHead(200, { "Context-Type": "text/html" }), o.end(t);
            })
          : o.sendStatus(200);
      });
  },
  getCategory: function (e, o) {
    var t = "select * from category";
    console.log("품목 전체 출력: " + t),
      conn.query(t, function (e, t) {
        e ? console.log("품목 전체 출력 오류: " + e) : o.send(t);
      });
  },
  getCategoryDetail: function (e, o) {
    var t = e.body,
      n = "select * from category where code=?";
    console.log("품목 상세 출력: " + n);
    var a = [t.category_code];
    conn.query(n, a, function (e, t) {
      e ? console.log("품목 상세 출력 오류: " + e) : o.send(t[0]);
    });
  },
  getCategoryActive: function (e, o) {
    var t = "select * from category where active='y'";
    console.log("활성화된 품목 출력: " + t),
      conn.query(t, function (e, t) {
        e ? console.log("활성화된 품목 출력 오류: " + e) : o.send(t);
      });
  },
  deleteCategory: function (e, o) {
    var t = e.body,
      n = "delete from category where code=?";
    console.log("품목 삭제: " + n);
    var a = [t.category_code];
    conn.query(n, a, function (e) {
      e ? console.log("품목 삭제 오류: " + e) : o.sendStatus(200);
    });
  },
};

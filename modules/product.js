const fs = require("fs"),
  db = require("./mysql.js"),
  conn = db.init();
module.exports = {
  productRegist: function (e, o) {
    var n = e.body,
      c = "select count(*)+1 as product_code from product";
    console.log("상품 코드 생성: " + c),
      conn.query(c, function (c, t) {
        if (c) console.log("상품 코드 생성 오류: " + c);
        else {
          "" == n.discount_price ? (n.discount = "n") : (n.discount = "y");
          var r =
            "insert into product(code,storecode,category_code,name,regnumber,storename,price,origin,amount,recommend,discount,discount_price) values(?,?,?,?,?,?,?,?,?,?,?,?)";
          console.log("상품 등록: " + r);
          var d = [
            t[0].product_code,
            e.params.storecode,
            n.category_code,
            n.name,
            n.regnumber,
            n.storename,
            n.price,
            n.origin,
            n.amount,
            n.recommend,
            n.discount,
            n.discount_price,
          ];
          conn.query(r, d, function (n) {
            if (n) console.log("상품 등록 오류: " + n);
            else if (null != e.file) {
              console.log("상품 이미지 등록: " + r);
              var c = [
                t[0].product_code,
                e.params.storecode,
                e.file.destination,
                e.file.filename,
              ];
              conn.query(
                "insert into product_image (product_code,storecode,savefolder,savefile) values (?,?,?,?)",
                c,
                function (e) {
                  e
                    ? console.log("상품 이미지 등록 오류: " + e)
                    : o.sendStatus(200);
                }
              );
            } else o.sendStatus(200);
          });
        }
      });
  },
  productUpdate: function (e, o) {
    var n = e.body;
    "" == n.discount_price ? (n.discount = "n") : (n.discount = "y");
    var c =
      "update product set name=?,price=?,origin=?,amount=?,recommend=?,discount=?,discount_price=? where code=" +
      e.params.product_code;
    console.log("상품 수정: " + c);
    var t = [
      n.name,
      n.price,
      n.origin,
      n.amount,
      n.recommend,
      n.discount,
      n.discount_price,
    ];
    conn.query(c, t, function (n) {
      if (n) console.log("상품 수정 오류: " + n);
      else if (null != e.file) {
        var c =
          "update product_image set savefolder=?,savefile=?,filetype=? where product_code=?";
        console.log("상품 이미지 수정: " + c);
        var t = [
          e.file.destination,
          e.file.filename,
          e.file.mimetype,
          e.params.product_code,
        ];
        conn.query(c, t, function (e) {
          e ? console.log("상품 이미지 수정 오류: " + e) : o.sendStatus(200);
        });
      } else o.sendStatus(200);
    });
  },
  getProductImg: function (e, o) {
    var n =
      "select * from product_image where product_code=" + e.params.product_code;
    console.log("상품 이미지 출력: " + n),
      conn.query(n, function (e, n) {
        e
          ? console.log("상품 이미지 출력 오류: " + e)
          : 0 != n.length
          ? fs.readFile("uploads/" + n[0].savefile, function (e, n) {
              o.writeHead(200, { "Context-Type": "text/html" }), o.end(n);
            })
          : o.sendStatus(200);
      });
  },
  getProduct: function (e, o) {
    var n = "select * from product";
    console.log("상품 전체 출력: " + n),
      conn.query(n, function (e, n) {
        e ? console.log("상품 전체 출력 오류: " + e) : o.send(n);
      });
  },
  getProductDetail: function (e, o) {
    var n = e.body,
      c = "select * from product where code=? and display='y'";
    console.log("상품 상세 출력: " + c);
    var t = [n.product_code];
    conn.query(c, t, function (e, n) {
      e ? console.log("상품 상세 출력 오류: " + e) : o.send(n[0]);
    });
  },
  getProductStore: function (e, o) {
    var n = e.body,
      c = "select * from product where storecode=?";
    console.log("가맹점별 상품 출력: " + c);
    var t = [n.storecode];
    conn.query(c, t, function (e, n) {
      e ? console.log("가맹점별 상품 출력 오류: " + e) : o.send(n);
    });
  },
  getProductCategory: function (e, o) {
    var n = e.body;
    if (0 == n.category_code) {
      var c = "select * from product where display='y'";
      console.log("상품 출력: " + c),
        conn.query(c, function (e, n) {
          e ? console.log("상품 출력 오류: " + e) : o.send(n);
        });
    } else {
      var c = "select * from product where category_code=? and display='y'";
      console.log("품목별 상품 출력: " + c);
      var t = [n.category_code];
      conn.query(c, t, function (e, n) {
        e ? console.log("품목별 상품 출력 오류: " + e) : o.send(n);
      });
    }
  },
  getProductRecommend: function (e, o) {
    var n = e.body;
    if (0 == n.category_code) {
      var c = "select * from product where recommend='on' and display='y'";
      console.log("추천상품 출력: " + c),
        conn.query(c, function (e, n) {
          e ? console.log("추천상품 출력 오류: " + e) : o.send(n);
        });
    } else {
      var c =
        "select * from product where recommend='on' and display='y' and category_code=?";
      console.log("품목별 추천상품 출력: " + c);
      var t = [n.category_code];
      conn.query(c, t, function (e, n) {
        e ? console.log("품목별 추천상품 출력 오류: " + e) : o.send(n);
      });
    }
  },
  searchProduct: function (e, o) {
    var n = e.body,
      c =
        "select product.name as productname,product.code as productcode,store.name as storename,store.code as storecode,store.latitude,store.longitude from product inner join store on store.code=product.storecode where product.name like concat('%',?,'%') and display='y'";
    console.log("상품 검색: " + c);
    var t = [n.word];
    conn.query(c, t, function (e, n) {
      e ? console.log("상품 검색 오류: " + e) : o.send(n);
    });
  },
  deleteProduct: function (e, o) {
    var n = "delete from product where code=" + e.params.product_code;
    console.log("상품 삭제: " + n),
      conn.query(n, function (e) {
        e ? console.log("상품 삭제 오류: " + e) : o.sendStatus(200);
      });
  },
};

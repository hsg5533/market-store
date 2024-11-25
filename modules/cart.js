const db = require("./mysql.js"),
  conn = db.init();
module.exports = {
  cartRegist: function (o, e) {
    var c = o.body,
      n =
        "select count(*) as boolean from cart where product_code=? and cookie=? and display='y'";
    console.log("장바구니 조회: " + n);
    var t = [c.product_code, c.cookie];
    conn.query(n, t, function (o, n) {
      if (o) console.log("장바구니 조회 오류: " + o);
      else if (0 != n[0].boolean) {
        var t =
          "update cart set storecode=?,product_code=?,regnumber=?,storename=?,product_name=?,amount=amount+1,price=?,discount=?,discount_price=?,regdate=now(),cookie=? where product_code=? and Cookie=?";
        console.log("장바구니 수정: " + t);
        var r = [
          c.storecode,
          c.product_code,
          c.regnumber,
          c.storename,
          c.product_name,
          c.price,
          c.discount,
          c.discount_price,
          c.cookie,
          c.product_code,
          c.cookie,
        ];
        conn.query(t, r, function (o) {
          o ? console.log("장바구니 수정 오류: " + o) : e.sendStatus(200);
        });
      } else {
        var t =
          "insert into cart (storecode,product_code,regnumber,storename,product_name,amount,price,discount,discount_price,regdate,cookie) values(?,?,?,?,?,?,?,?,?,now(),?)";
        console.log("장바구니 등록:" + t);
        var r = [
          c.storecode,
          c.product_code,
          c.regnumber,
          c.storename,
          c.product_name,
          c.amount,
          c.price,
          c.discount,
          c.discount_price,
          c.cookie,
        ];
        conn.query(t, r, function (o) {
          o ? console.log("장바구니 등록 오류: " + o) : e.sendStatus(200);
        });
      }
    });
  },
  getCart: function (o, e) {
    var c = o.body,
      n = "select * from cart where cookie=? and display='y'";
    console.log("장바구니 출력: " + n);
    var t = [c.cookie];
    conn.query(n, t, function (o, c) {
      o ? console.log("장바구니 출력 오류: " + o) : e.send(c);
    });
  },
  deleteCart: function (o, e) {
    var c = o.body,
      n = "update cart set display='n' where cookie=? and product_code=?";
    console.log("장바구니 삭제:" + n);
    var t = [c.cookie, c.product_code];
    conn.query(n, t, function (o) {
      o ? console.log("장바구니 삭제 오류: " + o) : e.sendStatus(200);
    });
  },
  deleteCartAll: function (o, e) {
    var c = o.body,
      n = "update cart set display='n' where cookie=?";
    console.log("장바구니 전체 삭제: " + n);
    var t = [c.cookie];
    conn.query(n, t, function (o) {
      o ? console.log("장바구니 전체 삭제 오류: " + o) : e.sendStatus(200);
    });
  },
  cartPrice: function (o, e) {
    var c = o.body,
      n =
        "select price+ sale_price as total from (SELECT ifnull(sum(amount*discount_price),0) as sale_price FROM cart where discount ='y' and display='y' and cookie=?) as a, (SELECT ifnull(sum(amount*price),0) as price FROM cart where discount ='n' and display='y' and cookie=?) as b";
    console.log("장바구니 총액 계산: " + n);
    var t = [c.cookie, c.cookie];
    conn.query(n, t, function (o, c) {
      o ? console.log("장바구니 총액 계산 오류: " + o) : e.send(c[0]);
    });
  },
};

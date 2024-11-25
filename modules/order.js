const db = require("./mysql.js"),
  conn = db.init();
module.exports = {
  orderRegist: function (e, r) {
    var o = e.body,
      d =
        "insert into `order` (orderid,summary,order_name,password,order_phone,order_tel,order_postcode,order_address,order_address_detail,email,receive_name,receive_phone,receive_postcode,receive_address,receive_address_detail,message) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    console.log("주문서 등록:" + d);
    var n = [
      o.orderid,
      o.summary,
      o.order_name,
      o.password,
      o.order_phone,
      o.ordertel,
      o.order_postcode,
      o.order_address,
      o.order_address_detail,
      o.email,
      o.receive_name,
      o.receive_phone,
      o.receive_postcode,
      o.receive_address,
      o.receive_address_detail,
      o.message,
    ];
    conn.query(d, n, function (e) {
      e ? console.log("주문서 등록 오류: " + e) : r.sendStatus(200);
    });
  },
  orderProductRegist: function (e, r) {
    var o = e.body,
      d =
        "insert into order_product (orderid,product_code,product_name,product_amount,storecode,regnumber,storename,price,discount,discount_price) values (?,?,?,?,?,?,?,?,?,?)";
    console.log("주문 상품 등록:" + d);
    var n = [
      o.orderid,
      o.product_code,
      o.product_name,
      o.product_amount,
      o.storecode,
      o.regnumber,
      o.storename,
      o.price,
      o.discount,
      o.discount_price,
    ];
    conn.query(d, n, function (e) {
      e ? console.log("주문상품 등록 오류: " + e) : r.sendStatus(200);
    });
  },
  getOrder: function (e, r) {
    var o = "select * from `order`";
    console.log("주문서 전체 출력: " + o),
      conn.query(o, function (e, o) {
        e
          ? console.log("주문서 전체 출력 오류: " + e)
          : 0 == o.length
          ? r.send([{ orderid: "empty" }])
          : r.send(o);
      });
  },
  getOrderDetail: function (e, r) {
    var o = e.body,
      d = "select * from `order` where orderid=?";
    console.log("주문서 상세 출력: " + d);
    var n = [o.orderid];
    conn.query(d, n, function (e, o) {
      e ? console.log("주문서 상세 출력 오류: " + e) : r.send(o[0]);
    });
  },
  getOrderLog: function (e, r) {
    var o = e.body,
      d =
        "select * from `order` where order_name=? and password=? and order_phone=?";
    console.log("주문서 기록 출력: " + d);
    var n = [o.order_name, o.password, o.order_phone];
    conn.query(d, n, function (e, o) {
      e
        ? console.log("주문서 기록 출력 오류: " + e)
        : 0 == o.length
        ? r.send([{ orderid: "empty" }])
        : r.send(o);
    });
  },
  getOrderStore: function (e, r) {
    var o =
      "select a.storename,count,sum1+ifnull(sum2,0) as total from (select storename,count(*) as count,ifnull(sum(product_amount*discount_price),0) as sum1 from order_product group by storename) as a left outer join (select storename,sum(product_amount*price) as sum2 from order_product where discount ='n' group by storename) as b on a.storename=b.storename";
    console.log("주문건 전체 출력: " + o),
      conn.query(o, function (e, o) {
        e ? console.log("주문건 전체 출력 오류: " + e) : r.send(o);
      });
  },
  getOrderStoreDetail: function (e, r) {
    var o = e.body,
      d =
        "select a.orderid,sum1+ifnull(sum2,0) as total from (SELECT orderid,ifnull(sum(product_amount*discount_price),0) as sum1 FROM order_product where storename=? group by orderid) as a left outer join (SELECT orderid,sum(product_amount*price) as sum2 FROM order_product where discount ='n' and storename=? group by orderid) as b on a.orderid=b.orderid";
    console.log("주문건 상세 출력: " + d);
    var n = [o.storename, o.storename];
    conn.query(d, n, function (e, o) {
      e ? console.log("주문건 상세 출력 오류: " + e) : r.send(o);
    });
  },
  getOrderProduct: function (e, r) {
    var o = "select * from order_product";
    console.log("주문상품 전체 출력: " + o),
      conn.query(o, function (e, o) {
        e ? console.log("주문상품 전체 출력 오류: " + e) : r.send(o);
      });
  },
  getOrderProductDetail: function (e, r) {
    var o = e.body,
      d = "select * from order_product where orderid=?";
    console.log("주문상품 상세 출력: " + d);
    var n = [o.orderid];
    conn.query(d, n, function (e, o) {
      e ? console.log("주문상품 상세 출력 오류: " + e) : r.send(o);
    });
  },
  getOrderProductStore: function (e, r) {
    var o = e.body,
      d = "select * from order_product where storename=?";
    console.log("가맹점별 주문상품 출력: " + d);
    var n = [o.storename];
    conn.query(d, n, function (e, o) {
      e ? console.log("가맹점별 주문상품 출력 오류: " + e) : r.send(o);
    });
  },
  orderPrice: function (e, r) {
    var o = e.body,
      d =
        "select price+sale_price as total from (SELECT ifnull(sum(product_amount*discount_price),0) as sale_price FROM order_product where discount='y' and orderid=?) as a,(SELECT sum(product_amount*price) as price FROM order_product where discount ='n' and orderid=?) as b";
    console.log("주문 총액 계산: " + d);
    var n = [o.orderid, o.orderid];
    conn.query(d, n, function (e, o) {
      e ? console.log("주문 총액 계산 오류: " + e) : r.send(o[0]);
    });
  },
  orderPriceStore: function (e, r) {
    var o = e.body,
      d =
        "select sum(sum1+ifnull(sum2,0)) as total from (SELECT orderid,ifnull(sum(product_amount*discount_price),0) as sum1 FROM order_product where storename=? group by orderid) as a left outer join (SELECT orderid,sum(product_amount*price) as sum2 FROM order_product where discount ='n' and storename=? group by orderid) as b on a.orderid=b.orderid";
    console.log("총액 계산: " + d);
    var n = [o.storename, o.storename];
    conn.query(d, n, function (e, o) {
      e ? console.log("총액 계산 오류: " + e) : r.send(o[0]);
    });
  },
};

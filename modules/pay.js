const db = require("./mysql.js"),
  conn = db.init();
module.exports = {
  toss: function (e, o) {
    var { paymentKey: r, orderId: t, amount: a } = e.query;
    fetch({
      method: "POST",
      url: "https://api.tosspayments.com/v1/payments/confirm",
      headers: {
        Authorization:
          "Basic dGVzdF9za19YakV4UGVKV1lWUTZ5OTBBMjR2cjQ5UjVndk5MOg==",
        "Content-Type": "application/json",
      },
      data: { paymentKey: r, amount: a, orderId: t },
    })
      .then(() => {
        var s = "insert into pay (paymentKey,orderId,price) values (?,?,?)";
        console.log("결제기록 등록" + s),
          conn.query(s, [r, t, a], function (e) {
            if (e) console.log("결제기록 등록 오류: " + e);
            else {
              var r = "update `order` set pay='y' where orderid=?";
              console.log("주문서 결제기록 수정" + r),
                conn.query(r, [t], function (e) {
                  if (e) console.log("주문서 결제기록 수정 오류: " + e);
                  else {
                    var r =
                      "update order_product set pay='y',status='입금' where orderid=?";
                    console.log("주문상품 결제기록 수정" + r),
                      conn.query(r, [t], function (e) {
                        e
                          ? console.log("주문상품 결제기록 수정 오류: " + e)
                          : o.redirect(
                              "https://211.220.39.38:5500/order_detail/" + t
                            );
                      });
                  }
                });
            }
          });
      })
      .catch((e) => console.log(e));
  },
  payLog: function (e, o) {
    var r = e.body,
      t = "select * from pay where orderid=?";
    console.log("결제기록 출력:" + t);
    var a = [r.orderid];
    conn.query(t, a, (e, r) =>
      e ? console.log("결제기록 출력 오류: " + e) : o.send(r[0])
    );
  },
};

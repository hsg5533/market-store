const db = require("./mysql.js"),
  conn = db.init();
module.exports = {
  payments: function (e, o) {
    let { imp_uid: r, merchant_uid: t } = e.body;
    fetch({
      url: "https://api.iamport.kr/users/getToken",
      method: "post",
      data: {
        imp_key: "1348548410045848",
        imp_secret:
          "TnRTNNiiHxipZ3W7iMjIVGVbR7lXG2xSWflj0Y3BAuYfkRNlXXh72V8j3dhvxCeHdIsT0OBHuqMsgvDF",
      },
    })
      .then((res) => res.json())
      .then((e) => {
        console.log("인증 토큰: " + e.response.access_token),
          fetch({
            url: `https://api.iamport.kr/payments/${r}`,
            method: "get",
            headers: { Authorization: e.response.access_token },
          })
            .then((res) => res.json())
            .then((e) => {
              console.log("조회한 결제 정보: "), console.log(e.response);
              var r =
                "select price+sale_price as total from (SELECT ifnull(sum(product_amount*discount_price),0) as sale_price FROM order_product where discount='y' and orderid=?) as a,(SELECT sum(product_amount*price) as price FROM order_product where discount ='n' and orderid=?) as b";
              console.log("결제 금액 계산: " + r),
                conn.query(r, [t, t], (r, t) => {
                  if (r) console.log("결제 금액 계산 오류: " + r);
                  else if (e.response.amount == parseInt(t[0].total)) {
                    var a =
                      "insert into pay (orderId,paymentKey,pg_provider,emb_pg_provider,price) values (?,?,?,?,?)";
                    console.log("결제 기록 등록: " + a);
                    var s = [
                      e.response.merchant_uid,
                      e.response.imp_uid,
                      e.response.pg_provider,
                      e.response.emb_pg_provider,
                      e.response.amount,
                    ];
                    conn.query(a, s, (r) => {
                      if (r) console.log("결제기록 등록 오류: " + r);
                      else {
                        var t = "update `order` set pay='y' where orderid=?";
                        console.log("주문서 결제 기록 수정: " + t);
                        var a = [e.response.merchant_uid];
                        conn.query(t, a, (r) => {
                          if (r) console.log("주문서 결제기록 수정 오류: " + r);
                          else {
                            var t =
                              "update order_product set pay='y',status='입금' where orderid=?";
                            console.log("주문상품 결제 기록 수정: " + t);
                            var a = [e.response.merchant_uid];
                            conn.query(t, a, (r) => {
                              if (r)
                                console.log(
                                  "주문상품 결제기록 수정 오류: " + r
                                );
                              else
                                switch (
                                  (console.log(
                                    "결제 상태: " + e.response.status
                                  ),
                                  e.response.status)
                                ) {
                                  case "ready":
                                    let {
                                      vbank_num: t,
                                      vbank_date: a,
                                      vbank_name: s,
                                    } = paymentData;
                                    Users.findByIdAndUpdate("/* 고객 id */", {
                                      $set: {
                                        vbank_num: t,
                                        vbank_date: a,
                                        vbank_name: s,
                                      },
                                    }),
                                      SMS.send({
                                        text: `가상계좌 발급이 성공되었습니다. 계좌 정보 ${t} ${a} ${s}`,
                                      }),
                                      o.send({
                                        status: "vbankIssued",
                                        message: "가상계좌 발급 성공",
                                      });
                                    break;
                                  case "paid":
                                    o.send({
                                      status: "success",
                                      message: "일반 결제 성공",
                                    });
                                }
                            });
                          }
                        });
                      }
                    });
                  } else
                    o.send({ status: "forgery", message: "위조된 결제시도" });
                });
            });
      });
  },
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
      .then((res) => res.json())
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

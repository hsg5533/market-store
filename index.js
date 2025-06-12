const express = require("express"),
  multer = require("multer"),
  logger = require("morgan"),
  cors = require("cors"),
  fs = require("fs"),
  qr = require("./modules/qr.js"),
  pay = require("./modules/pay.js"),
  log = require("./modules/log.js"),
  link = require("./modules/link.js"),
  cart = require("./modules/cart.js"),
  push = require("./modules/push.js"),
  login = require("./modules/login.js"),
  order = require("./modules/order.js"),
  store = require("./modules/store.js"),
  notice = require("./modules/notice.js"),
  product = require("./modules/product.js"),
  inquiry = require("./modules/inquiry.js"),
  category = require("./modules/category.js"),
  whitelist = require("./whitelist.json"),
  bodyParser = require("body-parser"),
  app = express(),
  upload = multer({
    storage: multer.diskStorage({
      destination: function (e, t, o) {
        console.log(t),
          fs.existsSync("./uploads/") ||
            fs.mkdirSync("./uploads/", { recursive: !0 }),
          o(null, "./uploads/");
      },
      filename: function (e, t, o) {
        o(null, t.originalname);
      },
    }),
  });
app.set("port", process.env.PORT || 3030),
  app.set("host", process.env.HOST || "0.0.0.0"),
  app.use(logger("dev")),
  app.use(bodyParser.json()),
  app.use(bodyParser.urlencoded({ extended: !0 })),
  app.use(
    cors({
      origin(e, t) {
        console.log("접속된 주소: " + e),
          -1 == whitelist.host.indexOf(e) && e
            ? t(Error("허가되지 않은 주소입니다."))
            : t(null, !0);
      },
      credentials: !0,
      optionsSuccessStatus: 200,
    })
  ),
  app.all("/*", function (e, t, o) {
    let p = e.headers.origin;
    (-1 == whitelist.host.indexOf(p) && p) ||
      (t.header("Access-Control-Allow-Origin", p),
      t.header("Access-Control-Allow-Headers", "X-Requested-With"),
      o());
  }),
  app.get("/", (e, t) => {
    t.send({ ip: e.ip });
  }),
  app.get("/getToken", (e, t) => {
    push.getToken(e, t);
  }),
  app.post("/TokenRegist", (e, t) => {
    push.tokenRegist(e, t);
  }),
  app.post("/sendPushNotification", (e, t) => {
    push.notification(e, t);
  }),
  app.post("/visitRegist", (e, t) => {
    log.visitRegist(e, t);
  }),
  app.post("/connectRegist", (e, t) => {
    log.connectRegist(e, t);
  }),
  app.post("/searchRegist", (e, t) => {
    log.searchRegist(e, t);
  }),
  app.get("/getVisit", (e, t) => {
    log.getVisit(e, t);
  }),
  app.post("/getVisitToday", (e, t) => {
    log.getVisitToday(e, t);
  }),
  app.post("/getVisitMonth", (e, t) => {
    log.getVisitMonth(e, t);
  }),
  app.post("/getVisitHour", (e, t) => {
    log.getVisitHour(e, t);
  }),
  app.post("/getVisitDate", (e, t) => {
    log.getVisitDate(e, t);
  }),
  app.post("/getVisitPlatform", (e, t) => {
    log.getVisitPlatform(e, t);
  }),
  app.get("/getSearch", (e, t) => {
    log.getSearch(e, t);
  }),
  app.post("/makecode", (e, t) => {
    link.makecode(e, t);
  }),
  app.get("/getLink", (e, t) => {
    link.getLink(e, t);
  }),
  app.post("/getLinkActive", (e, t) => {
    link.getLinkActive(e, t);
  }),
  app.post("/linkUpdate", (e, t) => {
    link.linkUpdate(e, t);
  }),
  app.post("/qrsave", (e, t) => {
    qr.qrsave(e, t);
  }),
  app.get("/qrload/:code", (e, t) => {
    qr.qrload(e, t);
  }),
  app.get("/qrdown/:code", (e, t) => {
    qr.qrdown(e, t);
  }),
  app.post("/adminLogin", (e, t) => {
    login.adminLogin(e, t);
  }),
  app.post("/storeLogin", (e, t) => {
    login.storeLogin(e, t);
  }),
  app.post("/changePassword", (e, t) => {
    login.changePassword(e, t);
  }),
  app.post("/resetPassword", (e, t) => {
    login.resetPassword(e, t);
  }),
  app.post("/noticeRegist", upload.single("imgUpload"), (e, t) => {
    notice.noticeRegist(e, t);
  }),
  app.get("/getNotice", (e, t) => {
    notice.getNotice(e, t);
  }),
  app.post("/getNoticeDetail", (e, t) => {
    notice.getNoticeDetail(e, t);
  }),
  app.get("/getNoticeImg/:num", (e, t) => {
    notice.getNoticeImg(e, t);
  }),
  app.post("/hitNotice", (e, t) => {
    notice.hitNotice(e, t);
  }),
  app.delete("/deleteNotice", (e, t) => {
    notice.deleteNotice(e, t);
  }),
  app.post("/inquiryRegist", upload.single("imgUpload"), (e, t) => {
    inquiry.inquiryRegist(e, t);
  }),
  app.post("/inquiryReply", (e, t) => {
    inquiry.inquiryReply(e, t);
  }),
  app.get("/getInquiry", (e, t) => {
    inquiry.getInquiry(e, t);
  }),
  app.post("/getInquiryDetail", (e, t) => {
    inquiry.getInquiryDetail(e, t);
  }),
  app.get("/getInquiryImg/:num", (e, t) => {
    inquiry.getInquiryImg(e, t);
  }),
  app.post("/getInquiryReply", (e, t) => {
    inquiry.getInquiryReply(e, t);
  }),
  app.delete("/deleteInquiry", (e, t) => {
    inquiry.deleteInquiry(e, t);
  }),
  app.post("/checkRegnumber", (e, t) => {
    store.checkRegnumber(e, t);
  }),
  app.post("/storeRegist", (e, t) => {
    store.storeRegist(e, t);
  }),
  app.post("/storeUpdate", (e, t) => {
    store.storeUpdate(e, t);
  }),
  app.post("/introRegist", upload.single("imgUpload"), (e, t) => {
    store.introRegist(e, t);
  }),
  app.post("/breakUpdate", (e, t) => {
    store.breakUpdate(e, t);
  }),
  app.post("/holidayUpdate", (e, t) => {
    store.holidayUpdate(e, t);
  }),
  app.post("/storeActive", (e, t) => {
    store.storeActive(e, t);
  }),
  app.get("/getStoreSign/:regnumber", (e, t) => {
    store.getStoreSign(e, t);
  }),
  app.get("/getStoreImg/:regnumber", (e, t) => {
    store.getStoreImg(e, t);
  }),
  app.get("/getStore", (e, t) => {
    store.getStore(e, t);
  }),
  app.post("/getStoreDetail", (e, t) => {
    store.getStoreDetail(e, t);
  }),
  app.post("/getStoreCategory", (e, t) => {
    store.getStoreCategory(e, t);
  }),
  app.post("/getStoreReg", (e, t) => {
    store.getStoreReg(e, t);
  }),
  app.post("/getStoreLink", (e, t) => {
    store.getStoreLink(e, t);
  }),
  app.post("/getStoreInstall", (e, t) => {
    store.getStoreInstall(e, t);
  }),
  app.post("/getStoreControl", (e, t) => {
    store.getStoreControl(e, t);
  }),
  app.post("/categoryRegist", upload.single("imgUpload"), (e, t) => {
    category.categoryRegist(e, t);
  }),
  app.post("/categoryUpdate", upload.single("imgUpload"), (e, t) => {
    category.categoryUpdate(e, t);
  }),
  app.post("/categoryActive", (e, t) => {
    category.categoryActive(e, t);
  }),
  app.get("/getCategoryImg/:category_code", (e, t) => {
    category.getCategoryImg(e, t);
  }),
  app.get("/getCategory", (e, t) => {
    category.getCategory(e, t);
  }),
  app.post("/getCategoryDetail", (e, t) => {
    category.getCategoryDetail(e, t);
  }),
  app.get("/getCategoryActive", (e, t) => {
    category.getCategoryActive(e, t);
  }),
  app.delete("/deleteCategory", (e, t) => {
    category.deleteCategory(e, t);
  }),
  app.post("/productRegist/:storecode", upload.single("imgUpload"), (e, t) => {
    product.productRegist(e, t);
  }),
  app.post(
    "/productUpdate/:product_code",
    upload.single("imgUpload"),
    (e, t) => {
      product.productUpdate(e, t);
    }
  ),
  app.get("/getProductImg/:product_code", (e, t) => {
    product.getProductImg(e, t);
  }),
  app.get("/getProduct", (e, t) => {
    product.getProduct(e, t);
  }),
  app.post("/getProductDetail", (e, t) => {
    product.getProductDetail(e, t);
  }),
  app.post("/getProductStore", (e, t) => {
    product.getProductStore(e, t);
  }),
  app.post("/getProductCategory", (e, t) => {
    product.getProductCategory(e, t);
  }),
  app.post("/getProductRecommend", (e, t) => {
    product.getProductRecommend(e, t);
  }),
  app.post("/searchProduct", (e, t) => {
    product.searchProduct(e, t);
  }),
  app.delete("/deleteProduct/:product_code", (e, t) => {
    product.deleteProduct(e, t);
  }),
  app.post("/cartRegist", (e, t) => {
    cart.cartRegist(e, t);
  }),
  app.post("/getCart", (e, t) => {
    cart.getCart(e, t);
  }),
  app.delete("/deleteCart", (e, t) => {
    cart.deleteCart(e, t);
  }),
  app.delete("/deleteCartAll", (e, t) => {
    cart.deleteCartAll(e, t);
  }),
  app.post("/cartPrice", (e, t) => {
    cart.cartPrice(e, t);
  }),
  app.post("/orderRegist", (e, t) => {
    order.orderRegist(e, t);
  }),
  app.post("/orderProductRegist", (e, t) => {
    order.orderProductRegist(e, t);
  }),
  app.get("/getOrder", (e, t) => {
    order.getOrder(e, t);
  }),
  app.post("/getOrderDetail", (e, t) => {
    order.getOrderDetail(e, t);
  }),
  app.post("/getOrderLog", (e, t) => {
    order.getOrderLog(e, t);
  }),
  app.get("/getOrderStore", (e, t) => {
    order.getOrderStore(e, t);
  }),
  app.post("/getOrderStoreDetail", (e, t) => {
    order.getOrderStoreDetail(e, t);
  }),
  app.get("/getOrderProduct", (e, t) => {
    order.getOrderProduct(e, t);
  }),
  app.post("/getOrderProductDetail", (e, t) => {
    order.getOrderProductDetail(e, t);
  }),
  app.post("/getOrderProductStore", (e, t) => {
    order.getOrderProductStore(e, t);
  }),
  app.post("/orderPrice", (e, t) => {
    order.orderPrice(e, t);
  }),
  app.post("/orderPriceStore", (e, t) => {
    order.orderPriceStore(e, t);
  }),
  app.post("/payments", (e, t) => {
    pay.payments(e, t);
  }),
  app.get("/toss", (e, t) => {
    pay.toss(e, t);
  }),
  app.get("/fail", (e, t) => {
    t.send("결제실패");
  }),
  app.post("/payLog", (e, t) => {
    pay.payLog(e, t);
  }),
  app.listen(app.get("port"), app.get("host"), () =>
    console.log("http 서버 대기중 : " + app.get("host") + ":" + app.get("port"))
  );

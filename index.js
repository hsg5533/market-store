const express = require("express");
const multer = require("multer");
const logger = require("morgan");
const cors = require("cors");
const fs = require("fs-extra");
const qr = require("./modules/qr.js");
const pay = require("./modules/pay.js");
const log = require("./modules/log.js");
const link = require("./modules/link.js");
const cart = require("./modules/cart.js");
const push = require("./modules/push.js");
const login = require("./modules/login.js");
const order = require("./modules/order.js");
const store = require("./modules/store.js");
const notice = require("./modules/notice.js");
const product = require("./modules/product.js");
const inquiry = require("./modules/inquiry.js");
const category = require("./modules/category.js");
const whitelist = require("./whitelist.json");
const app = express();
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dir = "./uploads/";
      fs.ensureDirSync(dir);
      cb(null, dir);
    },
    filename: (_req, file, cb) => cb(null, file.originalname),
  }),
});

app.set("port", process.env.PORT || 3030);
app.set("host", process.env.HOST || "0.0.0.0");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
  app.all("/*", (e, t, o) => {
    let p = e.headers.origin;
    (-1 == whitelist.host.indexOf(p) && p) ||
      (t.header("Access-Control-Allow-Origin", p),
      t.header("Access-Control-Allow-Headers", "X-Requested-With"),
      o());
  }),
  app.get("/", (e, t) => t.send({ ip: e.ip })),
  app.get("/getToken", push.getToken),
  app.post("/TokenRegist", push.tokenRegist),
  app.post("/sendPushNotification", push.notification),
  app.post("/visitRegist", log.visitRegist),
  app.post("/connectRegist", log.connectRegist),
  app.post("/searchRegist", log.searchRegist),
  app.get("/getVisit", log.getVisit),
  app.post("/getVisitToday", log.getVisitToday),
  app.post("/getVisitMonth", log.getVisitMonth),
  app.post("/getVisitHour", log.getVisitHour),
  app.post("/getVisitDate", log.getVisitDate),
  app.post("/getVisitPlatform", log.getVisitPlatform),
  app.get("/getSearch", log.getSearch),
  app.post("/makecode", link.makecode),
  app.get("/getLink", link.getLink),
  app.post("/getLinkActive", link.getLinkActive),
  app.post("/linkUpdate", link.linkUpdate),
  app.post("/qrsave", qr.qrsave),
  app.get("/qrload/:code", qr.qrload),
  app.get("/qrdown/:code", qr.qrdown),
  app.post("/adminLogin", login.adminLogin),
  app.post("/storeLogin", login.storeLogin),
  app.post("/changePassword", login.changePassword),
  app.post("/resetPassword", login.resetPassword),
  app.post("/noticeRegist", upload.single("img"), notice.noticeRegist),
  app.get("/getNotice", notice.getNotice),
  app.post("/getNoticeDetail", notice.getNoticeDetail),
  app.get("/getNoticeImg/:num", notice.getNoticeImg),
  app.post("/hitNotice", notice.hitNotice),
  app.delete("/deleteNotice", notice.deleteNotice),
  app.post("/inquiryRegist", upload.single("img"), inquiry.inquiryRegist),
  app.post("/inquiryReply", inquiry.inquiryReply),
  app.get("/getInquiry", inquiry.getInquiry),
  app.post("/getInquiryDetail", inquiry.getInquiryDetail),
  app.get("/getInquiryImg/:num", inquiry.getInquiryImg),
  app.post("/getInquiryReply", inquiry.getInquiryReply),
  app.delete("/deleteInquiry", inquiry.deleteInquiry),
  app.post("/checkRegnumber", store.checkRegnumber),
  app.post("/storeRegist", store.storeRegist),
  app.post("/storeUpdate", store.storeUpdate),
  app.post("/introRegist", upload.single("img"), store.introRegist),
  app.post("/breakUpdate", store.breakUpdate),
  app.post("/holidayUpdate", store.holidayUpdate),
  app.post("/storeActive", store.storeActive),
  app.get("/getStoreSign/:regnumber", store.getStoreSign),
  app.get("/getStoreImg/:regnumber", store.getStoreImg),
  app.get("/getStore", store.getStore),
  app.post("/getStoreDetail", store.getStoreDetail),
  app.post("/getStoreCategory", store.getStoreCategory),
  app.post("/getStoreReg", store.getStoreReg),
  app.post("/getStoreLink", store.getStoreLink),
  app.post("/getStoreInstall", store.getStoreInstall),
  app.post("/getStoreControl", store.getStoreControl),
  app.post("/categoryRegist", upload.single("img"), category.categoryRegist),
  app.post("/categoryUpdate", upload.single("img"), category.categoryUpdate),
  app.post("/categoryActive", category.categoryActive),
  app.get("/getCategoryImg/:code", category.getCategoryImg),
  app.get("/getCategory", category.getCategory),
  app.post("/getCategoryDetail", category.getCategoryDetail),
  app.get("/getCategoryActive", category.getCategoryActive),
  app.delete("/deleteCategory", category.deleteCategory),
  app.post("/productRegist/:code", upload.single("img"), product.productRegist),
  app.post("/productUpdate/:code", upload.single("img"), product.productUpdate),
  app.get("/getProductImg/:code", product.getProductImg),
  app.get("/getProduct", product.getProduct),
  app.post("/getProductDetail", product.getProductDetail),
  app.post("/getProductStore", product.getProductStore),
  app.post("/getProductCategory", product.getProductCategory),
  app.post("/getProductRecommend", product.getProductRecommend),
  app.post("/searchProduct", product.searchProduct),
  app.delete("/deleteProduct/:code", product.deleteProduct),
  app.post("/cartRegist", cart.cartRegist),
  app.post("/getCart", cart.getCart),
  app.delete("/deleteCart", cart.deleteCart),
  app.delete("/deleteCartAll", cart.deleteCartAll),
  app.post("/cartPrice", cart.cartPrice),
  app.post("/orderRegist", order.orderRegist),
  app.post("/orderProductRegist", order.orderProductRegist),
  app.get("/getOrder", order.getOrder),
  app.post("/getOrderDetail", order.getOrderDetail),
  app.post("/getOrderLog", order.getOrderLog),
  app.get("/getOrderStore", order.getOrderStore),
  app.post("/getOrderStoreDetail", order.getOrderStoreDetail),
  app.get("/getOrderProduct", order.getOrderProduct),
  app.post("/getOrderProductDetail", order.getOrderProductDetail),
  app.post("/getOrderProductStore", order.getOrderProductStore),
  app.post("/orderPrice", order.orderPrice),
  app.post("/orderPriceStore", order.orderPriceStore),
  app.get("/toss", pay.toss),
  app.get("/fail", (e, t) => t.send("결제실패")),
  app.post("/payLog", pay.payLog),
  app.listen(app.get("port"), app.get("host"), () =>
    console.log("서버 대기중 : " + app.get("host") + ":" + app.get("port"))
  );

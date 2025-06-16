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
      console.log("접속된 주소: " + e);
      -1 == whitelist.host.indexOf(e) && e
        ? t(Error("허가되지 않은 주소입니다."))
        : t(null, !0);
    },
    credentials: !0,
    optionsSuccessStatus: 200,
  })
);
app.all("/*", (e, t, o) => {
  let p = e.headers.origin;
  (-1 == whitelist.host.indexOf(p) && p) ||
    (t.header("Access-Control-Allow-Origin", p),
    t.header("Access-Control-Allow-Headers", "X-Requested-With"),
    o());
});
app.get("/", (e, t) => t.send({ ip: e.ip }));
app.get("/getLink", link.getLink);
app.get("/getVisit", log.getVisit);
app.get("/qrload/:code", qr.qrload);
app.get("/qrdown/:code", qr.qrdown);
app.get("/getToken", push.getToken);
app.get("/getSearch", log.getSearch);
app.get("/getOrder", order.getOrder);
app.get("/getStore", store.getStore);
app.get("/getNotice", notice.getNotice);
app.get("/getProduct", product.getProduct);
app.get("/getInquiry", inquiry.getInquiry);
app.get("/getCategory", category.getCategory);
app.get("/getOrderStore", order.getOrderStore);
app.get("/getOrderProduct", order.getOrderProduct);
app.get("/getNoticeImg/:num", notice.getNoticeImg);
app.get("/getInquiryImg/:num", inquiry.getInquiryImg);
app.get("/getStoreImg/:regnumber", store.getStoreImg);
app.get("/getProductImg/:code", product.getProductImg);
app.get("/getStoreSign/:regnumber", store.getStoreSign);
app.get("/getCategoryImg/:code", category.getCategoryImg);
app.get("/getCategoryActive", category.getCategoryActive);
app.get("/toss", pay.toss);
app.get("/fail", (e, t) => t.send("결제실패"));
app.post("/payLog", pay.payLog);
app.post("/getCart", cart.getCart);
app.post("/makecode", link.makecode);
app.post("/cartPrice", cart.cartPrice);
app.post("/hitNotice", notice.hitNotice);
app.post("/linkUpdate", link.linkUpdate);
app.post("/cartRegist", cart.cartRegist);
app.post("/adminLogin", login.adminLogin);
app.post("/storeLogin", login.storeLogin);
app.post("/visitRegist", log.visitRegist);
app.post("/orderPrice", order.orderPrice);
app.post("/TokenRegist", push.tokenRegist);
app.post("/orderRegist", order.orderRegist);
app.post("/getOrderLog", order.getOrderLog);
app.post("/searchRegist", log.searchRegist);
app.post("/getVisitHour", log.getVisitHour);
app.post("/getVisitDate", log.getVisitDate);
app.post("/storeRegist", store.storeRegist);
app.post("/storeUpdate", store.storeUpdate);
app.post("/breakUpdate", store.breakUpdate);
app.post("/storeActive", store.storeActive);
app.post("/getStoreReg", store.getStoreReg);
app.post("/connectRegist", log.connectRegist);
app.post("/getVisitToday", log.getVisitToday);
app.post("/getVisitMonth", log.getVisitMonth);
app.post("/getStoreLink", store.getStoreLink);
app.post("/getLinkActive", link.getLinkActive);
app.post("/inquiryReply", inquiry.inquiryReply);
app.post("/holidayUpdate", store.holidayUpdate);
app.post("/resetPassword", login.resetPassword);
app.post("/changePassword", login.changePassword);
app.post("/getStoreDetail", store.getStoreDetail);
app.post("/checkRegnumber", store.checkRegnumber);
app.post("/searchProduct", product.searchProduct);
app.post("/getOrderDetail", order.getOrderDetail);
app.post("/orderPriceStore", order.orderPriceStore);
app.post("/getVisitPlatform", log.getVisitPlatform);
app.post("/getStoreInstall", store.getStoreInstall);
app.post("/getStoreControl", store.getStoreControl);
app.post("/categoryActive", category.categoryActive);
app.post("/sendPushNotification", push.notification);
app.post("/getNoticeDetail", notice.getNoticeDetail);
app.post("/getInquiryReply", inquiry.getInquiryReply);
app.post("/getStoreCategory", store.getStoreCategory);
app.post("/getProductStore", product.getProductStore);
app.post("/getInquiryDetail", inquiry.getInquiryDetail);
app.post("/getProductDetail", product.getProductDetail);
app.post("/orderProductRegist", order.orderProductRegist);
app.post("/getCategoryDetail", category.getCategoryDetail);
app.post("/getProductCategory", product.getProductCategory);
app.post("/getOrderStoreDetail", order.getOrderStoreDetail);
app.post("/getOrderProductStore", order.getOrderProductStore);
app.post("/getProductRecommend", product.getProductRecommend);
app.post("/getOrderProductDetail", order.getOrderProductDetail);
app.post("/qrsave", upload.single("img"), qr.qrsave);
app.post("/introRegist", upload.single("img"), store.introRegist);
app.post("/noticeRegist", upload.single("img"), notice.noticeRegist);
app.post("/inquiryRegist", upload.single("img"), inquiry.inquiryRegist);
app.post("/categoryRegist", upload.single("img"), category.categoryRegist);
app.post("/categoryUpdate", upload.single("img"), category.categoryUpdate);
app.post("/productRegist/:code", upload.single("img"), product.productRegist);
app.post("/productUpdate/:code", upload.single("img"), product.productUpdate);
app.delete("/deleteCart", cart.deleteCart);
app.delete("/deleteCartAll", cart.deleteCartAll);
app.delete("/deleteNotice", notice.deleteNotice);
app.delete("/deleteInquiry", inquiry.deleteInquiry);
app.delete("/deleteCategory", category.deleteCategory);
app.delete("/deleteProduct/:code", product.deleteProduct);
app.listen(app.get("port"), app.get("host"), () =>
  console.log("서버 대기중 : " + app.get("host") + ":" + app.get("port"))
);

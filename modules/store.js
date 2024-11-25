const fs = require("fs"),
  db = require("./mysql.js"),
  conn = db.init();
module.exports = {
  checkRegnumber: function (e, n) {
    var o = e.body,
      t = "select count(*) as `check` from store where regnumber=?";
    console.log("등록번호 확인: " + t);
    var r = [o.regnumber];
    conn.query(t, r, function (e, o) {
      e ? console.log("등록번호 확인 오류: " + e) : n.send(o[0]);
    });
  },
  storeRegist: function (e, n) {
    var o = e.body,
      t = "select count(*)+1 as count from store";
    console.log("가맹점 코드 생성:" + t),
      conn.query(t, function (e, t) {
        if (e) console.log("가맹점 코드 생성 오류: " + e);
        else {
          var r =
            "insert into store (code,regnumber,category_code,name,tel,owner,birthday,postcode,address,address_detail,phone,open,close,pause,resume,latitude,longitude) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
          console.log("가맹점 등록:" + r);
          var a = [
            t[0].count,
            o.regnumber,
            o.category_code,
            o.name,
            o.tel,
            o.owner,
            o.birthday,
            o.postcode,
            o.address,
            o.address_detail,
            o.phone,
            o.open,
            o.close,
            o.pause,
            o.resume,
            o.latitude,
            o.longitude,
          ];
          conn.query(r, a, function (e) {
            if (e) console.log("가맹점 등록 오류: " + e);
            else {
              var t =
                "insert into store_contact (regnumber,encode_png) values (?,?)";
              console.log("가맹점 서명 등록: " + t);
              var r = [o.regnumber, o.encode_png];
              conn.query(t, r, function (e) {
                if (e) console.log("가맹점 서명 등록 오류: " + e);
                else {
                  var t =
                    "insert into store_admin (regnumber,password) values (?,?)";
                  console.log("가맹점 점주 계정 생성: " + t);
                  var r = [o.regnumber, o.regnumber.substring(7)];
                  conn.query(t, r, function (e) {
                    e
                      ? console.log("가맹점 점주 계정 생성 오류: " + e)
                      : n.sendStatus(200);
                  });
                }
              });
            }
          });
        }
      });
  },
  storeUpdate: function (e, n) {
    var o = e.body,
      t =
        "update store set category_code=?,name=?,tel=?,owner=?,birthday=?,postcode=?,address=?,address_detail=?,phone=?,open=?,close=?,pause=?,resume=?,latitude=?,longitude=? where regnumber=?";
    console.log("가맹점 수정: " + t);
    var r = [
      o.category_code,
      o.name,
      o.tel,
      o.owner,
      o.birthday,
      o.postcode,
      o.address,
      o.address_detail,
      o.phone,
      o.open,
      o.close,
      o.pause,
      o.resume,
      o.latitude,
      o.longitude,
      o.regnumber,
    ];
    conn.query(t, r, function (e) {
      if (e) console.log("가맹점 수정 오류: " + e);
      else {
        var t = "update store_admin set password=? where regnumber=?";
        console.log("가맹점 점주 계정 수정: " + t);
        var r = [o.regnumber.substring(7), o.regnumber];
        conn.query(t, r, function (e) {
          e
            ? console.log("가맹점 점주 계정 수정 오류: " + e)
            : n.sendStatus(200);
        });
      }
    });
  },
  introRegist: function (e, n) {
    var o = e.body,
      t = "update store set explan=?,introduce=? where regnumber=?";
    console.log("가맹점 소개 등록: " + t);
    var r = [o.explan, o.introduce, o.regnumber];
    conn.query(t, r, function (t) {
      if (t) console.log("가맹정 소개 등록 오류: " + t);
      else if (null != e.file) {
        var r = "select count(*) as boolean from store_image where regnumber=?";
        console.log("가맹점 이미지 조회: " + r);
        var a = [o.regnumber];
        conn.query(r, a, function (t, r) {
          if (t) console.log("가맹점 이미지 조회 오류: " + t);
          else if (1 == r[0].boolean) {
            var a =
              "update store_image set savefolder=?,savefile=?,filetype=? where regnumber=?";
            console.log("가맹점 이미지 수정: " + a);
            var s = [
              e.file.destination,
              e.file.filename,
              e.file.mimetype,
              o.regnumber,
            ];
            conn.query(a, s, function (e) {
              e
                ? console.log("가맹점 이미지 수정 오류: " + e)
                : n.sendStatus(200);
            });
          } else {
            var a =
              "insert into store_image(regnumber,savefolder,savefile,filetype) values(?,?,?,?)";
            console.log("가맹점 이미지 등록: " + a);
            var s = [
              o.regnumber,
              e.file.destination,
              e.file.filename,
              e.file.mimetype,
            ];
            conn.query(a, s, function (e) {
              e
                ? console.log("가맹점 이미지 등록 오류: " + e)
                : n.sendStatus(200);
            });
          }
        });
      } else n.sendStatus(200);
    });
  },
  breakUpdate: function (e, n) {
    var o = e.body,
      t = "update store set pause=?,resume=? where regnumber=?";
    console.log("가맹점 쉬는시간 수정: " + t);
    var r = [o.pause, o.resume, o.regnumber];
    conn.query(t, r, function (e) {
      e ? console.log("가맹점 쉬는시간 수정 오류: " + e) : n.sendStatus(200);
    });
  },
  holidayUpdate: function (e, n) {
    var o = e.body,
      t = "update store set holiday=? where regnumber=?";
    console.log("가맹점 휴무일 수정: " + t);
    var r = [o.holiday, o.regnumber];
    conn.query(t, r, function (e) {
      e ? console.log("가맹점 휴무일 수정 오류: " + e) : n.sendStatus(200);
    });
  },
  storeActive: function (e, n) {
    var o = e.body;
    if (!1 == o.boolean) {
      var t = "update store set active='n' where code=?";
      console.log("가맹점 비활성화: " + t);
      var r = [o.code];
      conn.query(t, r, function (e) {
        e ? console.log("가맹점 비활성화 오류: " + e) : n.sendStatus(200);
      });
    } else {
      var t = "update store set active='y' where code=?";
      console.log("가맹점 활성화: " + t);
      var r = [o.code];
      conn.query(t, r, function (e) {
        e ? console.log("가맹점 활성화 오류: " + e) : n.sendStatus(200);
      });
    }
  },
  getStoreSign: function (e, n) {
    var o = "select * from store_contact where regnumber=" + e.params.regnumber;
    console.log("가맹점 서명 출력: " + o),
      conn.query(o, function (o, t) {
        if (o) console.log("가맹점 서명 출력 오류: " + o);
        else if (0 != t.length)
          try {
            let r = new Buffer.from(t[0].encode_png, "base64");
            n.writeHead(200, { "Context-Type": "text/html" }), n.end(r);
          } catch (a) {
            "ERR_INVALID_ARG_TYPE" == a.code
              ? console.log(e.params.code + "의 서명 없음")
              : (console.log(e.params.code + "의 Buffer 오류: "),
                console.log(a.code));
          }
        else n.send(e.params.regnumber + "의 서명 없음");
      });
  },
  getStoreImg: function (e, n) {
    var o = "select * from store_image where regnumber=" + e.params.regnumber;
    console.log("가맹점 이미지 출력: " + o),
      conn.query(o, function (e, o) {
        e
          ? console.log("가맹점 이미지 출력 오류: " + e)
          : 0 != o.length
          ? fs.readFile("uploads/" + o[0].savefile, function (e, o) {
              n.writeHead(200, { "Context-Type": "text/html" }), n.end(o);
            })
          : n.sendStatus(200);
      });
  },
  getStore: function (e, n) {
    var o = "select * from store";
    console.log("가맹점 전체 출력: " + o),
      conn.query(o, function (e, o) {
        e ? console.log("가맹점 전체 출력 오류: " + e) : n.send(o);
      });
  },
  getStoreDetail: function (e, n) {
    var o = e.body,
      t = "select * from store where code=? and active='y'";
    console.log("가맹점 상세 출력: " + t);
    var r = [o.storecode];
    conn.query(t, r, function (e, o) {
      e ? console.log("가맹점 상세 출력 오류: " + e) : n.send(o[0]);
    });
  },
  getStoreCategory: function (e, n) {
    var o = e.body;
    if (0 == o.category_code) {
      var t = "select * from store where active='y'";
      console.log("가맹점 출력: " + t),
        conn.query(t, function (e, o) {
          e ? console.log("가맹점 출력 오류: " + e) : n.send(o);
        });
    } else {
      var t = "select * from store where category_code=? and active='y'";
      console.log("품목별 가맹점 출력: " + t);
      var r = [o.category_code];
      conn.query(t, r, function (e, o) {
        e ? console.log("품목별 가맹점 출력 오류: " + e) : n.send(o);
      });
    }
  },
  getStoreReg: function (e, n) {
    var o = e.body,
      t = "select * from store where regnumber=?";
    console.log("사업주 가맹점 출력: " + t);
    var r = [o.regnumber];
    conn.query(t, r, function (e, o) {
      e ? console.log("사업주 가맹점 출력 오류: " + e) : n.send(o[0]);
    });
  },
  getStoreLink: function (e, n) {
    var o = e.body,
      t = "select * from store where link_code=? and active='y'";
    console.log("연결된 가맹점 출력: " + t);
    var r = [o.link_code];
    conn.query(t, r, function (e, o) {
      e ? console.log("연결된 가맹점 출력 오류: " + e) : n.send(o[0]);
    });
  },
  getStoreInstall: function (e, n) {
    var o = e.body;
    if (0 == o.category)
      switch (o.install) {
        case !0:
          var t = "select * from store where link_code is not null";
          console.log("설치된 가맹점 출력: " + t),
            conn.query(t, function (e, o) {
              e ? console.log("설치된 가맹점 출력  오류: " + e) : n.send(o);
            });
          break;
        case !1:
          var t = "select * from store where link_code is null";
          console.log("미설치된 가맹점 조회: " + t),
            conn.query(t, function (e, o) {
              e ? console.log("미설치된 가맹점 출력 오류: " + e) : n.send(o);
            });
          break;
        default:
          this.getStore(e, n);
      }
    else
      switch (o.install) {
        case !0:
          var t =
            "select * from store where category_code=? and link_code is not null ";
          console.log("설치된 품목별 가맹점 출력: " + t);
          var r = [o.category];
          conn.query(t, r, function (e, o) {
            e ? console.log("설치된 품목별 가맹점 출력 오류: " + e) : n.send(o);
          });
          break;
        case !1:
          var t =
            "select * from store where category_code=? and link_code is null";
          console.log("미설치된 품목별 가맹점 출력  오류: " + t);
          var r = [o.category];
          conn.query(t, r, function (e, o) {
            e
              ? console.log("미설치된 품목별 가맹점 출력 오류: " + e)
              : n.send(o);
          });
          break;
        default:
          var t = "select * from store where category_code=?";
          console.log("품목별 가맹점 출력: " + t);
          var r = [o.category];
          conn.query(t, r, function (e, o) {
            e ? console.log("품목별 가맹점 출력 오류: " + e) : n.send(o);
          });
      }
  },
  getStoreControl: function (e, n) {
    var o = e.body;
    if (0 == o.category)
      switch (o.install) {
        case !0:
          var t =
            "select * from store where latitude between ? and ? and longitude between ? and ? and link_code is not null";
          console.log("설치된 좌표별 가맹점 출력: " + t);
          var r = [o.weLatitude, o.neLatitude, o.weLongitude, o.neLongitude];
          conn.query(t, r, function (e, o) {
            e ? console.log("설치된 좌표별 가맹점 출력 오류: " + e) : n.send(o);
          });
          break;
        case !1:
          var t =
            "select * from store where latitude between ? and ? and longitude between ? and ? and link_code is null";
          console.log("미설치된 좌표별 가맹점 출력: " + t);
          var r = [o.weLatitude, o.neLatitude, o.weLongitude, o.neLongitude];
          conn.query(t, r, function (e, o) {
            e
              ? console.log("미설치된 좌표별 가맹점 출력 오류: " + e)
              : n.send(o);
          });
          break;
        default:
          var t =
            "select * from store where latitude between ? and ? and longitude between ? and ?";
          console.log("좌표별 가맹점 출력: " + t);
          var r = [o.weLatitude, o.neLatitude, o.weLongitude, o.neLongitude];
          conn.query(t, r, function (e, o) {
            e ? console.log("좌표별 가맹점 출력 오류: " + e) : n.send(o);
          });
      }
    else
      switch (o.install) {
        case !0:
          var t =
            "select * from store where latitude between ? and ? and longitude between ? and ? and category_code=? and link_code is not null ";
          console.log("설치된 해당 품목의 좌표별 가맹점 출력: " + t);
          var r = [
            o.weLatitude,
            o.neLatitude,
            o.weLongitude,
            o.neLongitude,
            o.category,
          ];
          conn.query(t, r, function (e, o) {
            e
              ? console.log("설치된 해당 품목의 좌표별 가맹점 출력 오류: " + e)
              : n.send(o);
          });
          break;
        case !1:
          var t =
            "select * from store where latitude between ? and ? and longitude between ? and ? and category_code=? and link_code is null";
          console.log("미설치된 해당 품목의 좌표별 가맹점 출력: " + t);
          var r = [
            o.weLatitude,
            o.neLatitude,
            o.weLongitude,
            o.neLongitude,
            o.category,
          ];
          conn.query(t, r, function (e, o) {
            e
              ? console.log(
                  "미설치된 해당 품목의 좌표별 가맹점 출력 오류: " + e
                )
              : n.send(o);
          });
          break;
        default:
          var t =
            "select * from store where latitude between ? and ? and longitude between ? and ? and category_code=?";
          console.log("해당 품목의 좌표별 가맹점 출력: " + t);
          var r = [
            o.weLatitude,
            o.neLatitude,
            o.weLongitude,
            o.neLongitude,
            o.category,
          ];
          conn.query(t, r, function (e, o) {
            e
              ? console.log("해당 품목의 좌표별 가맹점 출력 오류: " + e)
              : n.send(o);
          });
      }
  },
};

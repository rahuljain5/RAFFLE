const models = require("../models");
const helper = require("../utils/helper");
const crypto = require("../utils/crypto");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const mailer = require("../utils/mailer");
var moment = require("moment");
const redis = require("../services/redis")
const min = config.forgotexpiry
const loginTtl = config.loginTtl
const forgotpasswordcontent = require("../utils/constants").forgotpasswordcontent
const response = require("../utils/constants").responses
var jwt = require("jsonwebtoken");
const R = require("ramda")

const senduserdetails = (req, callback) => {
  const session = req.get("X-SESSION-KEY");
  try {
    var val = jwt.verify(session, config.jwtKey);
    redis.get(val.session, (err, reply) => {
      if (reply) {
        val = helper.clean(val, ["id", "totpsecret", "session", "iat", "exp", "rememberme"]);
        var res = response.USER_DATA;
        res.data = val;
        callback(res);
      } else {
        callback(response.E11);
      }
    });
  } catch (err) {
    console.log(err);
    callback(response.E11);
  }
}

const register = (state, callback) => {
  state["id"] = helper.getuuid();
  state.password = crypto.gethash(state.password + "|" + state.id);
  models.User.create(state).then((val) => {
    console.log("Insert Query Response :" + JSON.stringify(val));
    var res = response["REGISTERED"];
    val.dataValues["rememberme"] = false;
    val.dataValues["session"] = helper.getuuid();
    console.log("RegisterRedis : = " + val.dataValues.session + " " + val.dataValues.id + " " + loginTtl)
    redis.setex(val.dataValues.session, val.dataValues.id, loginTtl);
    val.dataValues = helper.clean(val.dataValues, ["createdAt", "id", "totpsecret", "updatedAt", "password", "token"]);
    res.SESSION_KEY = jwt.sign(val.dataValues, config.jwtKey, {
      expiresIn: config.loginTtl
    })
    res.is2FAEnable = val.dataValues["isotpenabled"];
    console.log("SENT RESPONSE:" + JSON.stringify(res));
    callback(res)
  }).catch((err) => {
    if (R.path(["errors", "0", "path"], err) == "username")
      callback(response["E03"]);
    else if (R.path(["errors", "0", "path"], err) == "email")
      callback(response["E04"]);
    else
      callback(response.E05);
  })
}

const login = (state, callback) => {
  models.User.findOne({
    where: {
      $or: [{
          email: {
            $eq: state.email
          }
        },
        {
          username: {
            $eq: state.username,
          }
        }
      ]
    }
  }).then((val) => {
    console.log("Select Query Response :" + JSON.stringify(val));
    var res = response["LOGIN"];
    state.password = crypto.gethash(state.password + "|" + val.dataValues.id);
    if (state.password === val.dataValues.password) {
      val.dataValues["rememberme"] = state.rememberme;
      val.dataValues["session"] = helper.getuuid();
      redis.setex(val.dataValues.session, val.dataValues.id, loginTtl);
      if (val.dataValues.isotpenabled)
        redis.setex(val.dataValues.session + "_totpsecret", val.dataValues.totpsecret, loginTtl);
      val.dataValues = helper.clean(val.dataValues, ["createdAt", "id", "totpsecret", "updatedAt", "password", "token"]);
      res.is2FAEnable = val.dataValues["isotpenabled"];
      if (state.rememberme)
        res.SESSION_KEY = jwt.sign(val.dataValues, config.jwtKey);
      else
        res.SESSION_KEY = jwt.sign(val.dataValues, config.jwtKey, {
          expiresIn: config.loginTtl
        });
      console.log("SENT RESPONSE:" + JSON.stringify(res));
      callback(res)
    } else {
      callback(response.E01);
    }
  }).catch((err) => {
    console.log(err);
    callback(response.E01);
  })
}

const logout = (sessionkey, callback) => {
  try {
    var val = jwt.verify(sessionkey, config.jwtKey);
    redis.del(val.session, function(err, res) {
      if (res == 1) {
        callback(response["LOGOUT"]);
      } else {
        if (err) {
          console.error("Erorr:" + err);
        }
        callback(response.E05);
      }
    });
  } catch (err) {
    console.error("Erorr:" + err);
    callback(response.E05);
  }
}
const forgotpasswordinit = (state, callback) => {
  models.User.findOne({
    where: {
      email: state.email,
    }
  }).then((val) => {
    if (val.dataValues.email == state.email) {
      const otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
      console.log("Email: " + state.email + " OTP : " + otp); // Remove it in Produciton
      var forgotpasswordcontenttemp = forgotpasswordcontent.replace(/####/g, otp)
      forgotpasswordcontenttemp = forgotpasswordcontenttemp.replace(/@@@@/g, val.dataValues.username)
      forgotpasswordcontenttemp = forgotpasswordcontenttemp.replace(/%%%%/g, min)
      const subject = "Request to reset your Raffle password"
      mailer.sendmail(state.email, subject, forgotpasswordcontenttemp)
      models.User.update({
        "token": crypto.gethash(otp)
      }, {
        where: {
          "email": state.email
        }
      }).then((val) => {
        callback(response.INITIED)
      }).catch((err) => {
        console.error("Erorr:" + err);
        callback(response.E05)
      })
    } else
      callback(response.E02)
  }).catch((err) => {
    console.error("Erorr:" + err);
    callback(response.E02)
  })
}


const forgotpassword = (state, callback) => {
  var now = moment();
  const currentTime = now;
  if (state.password === state.confirm_password) {
    models.User.findOne({
      where: {
        token: crypto.gethash(state.otp)
      }
    }).then((val) => {
      val = val.dataValues;
      console.log(state.otp);
      let id = val.id;
      var lastupdatetime = moment(val.updatedAt);
      var duration = moment.duration(currentTime.diff(lastupdatetime));
      var dif = duration.asMinutes()
      if (dif > min) {
        models.User.update({
          token: null
        }, {
          where: {
            id: id
          }
        }).then((val) => {
          callback(response["E10"]);
        }).catch((err) => {
          console.error("Erorr:" + err);
          callback(response.E05)
        })
      } else {
        models.User.update({
          password: crypto.gethash(state.password + "|" + val.id),
          token: null
        }, {
          where: {
            id: id
          }
        }).then((val) => {
          callback(response["CHANGE_SUCCESS"])
        }).catch((err) => {
          console.error("Erorr:" + err);
          callback(response.E05)
        })
      }
    }).catch((err) => {
      console.error("Erorr:" + err);
      callback(response["E08"]);
    });
  } else {
    callback(response["E09"]);
  }
}
exports.senduserdetails = senduserdetails;
exports.login = login;
exports.logout = logout;
exports.register = register;
exports.forgotpassword = forgotpassword;
exports.forgotpasswordinit = forgotpasswordinit;
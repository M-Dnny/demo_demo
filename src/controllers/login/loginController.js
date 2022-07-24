var express = require("express");
var session = require("express-session");
var md5 = require("md5");
const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");
const Logger = require("../../helper/loggerService");
const logger = new Logger("login");
const nodemailer = require("nodemailer");
var validator = require("../../helper/validate");
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const moment = require("moment");
var model = require("../../models/model");

async function UpdateLoginData(req, res) {
  return new Promise(async function (resolve, reject) {
    let now = moment();
    let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
    let obj = {};
    obj.last_login_dt = todays_dt;

    let query = "UPDATE `user` SET ? WHERE email=? and status=?";
    let data = [obj, req.body.email, ACTIVE_STATUS];
    let result1 = await model.QueryPostData(query, data, res);
    if (result1) {
      resolve(result1);
    } else {
      resolve([]);
    }
  });
}

const Login = async (req, res) => {
  const validationRule = {
    user_id: "required",
    password: "required",
  };
  validator(req.body, validationRule, {}, async (err, status) => {
    console.log(status);
    if (!status) {
      res.send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      try {
        let now = moment();
        let query =
          "SELECT * FROM `user` WHERE (email = ? or mobile_number=?) and password=? and status=? and role=?";
        let data = [
          req.body.user_id,
          req.body.user_id,
          md5(req.body.password),
          ACTIVE_STATUS,
          "customer",
        ];

        let result = await model.QueryListData(query, data, res);
        console.log(result);

        if (result && result.length) {
          console.log("req.body");
          console.log(req.body);
          await UpdateLoginData(req, res);

          var token = jwt.sign(
            { id: result[0].id, role: result[0].role },
            config.secret,
            {
              expiresIn: 86400,
            }
          );
          res.send({
            success: true,
            message: "Login Successfully",
            token: token,
            role: result[0].role,
            data: result,
          });
        } else {
          let query =
            "SELECT * FROM `user` WHERE (email=? or mobile_number=?) and status=?";
          data = [req.body.user_id, req.body.user_id, ACTIVE_STATUS];
          let result_acc_check = await model.QueryListData(query, data, res);

          if (
            result_acc_check &&
            typeof result_acc_check !== "undefined" &&
            result_acc_check.length > 0
          ) {
            logger.info("Invalid mobile number/email or password..!!");
            res.send({
              success: false,
              message: "Invalid mobile number/email or password..!!",
              data: [],
            });
          } else {
            logger.info("Account not found, Please register");
            res.send({
              success: false,
              message: "Account not found, please register",
              data: [],
            });
          }
        }
      } catch (error) {
        res.send({
          success: false,
          message: "Something went wrong",
          data: error.message,
        });
      }
    }
  });
};

module.exports = { Login };

const Logger = require("../../helper/loggerService");
var model = require("./../../models/model");
var md5 = require("md5");
const moment = require("moment");
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
var validator = require("./../../helper/validate");

const Register = async (req, res) => {
  const validationRule = {
    full_name: "required",
    email: "required",
    mobile_number: "required",
    role: "required",
    password: "required",
  };
  validator(req.body, validationRule, {}, async (err, status) => {
    if (!status) {
      res.send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      try {
        let now = moment();
        let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
        let check1 = await model.CheckUnique(
          `email`,
          `user`,
          req.body.email.trim(),
          res
        );
        let check2 = await model.CheckUnique(
          `mobile_number`,
          `user`,
          req.body.mobile_number.trim(),
          res
        );

        if (check1 && check2) {
          let client_data = {};

          client_data.full_name = req.body.full_name;
          client_data.email = req.body.email;
          client_data.mobile_number = req.body.mobile_number;
          client_data.password = md5(req.body.password);
          client_data.role = req.body.role;
          client_data.add_by = req.logged_in_id;
          client_data.add_dt = todays_dt;
          client_data.status = ACTIVE_STATUS;

          let query = "INSERT INTO `user` SET ?";
          let data = [client_data];
          try {
            let result1 = await model.QueryListDataNew(query, data, res);
            if (
              result1 &&
              typeof result1 !== "undefined" &&
              result1.affectedRows
            ) {
              res.send({
                success: true,
                message: "Register successfully",
                data: [],
              });
            } else {
              res.send({
                success: false,
                message: "Register unsuccessfull!!",
                data: [],
              });
            }
          } catch (error) {
            res.send({
              success: false,
              message: "something went wrong",
              data: error,
            });
          }
        } else {
          res.send({
            success: false,
            message: "Email ID and Mobile No must be unique",
            data: [],
          });
        }
      } catch (error) {
        res.send({
          success: false,
          message: "something went wrong",
          data: error,
        });
      }
    }
  });
};

module.exports = { Register };

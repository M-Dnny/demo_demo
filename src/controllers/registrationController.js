
const Logger = require('./../helper/loggerService');
const logger = new Logger('customerMobRegister');
var model = require('./../models/model');
var md5 = require('md5');

const moment = require('moment');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;

var validator = require('./../helper/validate');
const { check, validationResult } = require('express-validator');

module.exports = {

  Register: async (req, res) => {
    const validationRule = {
      'name': 'required',
      'email_id': 'required',
      'mobile_no': 'required',
      'role': 'required',
      'password': 'required'

    }
    validator(req.body, validationRule, {}, async (err, status) => {
      console.log(status);
      if (!status) {
        res.send({
          success: false,
          message: 'Validation failed',
          data: err
        });
      }
      else {
        try {
          let now = moment();
          let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
          let check1 = await model.CheckUnique(`email_id`, `user`, req.body.email_id.trim(), res);
          let check2 = await model.CheckUnique(`mobile_no`, `user`, req.body.mobile_no.trim(), res);
          if (check1 && check2) {
            let client_data = {};

            client_data.company_name = req.body.name;
            client_data.email_id = req.body.email_id;
            client_data.mobile_no = req.body.mobile_no;
            // client_data.password= md5(Math.floor(1000 + Math.random() * 9000));
            client_data.password = md5(req.body.password);
            client_data.role = req.body.role;
            client_data.add_by = req.logged_in_id;
            client_data.add_dt = todays_dt;
            client_data.status = ACTIVE_STATUS;

            let query = "INSERT INTO `user` SET ? ";
            let data = [client_data];
            try {
              let result1 = await model.QueryPostDataNew(query, data, res);
              if (result1 && typeof result1 !== "undefined" && result1.affectedRows) {
                res.send({
                  success: true,
                  message: 'Client Added successfully..!',
                  data: []
                });
              }
              else {
                res.send({
                  success: false,
                  message: 'Client Not Added successfully..!',
                  data: []
                });

              }
            }
            catch (error) {
              // console.log("Shree Err Msg....................");
              res.send({
                success: false,
                message: 'Something Went Wrong..!',
                data: error
              });
            }

          } else {
            res.send({
              success: false,
              message: 'Email Id & Mobile No must be unique',
              data: []
            });
          }
        } catch (error) {
          // console.log(e.message);
          res.send({
            success: false,
            message: 'Something Went Wrong...',
            data: error.message
          });
        }
      }
    });

  },

  
}
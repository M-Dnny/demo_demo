const sql = require('./../../src/config/conn');
const mongoose = require('mongoose');


var otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
      },
      code: {
        type: String,
        required: true,
      },
      expireIn: {
        type: Number,
        required: true
      }
},{
    timestamps:true
})

let otp=mongoose.model('otp',otpSchema,'otp');

module.exports=otp;



// const moment = require('moment');
// const now = moment();
// const Logger = require('../../src/helper/loggerService');
// const logger = new Logger('Model');
// var path = require('path');
// var handlebars =require('handlebars');
// const UploadLink = process.env.HOST+process.env.PORT+'/';
// const WEB_URL = process.env.WEB_URL; 
// const request = require('request');
// const { stringify } = require('querystring');
// const ACTIVE_STATUS=process.env.ACTIVE_STATUS;
// const IN_ACTIVE_STATUS=process.env.IN_ACTIVE_STATUS;
// const this_=this;
// const ProductsUploadLink =process.env.HOST+process.env.PORT+'/uploads/products/';

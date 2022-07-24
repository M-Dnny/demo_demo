var express = require('express');
var router = express.Router();
var forgetpasswordController= require('./../../../src/controllers/api/forgetpasswordController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');

router.post('/forget_password',auth.verifyToken, forgetpasswordController.ResetPasswordEmail);

// router.post('/bid_getinfo', customerController.Edit);
// bid_list_by_bidder_id



module.exports = router;
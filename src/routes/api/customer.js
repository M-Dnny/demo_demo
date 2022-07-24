var express = require('express');
var router = express.Router();
var customerController= require('./../../../src/controllers/api/customerController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');


// router.post('/bid_list_by_customer_id', customerController.BidListByCustomerId);

router.post('/update_bid_status',auth.verifyToken, customerController.UpdateBidStatus);

router.post('/bid_getinfo',auth.verifyToken, customerController.Edit);

router.post('/delete_bid',auth.verifyToken, customerController.Delete);
// bid_list_by_bidder_id

router.post('/list_myads',auth.verifyToken, customerController.ListMyAds);

module.exports = router;

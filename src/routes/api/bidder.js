var express = require('express');
var router = express.Router();
var bidderController= require('./../../../src/controllers/api/bidderController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');


router.post('/bid_list_by_bidder_id',auth.verifyToken,  bidderController.BidListByBidderId);

router.post('/add_bid',auth.verifyToken, bidderController.AddBid);

router.post('/bid_getinfo',auth.verifyToken, bidderController.Edit);

// router.post('/update', bidderController.Update);

router.post('/delete_bid',auth.verifyToken, bidderController.Delete);

router.post('/bidlist_by_productid',auth.verifyToken, bidderController.BidListByProductId);
router.post('/award_bid',auth.verifyToken, bidderController.AwardBid);
module.exports = router;

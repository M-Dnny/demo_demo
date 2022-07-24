var express = require('express');
var router = express.Router();
var NotificationController= require('./../../../src/controllers/api/notificationController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');



router.get('/notify_liveads', NotificationController.NotifyLiveAds);

module.exports = router;
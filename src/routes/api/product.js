var express = require('express');
var router = express.Router();
var productController= require('./../../../src/controllers/api/productController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');

router.get('/list',productController.List);

router.post('/add', productController.Add);
router.post('/golive', productController.AddLive);
// router.post('/getInfo', cache.get, productController.Edit,cache.set);
router.post('/getinfo',productController.Edit);

router.post('/update', productController.Update);

router.post('/delete', productController.Delete);

router.post('/delete_product_imgs', productController.DeleteProductImgs);


module.exports = router;
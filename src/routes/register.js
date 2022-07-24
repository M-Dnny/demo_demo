var express = require("express");
const { Register } = require("../controllers/register/registerController");
var router = express.Router();
// var registrationController= require('./../../src/controllers/registrationController.js');

const auth = require("./../../src/config/auth");

// router.post('/', registrationController.Register);

router.post("/", Register);

module.exports = router;

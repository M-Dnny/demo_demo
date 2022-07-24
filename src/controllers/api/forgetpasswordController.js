const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('forgetpassword');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
// const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
// const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;

const moment = require('moment');


module.exports = {
    ResetPasswordEmail: async (req, res) => {
		const validationRule = {
			'email': 'required'
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
					// let now = moment();
					// let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
					// let products_data = {};

					// products_data.name = req.body.name;
					// products_data.title = req.body.title;
					// products_data.description = req.body.description;
					// products_data.keywords = req.body.keywords;
					// products_data.category_id = req.body.category_id;
					// products_data.sub_category_id = req.body.sub_category_id;
					// products_data.brand_id = req.body.brand_id;
					// products_data.model_id = req.body.model_id;
					// products_data.country_id = req.body.country_id;
					// products_data.city_id = req.body.city_id;
					// products_data.auction_type = req.body.auction_type;
					// products_data.start_date_time = req.body.start_date_time;
					// // products_data.end_date_time = req.body.end_date_time;
					// products_data.starting_price = req.body.starting_price;
					// products_data.refund = req.body.refund;
					// products_data.refund_days = req.body.refund_days;
					// products_data.add_by = req.logged_in_id;
					// products_data.add_dt = todays_dt;
					// products_data.status = ACTIVE_STATUS;

					
					// if (req.body.start_time && req.body.start_time != 'undefined' && req.body.start_time != '') {
					// 	products_data.start_time = req.body.start_time;
					// }
					// if (req.body.end_time && req.body.end_time != 'undefined' && req.body.end_time != '') {
					// 	products_data.end_time = req.body.end_time;
					// }

					// if (req.role && req.role !== 'undefined' && req.role !== '' && req.role == ADMIN_ROLE) {
					// 	products_data.product_status = ACTIVE_PRODUCT;
					// }
					// if (req.body.zoom_link && req.body.zoom_link != 'undefined' && req.body.zoom_link != '') {
					// 	products_data.zoom_link = req.body.zoom_link;
					// }
					// if (req.body.end_date_time && req.body.end_date_time !== 'undefined' && req.body.end_date_time !== '' ) {
					// 	products_data.end_date_time = req.body.end_date_time;
					// }
					// if (req.body.year_id && req.body.year_id !== 'undefined' && req.body.year_id !== '') {
					// 	products_data.year_id = req.body.year_id;
					// }
					


					// if (req.files && req.files.video) {
					// 	var element = req.files.video;
					// 	var image_name = now.format("YYYYMMDDHHmmss") + element.name;
					// 	element.mv('./public/uploads/products/' + image_name);
					// 	products_data.video = image_name;
					// }

					let query = "SELECT * FROM user WHERE email_id='?'";
					let data = [req.body.email_id];
					let result = await model.QueryListData(query, data, res);
					if (result && result.length > 0) {
						// query = "SELECT product_img_id,Concat(?, CASE WHEN product_img  != '' THEN  Concat(product_img ) end) as product_img FROM product_imgs WHERE product_id=? and status=?";
						// data = [ProductsUploadLink, result[0]['product_id'], ACTIVE_STATUS];
						// result[0]['product_img_list'] = await model.QueryListData(query, data, res);

						res.send({
							success: true,
							message: '',
							data: result
						});
					}
					else
						res.send({
							success: false,
							message: '',
							data: []
						});
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

	}

}
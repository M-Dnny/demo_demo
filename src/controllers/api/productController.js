const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('products');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;
const ACTIVE_PRODUCT = process.env.ACTIVE_PRODUCT;

const ProductsUploadLink = process.env.HOST + process.env.PORT + '/uploads/products/';

const moment = require('moment');

async function GetProductFirstImg(result, res) {
	return new Promise(async function (resolve, reject) {
		for (let i = 0; i < result.length; i++) {
			result[i]['product_img'] = await model.GetProductFirstImg(result[i]['product_id']);
		}
		resolve(result);
	});
}

module.exports = {
	List: async (req, res) => {
		try {
			let query = "SELECT p.product_id,totalbids.bidCount,p.category_id,p.sub_category_id,p.brand_id,b.brand_name,p.model_id,m.model_name,p.year_id,p.starting_price,p.country_id,co.country_name,p.city_id,ci.city_name,p.title,p.name,p.auction_type, DATE_FORMAT(p.start_date_time,'%d-%m-%Y') as start_date_time,	TIME_FORMAT(p.start_time,'%h:%i %p') as start_time, DATE_FORMAT(p.end_date_time,'%d-%m-%Y') as end_date_time, TIME_FORMAT(p.end_time,'%h:%i %p') as end_time FROM products p LEFT JOIN country co ON co.country_id=p.country_id LEFT JOIN city ci ON ci.city_id=p.city_id LEFT JOIN brand b ON b.brand_id=p.brand_id LEFT JOIN model m ON m.model_id=p.model_id LEFT JOIN (select count(b1.bid_id) as bidCount,b1.product_id from bids b1 group by b1.product_id) as totalbids on totalbids.product_id = p.product_id WHERE p.status=?";

			let data = [ACTIVE_STATUS];
			if (req.query.name && req.query.name != '') {
				query += ' and p.name like ?';
				data.push('%#' + req.query.name + '%');
			}
			if (req.query.max_price_filter && req.query.max_price_filter != ''  && req.query.max_price_filter != 0) {
				query += ' and p.starting_price <= ?';
				data.push(req.query.max_price_filter);
			}
			if (req.query.product_id && req.query.product_id != '') {
				let proid_arr= req.query.product_id.split(',');
				query += " and p.product_id in (?)";
				data.push(proid_arr);
				// query += ' and product_id in ?';
				// data.push('%#' + req.query.product_id + '%');
			}
			
			if (req.query.category_id && req.query.category_id != '') {				
				let cat_arr= req.query.category_id.split(',');
				query += " and p.category_id in (?)";
				data.push(cat_arr);
			}
			if(req.query.sub_category_id && req.query.sub_category_id!='')
			{
				let subcat_arr= req.query.sub_category_id.split(',');
				query+=" and p.sub_category_id in (?)";
				data.push(eval(subcat_arr));
			}

			if (req.query.brand_id && req.query.brand_id != '') {
				let brand_arr= req.query.brand_id.split(',');
				query += " and p.brand_id in (?)";
				data.push(eval(brand_arr));
			}
			if (req.query.model_id && req.query.model_id != '') {
				let model_arr= req.query.model_id.split(',');
				query += " and p.model_id in (?)";
				data.push(eval(model_arr));
			}
			if (req.query.city_id && req.query.city_id != '') {
				let city_arr= req.query.city_id.split(',');
				query += " and p.city_id in (?)";
				data.push(eval(city_arr));
			}
			if (req.query.country_id && req.query.country_id != '') {
				let country_arr= req.query.country_id.split(',');
				query += " and p.country_id in (?)";
				data.push(eval(country_arr));
			}
			if (req.query.auction_type && req.query.auction_type != '') {
				let auc_arr= req.query.auction_type.split(',');
				query += " and p.auction_type=?";
				data.push(eval(auc_arr));
			}
			if (req.query.year_id && req.query.year_id != '') {
				let year_arr= req.query.year_id.split(',');
				query += " and p.year_id in (?)";
				data.push(eval(year_arr));
			}

			// if (req.query.last_id && req.query.last_id > 0) {
			// 	query += " and product_id<?";
			// 	data.push(eval(req.query.last_id));
			// }
			if (req.query.sort_by && req.query.sort_by != '') {
				if (req.query.sort_by == 'low_to_high') {
					query += " ORDER BY p.starting_price DESC";
				}
				else if (req.query.sort_by == 'high_to_low') {
					query += " ORDER BY p.starting_price";
				}
				// else if(req.query.sort_by=='high_to_low')
				// {
				// 	query+=" ORDER BY starting_price";
				// 	data.push(req.query.sort_by);
				// }
				if (req.query.page_records && req.query.page_records > 0) {
					query += ' LIMIT ?';
					data.push(eval(req.query.page_records));
				}

			}
			else {
				if (req.query.page_records && req.query.page_records > 0) {
					query += ' ORDER BY product_id DESC LIMIT ?';
					data.push(eval(req.query.page_records));
				}
				else {
					query += ' ORDER BY product_id DESC';
				}
			}

			let result = await model.QueryListData(query, data, res);
			if (result) {

				result = await GetProductFirstImg(result, res);

				res.send({
					success: true,
					message: 'Successfull',
					data: result
				});
			} else
				res.send({
					success: false,
					message: 'Failed',
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

	},



	Add: async (req, res) => {
		const validationRule = {
			'name': 'required',
			'title': 'required',
			'description': 'required',
			'keywords': 'required',
			'category_id': 'required',
			'sub_category_id': 'required',
			'brand_id': 'required',
			'model_id': 'required',
			'country_id': 'required',
			'city_id': 'required',
			'auction_type': 'required',
			'start_date_time': 'required',
			// 'end_date_time': 'required',
			'starting_price': 'required',
			'refund': 'required'
			// 'refund_days': 'required',
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
					let products_data = {};

					products_data.name = req.body.name;
					products_data.title = req.body.title;
					products_data.description = req.body.description;
					products_data.keywords = req.body.keywords;
					products_data.category_id = req.body.category_id;
					products_data.sub_category_id = req.body.sub_category_id;
					products_data.brand_id = req.body.brand_id;
					products_data.model_id = req.body.model_id;
					products_data.country_id = req.body.country_id;
					products_data.city_id = req.body.city_id;
					products_data.auction_type = req.body.auction_type;
					products_data.start_date_time = req.body.start_date_time;
					// products_data.end_date_time = req.body.end_date_time;
					products_data.starting_price = req.body.starting_price;
					products_data.refund = req.body.refund;
					products_data.refund_days = req.body.refund_days;
					products_data.add_by = req.logged_in_id;
					products_data.add_dt = todays_dt;
					products_data.status = ACTIVE_STATUS;
					products_data.product_status = ACTIVE_PRODUCT;
					
					if (req.body.start_time && req.body.start_time != 'undefined' && req.body.start_time != '') {
						products_data.start_time = req.body.start_time;
					}
					if (req.body.end_time && req.body.end_time != 'undefined' && req.body.end_time != '') {
						products_data.end_time = req.body.end_time;
					}

					// if (req.role && req.role !== 'undefined' && req.role !== '' ) {
					// 	products_data.product_status = ACTIVE_PRODUCT;
					// }
					if (req.body.zoom_link && req.body.zoom_link != 'undefined' && req.body.zoom_link != '') {
						products_data.zoom_link = req.body.zoom_link;
					}
					if (req.body.end_date_time && req.body.end_date_time !== 'undefined' && req.body.end_date_time !== '' ) {
						products_data.end_date_time = req.body.end_date_time;
					}
					if (req.body.year_id && req.body.year_id !== 'undefined' && req.body.year_id !== '') {
						products_data.year_id = req.body.year_id;
					}
					


					if (req.files && req.files.video) {
						var element = req.files.video;
						var image_name = now.format("YYYYMMDDHHmmss") + element.name;
						element.mv('./public/uploads/products/' + image_name);
						products_data.video = image_name;
					}

					let query = "INSERT INTO `products`SET ? ";
					let data = [products_data];
					let result1 = await model.QueryPostData(query, data, res);
					// console.log("Shree");
					console.log(result1);
					if (result1 && typeof result1 !== "undefined" && result1.affectedRows > 0) {
						if (req.files && req.files.product_img && req.files.product_img != '' && req.files.product_img != 'undefined') {
							var product_img = req.files.product_img;
							if (!Array.isArray(product_img)) {
								var temp = product_img;
								product_img = [];
								product_img.push(temp);
							}
							let i = 0;
							product_img.forEach(async element => {
								i++;
								image_name = i + "_" + now.format("YYYYMMDDHHmmss") + element.name;
								element.mv('./public/uploads/products/' + image_name);
								let sub_query = "INSERT INTO `product_imgs`(`product_img`, `product_id`,`status`,`add_dt`,`add_by`) VALUES (?,?,?,?,?)";
								let sub_data = [image_name, result1.insertId, ACTIVE_STATUS, todays_dt, req.logged_in_id];
								await model.QueryPostData(sub_query, sub_data, res);

							});
						}
						res.send({
							success: true,
							message: 'Product Added successfully..!',
							data: []
						});
					}
					else {
						res.send({
							success: false,
							message: 'Product Not Added successfully..!',
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

	AddLive: async (req, res) => {
		const validationRule = {
			// 'name': 'required',
			'title': 'required',
			'description': 'required',
			// 'keywords': 'required',
			// 'category_id': 'required',
			// 'sub_category_id': 'required',
			// 'brand_id': 'required',
			// 'model_id': 'required',
			'country_id': 'required',
			'city_id': 'required',
			'auction_type': 'required',
			'start_date_time': 'required',
			// 'end_date_time': 'required',
			// 'starting_price': 'required',
			// 'refund': 'required'
			// 'refund_days': 'required',
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
					let products_data = {};
					let session_meet_id= 'Harrj'+req.body.title.substring(0,5)+ (Math.floor(Math.random()*90000) + 10000);
					let session_meet_pass= Math.floor(Math.random()*90000) + 10000;
					
					console.log(session_meet_id);
					// products_data.name = req.body.name;
					products_data.title = req.body.title;
					products_data.description = req.body.description;
					// products_data.keywords = req.body.keywords;
					// products_data.category_id = req.body.category_id;
					// products_data.sub_category_id = req.body.sub_category_id;
					// products_data.brand_id = req.body.brand_id;
					// products_data.model_id = req.body.model_id;
					products_data.country_id = req.body.country_id;
					products_data.city_id = req.body.city_id;
					products_data.auction_type = req.body.auction_type;
					products_data.start_date_time = req.body.start_date_time;
					// products_data.end_date_time = req.body.end_date_time;
					// products_data.starting_price = req.body.starting_price;
					// products_data.refund = req.body.refund;
					// products_data.refund_days = req.body.refund_days;
					products_data.meeting_id =session_meet_id;
					products_data.meeting_password =session_meet_pass;
					products_data.add_by = req.logged_in_id;
					products_data.add_dt = todays_dt;
					products_data.status = ACTIVE_STATUS;
					products_data.product_status = ACTIVE_PRODUCT;
					
					if (req.body.start_time && req.body.start_time != 'undefined' && req.body.start_time != '') {
						products_data.start_time = req.body.start_time;
					}
					if (req.body.end_time && req.body.end_time != 'undefined' && req.body.end_time != '') {
						products_data.end_time = req.body.end_time;
					}

					// if (req.role && req.role !== 'undefined' && req.role !== '' ) {
					// 	products_data.product_status = ACTIVE_PRODUCT;
					// }
					if (req.body.zoom_link && req.body.zoom_link != 'undefined' && req.body.zoom_link != '') {
						products_data.zoom_link = req.body.zoom_link;
					}
					if (req.body.end_date_time && req.body.end_date_time !== 'undefined' && req.body.end_date_time !== '' ) {
						products_data.end_date_time = req.body.end_date_time;
					}
					if (req.body.year_id && req.body.year_id !== 'undefined' && req.body.year_id !== '') {
						products_data.year_id = req.body.year_id;
					}
					


					if (req.files && req.files.video) {
						var element = req.files.video;
						var image_name = now.format("YYYYMMDDHHmmss") + element.name;
						element.mv('./public/uploads/products/' + image_name);
						products_data.video = image_name;
					}

					let query = "INSERT INTO `products`SET ? ";
					let data = [products_data];
					let result1 = await model.QueryPostData(query, data, res);
					// console.log("Shree");
					console.log(result1);
					if (result1 && typeof result1 !== "undefined" && result1.affectedRows > 0) {
						if (req.files && req.files.product_img && req.files.product_img != '' && req.files.product_img != 'undefined') {
							var product_img = req.files.product_img;
							if (!Array.isArray(product_img)) {
								var temp = product_img;
								product_img = [];
								product_img.push(temp);
							}
							let i = 0;
							product_img.forEach(async element => {
								i++;
								image_name = i + "_" + now.format("YYYYMMDDHHmmss") + element.name;
								element.mv('./public/uploads/products/' + image_name);
								let sub_query = "INSERT INTO `product_imgs`(`product_img`, `product_id`,`status`,`add_dt`,`add_by`) VALUES (?,?,?,?,?)";
								let sub_data = [image_name, result1.insertId, ACTIVE_STATUS, todays_dt, req.logged_in_id];
								await model.QueryPostData(sub_query, sub_data, res);

							});

						}
						let res_obj={};
							res_obj['meeting_id']=session_meet_id;
							res_obj['metteing_pass']=session_meet_pass;

						res.send({							
							success: true,
							message: 'Product Added successfully..!',
							data: res_obj
						});
					}
					else {
						res.send({
							success: false,
							message: 'Product Not Added successfully..!',
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
	AddLive: async (req, res) => {
		const validationRule = {
			// 'name': 'required',
			'title': 'required',
			'description': 'required',
			// 'keywords': 'required',
			// 'category_id': 'required',
			// 'sub_category_id': 'required',
			// 'brand_id': 'required',
			// 'model_id': 'required',
			'country_id': 'required',
			'city_id': 'required',
			'auction_type': 'required',
			'start_date_time': 'required',
			// 'end_date_time': 'required',
			// 'starting_price': 'required',
			// 'refund': 'required'
			// 'refund_days': 'required',
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
					let products_data = {};
					let session_meet_id= 'Harrj'+req.body.title.substring(0,5)+ (Math.floor(Math.random()*90000) + 10000);
					let session_meet_pass= Math.floor(Math.random()*90000) + 10000;
					
					console.log(session_meet_id);
					// products_data.name = req.body.name;
					products_data.title = req.body.title;
					products_data.description = req.body.description;
					// products_data.keywords = req.body.keywords;
					// products_data.category_id = req.body.category_id;
					// products_data.sub_category_id = req.body.sub_category_id;
					// products_data.brand_id = req.body.brand_id;
					// products_data.model_id = req.body.model_id;
					products_data.country_id = req.body.country_id;
					products_data.city_id = req.body.city_id;
					products_data.auction_type = req.body.auction_type;
					products_data.start_date_time = req.body.start_date_time;
					// products_data.end_date_time = req.body.end_date_time;
					// products_data.starting_price = req.body.starting_price;
					// products_data.refund = req.body.refund;
					// products_data.refund_days = req.body.refund_days;
					products_data.meeting_id =session_meet_id;
					products_data.meeting_password =session_meet_pass;
					products_data.add_by = req.logged_in_id;
					products_data.add_dt = todays_dt;
					products_data.status = ACTIVE_STATUS;
					products_data.product_status = ACTIVE_PRODUCT;
					
					if (req.body.start_time && req.body.start_time != 'undefined' && req.body.start_time != '') {
						products_data.start_time = req.body.start_time;
					}
					if (req.body.end_time && req.body.end_time != 'undefined' && req.body.end_time != '') {
						products_data.end_time = req.body.end_time;
					}

					// if (req.role && req.role !== 'undefined' && req.role !== '' ) {
					// 	products_data.product_status = ACTIVE_PRODUCT;
					// }
					if (req.body.zoom_link && req.body.zoom_link != 'undefined' && req.body.zoom_link != '') {
						products_data.zoom_link = req.body.zoom_link;
					}
					if (req.body.end_date_time && req.body.end_date_time !== 'undefined' && req.body.end_date_time !== '' ) {
						products_data.end_date_time = req.body.end_date_time;
					}
					if (req.body.year_id && req.body.year_id !== 'undefined' && req.body.year_id !== '') {
						products_data.year_id = req.body.year_id;
					}
					


					if (req.files && req.files.video) {
						var element = req.files.video;
						var image_name = now.format("YYYYMMDDHHmmss") + element.name;
						element.mv('./public/uploads/products/' + image_name);
						products_data.video = image_name;
					}

					let query = "INSERT INTO `products`SET ? ";
					let data = [products_data];
					let result1 = await model.QueryPostData(query, data, res);
					// console.log("Shree");
					console.log(result1);
					if (result1 && typeof result1 !== "undefined" && result1.affectedRows > 0) {
						if (req.files && req.files.product_img && req.files.product_img != '' && req.files.product_img != 'undefined') {
							var product_img = req.files.product_img;
							if (!Array.isArray(product_img)) {
								var temp = product_img;
								product_img = [];
								product_img.push(temp);
							}
							let i = 0;
							product_img.forEach(async element => {
								i++;
								image_name = i + "_" + now.format("YYYYMMDDHHmmss") + element.name;
								element.mv('./public/uploads/products/' + image_name);
								let sub_query = "INSERT INTO `product_imgs`(`product_img`, `product_id`,`status`,`add_dt`,`add_by`) VALUES (?,?,?,?,?)";
								let sub_data = [image_name, result1.insertId, ACTIVE_STATUS, todays_dt, req.logged_in_id];
								await model.QueryPostData(sub_query, sub_data, res);

							});

						}
						let res_obj={};
							res_obj['meeting_id']=session_meet_id;
							res_obj['metteing_pass']=session_meet_pass;

						res.send({							
							success: true,
							message: 'Product Added successfully..!',
							data: res_obj
						});
					}
					else {
						res.send({
							success: false,
							message: 'Product Not Added successfully..!',
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

	Edit: async (req, res) => {
		const validationRule = {
			'product_id': 'required'
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
					let query = "SELECT a.*,DATE_FORMAT(a.start_date_time,'%Y-%m-%d') as start_date_time,TIME_FORMAT(a.start_time,'%H:%i') as start_time, Concat(?, CASE WHEN a.video  != '' THEN  Concat(a.video) end) as video,b.category_name,c.brand_name,d.model_name FROM `products` as a left join category as b on a.category_id=b.category_id left join brand as c on a.brand_id=c.brand_id left join model as d on a.model_id=d.model_id left join year as y on a.year_id=y.year_id left join sub_category as e on e.sub_category_id=a.sub_category_id WHERE a.product_id = ? AND a.status=?";
					let data = [ProductsUploadLink, req.body.product_id, ACTIVE_STATUS];
					if (req.body.year_id && req.body.year_id != '') {
						query += " and a.year_id=?";
						data.push(eval(req.body.year_id));
					}
					let result = await model.QueryListData(query, data, res);
					if (result && result.length > 0) {
						query = "SELECT product_img_id,Concat(?, CASE WHEN product_img  != '' THEN  Concat(product_img ) end) as product_img FROM product_imgs WHERE product_id=? and status=?";
						data = [ProductsUploadLink, result[0]['product_id'], ACTIVE_STATUS];
						result[0]['product_img_list'] = await model.QueryListData(query, data, res);

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
	},

	Update: async (req, res) => {
		const validationRule = {
			'product_id': 'required',
			'name': 'required',
			'title': 'required',
			'description': 'required',
			'keywords': 'required',
			'category_id': 'required',
			'sub_category_id': 'required',
			'brand_id': 'required',
			'model_id': 'required',
			'country_id': 'required',
			'city_id': 'required',
			'auction_type': 'required',
			'start_date_time': 'required',
			// 'end_date_time': 'required',
			'starting_price': 'required',
			'refund': 'required'
			// 'refund_days': 'required',
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
					let products_data = {};

					products_data.name = req.body.name;
					products_data.keywords = req.body.keywords;
					products_data.category_id = req.body.category_id;
					products_data.sub_category_id = req.body.sub_category_id;
					products_data.brand_id = req.body.brand_id;
					products_data.model_id = req.body.model_id;
					products_data.country_id = req.body.country_id;
					products_data.city_id = req.body.city_id;
					products_data.title = req.body.title;
					products_data.description = req.body.description;
					products_data.auction_type = req.body.auction_type;
					products_data.start_date_time = req.body.start_date_time;
					// products_data.end_date_time = req.body.end_date_time;
					products_data.starting_price = req.body.starting_price;
					// products_data.high_price = req.body.high_price;
					// products_data.final_price = req.body.final_price;
					products_data.refund = req.body.refund;
					products_data.refund_days = req.body.refund_days;
					products_data.mdf_by = req.logged_in_id;
					products_data.mdf_dt = todays_dt;

					if (req.body.start_time && req.body.start_time != 'undefined' && req.body.start_time != '') {
						products_data.start_time = req.body.start_time;
					}
					if (req.body.end_time && req.body.end_time != 'undefined' && req.body.end_time != '') {
						products_data.end_time = req.body.end_time;
					}
					if (req.body.zoom_link && req.body.zoom_link != 'undefined' && req.body.zoom_link != '') {
						products_data.zoom_link = req.body.zoom_link;
					}
					if (req.body.end_date_time && req.body.end_date_time !== 'undefined' && req.body.end_date_time !== '') {
						products_data.end_date_time = req.body.end_date_time;
					}
					if (req.body.year_id && req.body.year_id != '' && req.body.year_id !== 'undefined') {
						products_data.year_id = req.body.year_id;
					}

					if (req.files && req.files.video) {
						var element = req.files.video;
						var image_name = now.format("YYYYMMDDHHmmss") + element.name;
						element.mv('./public/uploads/products/' + image_name);
						products_data.video = image_name;
					}

					let query = "UPDATE `products` SET ? WHERE product_id=? AND status=?";
					// console.log(query);
					let data = [products_data, req.body.product_id, ACTIVE_STATUS];
					let result = await model.QueryPostData(query, data, res);
					if (result) {
						if (req.files && req.files.product_img && req.files.product_img != '' && req.files.product_img != 'undefined') {
							var product_img = req.files.product_img;
							if (!Array.isArray(product_img)) {
								var temp = product_img;
								product_img = [];
								product_img.push(temp);
							}
							let i = 1;
							// console.log("Shree");
							console.log(product_img);
							product_img.forEach(async element => {
								if (element.name != '') {
									i++;
									image_name = i + "_" + now.format("YYYYMMDDHHmmss") + element.name;
									element.mv('./public/uploads/products/' + image_name);
									let sub_query = "INSERT INTO `product_imgs`(`product_img`, `product_id`,`status`,`add_dt`,`add_by`) VALUES (?,?,?,?,?)";
									let sub_data = [image_name, req.body.product_id, ACTIVE_STATUS, todays_dt, req.logged_in_id];
									await model.QueryPostData(sub_query, sub_data, res);

								}

							});
						}
						res.send({
							success: true,
							message: 'Product updated successfully..!',
							data: []
						});
					} else {
						res.send({
							success: false,
							message: 'Product updated Unsuccessfull..!',
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


	Delete: async (req, res) => {
		const validationRule = {
			'product_id': 'required'
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
					let query = "UPDATE `products` SET `status` =?, `mdf_by`=?,`mdf_dt`=? WHERE `product_id` = ?";
					let data = [IN_ACTIVE_STATUS, req.logged_in_id, todays_dt, req.body.product_id];

					let result = await model.QueryPostData(query, data, res);
					if (result) {

						return res.send({
							success: true,
							message: 'Product Deleted successfully..!',
							data: []
						});
					} else {
						return res.send({
							success: false,
							message: 'Product Deleted Unsuccessfull..!',
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

	DeleteProductImgs: async (req, res) => {
		const validationRule = {
			'product_img_id': 'required'
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
					
					let query1 = "Select product_img from product_imgs WHERE product_img_id=?";
					// console.log("day00");
					let result = await model.QueryListData(query1, [req.body.product_img_id], res);

					if (result) {
							// console.log(result[0].product_img);
							// console.log(Productsfolderpath+result[0].product_img);
							var flag=0;
							fs.unlink(Productsfolderpath+result[0].product_img, (err => {
								if (err){
									console.log(err);
									flag=1;									
								} 
								else {
								  console.log("\nDeleted file:" + result[0].product_img);
								//   console.log("day4");							  
								}
							  }));
							  let query= "Delete from product_imgs WHERE product_img_id=?";
							let result1 = await model.QueryListData(query, [req.body.product_img_id], res);
							var msg='';
							if(result1)
							{
								if(flag==1){
									msg="image does not exist but records removed";
								}
								else{
									msg="Product img file removed successfully...!";
								}
								res.send({
									success: true,
									message: msg,
									data: []
								});
							}
							else{
								res.send({
									success: false,
									message: 'Product img file not removed ...!',
									data: []
								});
							}
							
					}
					else
					{		res.send({
								success: false,
								message: 'Product img file name not found...!',
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


	UpdateProductStatus: async (req, res) => {
		const validationRule = {
			'product_id': 'required',
			'product_status': 'required',
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
					let products_data = {};

					products_data.product_status = req.body.product_status;
					products_data.mdf_by = req.logged_in_id;
					products_data.mdf_dt = todays_dt;


					let query = "UPDATE `products` SET ? WHERE product_id=? AND status=?";
					let data = [products_data, req.body.product_id, ACTIVE_STATUS];
					let result = await model.QueryPostData(query, data, res);
					if (result) {
						res.send({
							success: true,
							message: 'Product Status Updated Successfully..!',
							data: []
						});
					} else {
						res.send({
							success: false,
							message: 'Product Status Updated Unsuccessfull..!',
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


	ProductBids: async (req, res) => {
		const validationRule = {
			'product_id': 'required'
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
					let query = "SELECT a.bid_id,a.bidder_id,a.bid_amount,a.bid_status,DATE_FORMAT(a.add_dt,'%d-%m-%Y %h:%i:%p') as add_dt,a.product_id,c.name as customer_name,b.name as bidder_name,a.bid_amount,a.bid_status,a.add_dt as bid_date,a.mdf_dt as bid_modified_date	FROM `bids` as a left join user as b on a.bidder_id=b.id left join user as c on a.customer_id=c.id	WHERE a.product_id = ? AND a.status=?";
					let data = [req.body.product_id, ACTIVE_STATUS];
					let result = await model.QueryListData(query, data, res);
					if (result && result.length > 0) {
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
	},

	CustomerProductAds: async (req, res) => {
		const validationRule = {
			'customer_id': 'required'
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
					let query = "SELECT a.bid_id,a.bidder_id,a.bid_amount,a.bid_status,DATE_FORMAT(a.add_dt,'%d-%m-%Y %h:%i:%p') as add_dt,a.product_id,c.name as customer_name,b.name as bidder_name,a.bid_amount,a.bid_status,a.add_dt as bid_date,a.mdf_dt as bid_modified_date	FROM `bids` as a left join user as b on a.bidder_id=b.id left join user as c on a.customer_id=c.id	WHERE a.product_id = ? AND a.status=?";
					let data = [req.body.product_id, ACTIVE_STATUS];
					let result = await model.QueryListData(query, data, res);
					if (result && result.length > 0) {
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
	},


}
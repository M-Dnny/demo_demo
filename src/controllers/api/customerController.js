const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('bidder');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;

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
	BidListByCustomerId: async (req, res) => {
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
					let query = "SELECT a.bid_id,a.bidder_id,a.customer_id,a.bid_amount,a.bid_status,DATE_FORMAT(a.add_dt,'%d-%m-%Y %h:%i:%p') as add_dt,a.product_id,b.name as product_name,b.title,c.name as bidder_name FROM `bids` as a left join products as b on a.product_id=b.product_id left join user as c on a.bidder_id=c.id  WHERE a.customer_id = ? AND a.status=?";
					let data = [req.body.customer_id, ACTIVE_STATUS];
					
					let result = await model.QueryListDataNew(query, data, res);
					if (result && result.length) {
						result[0]['product_img'] = await model.GetProductFirstImg(result[0]['product_id']);
						res.send({
							success: true,
							message: 'Successfull',
							data: result
						});
					} else
						res.send({
							success: false,
							message: 'No Data Found',
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



	Edit: async (req, res) => {
		const validationRule = {
			'bid_id': 'required'
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
					let query = "SELECT a.bid_id,a.bidder_id,a.bid_amount,a.bid_status,DATE_FORMAT(a.add_dt,'%d-%m-%Y %h:%i:%p') as add_dt,a.product_id,b.name as product_name,b.title,c.name as bidder_name FROM `bids` as a left join products as b on a.product_id=b.product_id left join user as c on a.bidder_id=c.id  WHERE a.bid_id = ? AND a.status=?";
					let data = [req.body.bid_id, ACTIVE_STATUS];
					let result = await model.QueryListData(query, data, res);
					if (result && result.length) {
						result[0]['product_img'] = await model.GetProductFirstImg(result[0]['product_id']);
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



	UpdateBidStatus: async (req, res) => {
		const validationRule = {
			'bid_id': 'required',
			'bid_status': 'required',
			'customer_id': 'required',
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
					let bids_data = {};

					bids_data.bid_status = req.body.bid_status;
					bids_data.mdf_by = req.body.customer_id;
					bids_data.mdf_dt = todays_dt;


					let query = "UPDATE `bids` SET ? WHERE bid_id=? AND status=?";
					let data = [bids_data, req.body.bid_id, ACTIVE_STATUS];
					let result = await model.QueryPostData(query, data, res);
					if (result) {
						res.send({
							success: true,
							message: 'Bid Status Updated Successfully..!',
							data: []
						});
					} else {
						res.send({
							success: false,
							message: 'Bid Status Updated Unsuccessfull..!',
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
			'bid_id': 'required',
			'bidder_id': 'required',

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
				let now = moment();
				let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
				try {
					//       let where_con='bid_id=? and status=?';
					//       let where_data=[req.body.bid_id,ACTIVE_STATUS]
					// let check = await model.CheckForDelete('products',where_con,where_data);
					// if(check)
					// {
					let query = "UPDATE `bids` SET `status` =?,`mdf_by`=?,`mdf_dt`=? WHERE `bid_id` = ?";
					let data = [IN_ACTIVE_STATUS, req.body.bidder_id, todays_dt, req.body.bid_id];

					let result = await model.QueryPostData(query, data, res);
					if (result) {
						return res.send({
							success: true,
							message: 'Bid Deleted successfully..!',
							data: []
						});
					} else {
						return res.send({
							success: false,
							message: 'Bid Deleted Unsuccessfull..!',
							data: []
						});
					}

					//   }
					// else
					// {
					// 	res.send({
					//               success: true,
					//               message: 'Cant Delete..In Used!',
					//               data: []
					//       	});
					// }
				}
				catch (error) {
					res.send({
						success: false,
						message: 'Something Went Wrong..!',
						data: error.message
					});
				}
			}
		});
	},
	ListMyAds: async (req, res) => {
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
					let query = "SELECT p.product_id,totalbids.bidCount,p.category_id,p.sub_category_id,p.brand_id,b.brand_name,p.model_id,m.model_name,p.year_id,p.starting_price,p.country_id,co.country_name,p.city_id,ci.city_name,p.title,p.name,p.auction_type, DATE_FORMAT(p.start_date_time,'%d-%m-%Y') as start_date_time,	TIME_FORMAT(p.start_time,'%h:%i %p') as start_time, DATE_FORMAT(p.end_date_time,'%d-%m-%Y') as end_date_time, TIME_FORMAT(p.end_time,'%h:%i %p') as end_time, p.add_by FROM products p LEFT JOIN country co ON co.country_id=p.country_id LEFT JOIN city ci ON ci.city_id=p.city_id LEFT JOIN brand b ON b.brand_id=p.brand_id LEFT JOIN model m ON m.model_id=p.model_id LEFT JOIN (select count(b1.bid_id) as bidCount,b1.product_id from bids b1 group by b1.product_id) as totalbids on totalbids.product_id = p.product_id WHERE p.add_by=? and p.status=?";
					let data = [req.body.customer_id, ACTIVE_STATUS];
					if(req.body.search_title && typeof(req.body.search_title)!='undefined' && req.body.search_title!=''){
						query+='AND p.title like ?';
						data.push('%'+req.body.search_title+'%');
					}
					console.log(query);
					

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


					// let result = await model.QueryListDataNew(query, data, res);
					// if (result && result.length) {
					// 	result[0]['product_img'] = await model.GetProductFirstImg(result[0]['product_id']);
					// 	console.log(result[0]);
					// 	res.send({
					// 		success: true,
					// 		message: 'Successfull',
					// 		data: result
					// 	});
					// } else
					// 	res.send({
					// 		success: false,
					// 		message: 'No Data Found',
					// 		data: []
					// 	});


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
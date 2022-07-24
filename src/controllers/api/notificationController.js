// const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('notification');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const Otp = require('./../../../src/models/otp');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;

const moment = require('moment');
// const ProductsUploadLink = process.env.HOST + process.env.PORT + '/uploads/products/';

async function GetProductFirstImg(result, res) {
	return new Promise(async function (resolve, reject) {
		for (let i = 0; i < result.length; i++) {
			result[i]['product_img'] = await model.GetProductFirstImg(result[i]['product_id']);
		}
		resolve(result);
	});
}



module.exports = {
	NotifyLiveAds: async (req, res) => {
		try {
			// let query = "SELECT p.product_id,totalbids.bidCount,p.category_id,p.sub_category_id,p.brand_id,b.brand_name,p.model_id,m.model_name,p.year_id,p.starting_price,p.country_id,co.country_name,p.city_id,ci.city_name,p.title,p.name,p.auction_type, DATE_FORMAT(p.start_date_time,'%d-%m-%Y') as start_date_time,	TIME_FORMAT(p.start_time,'%h:%i %p') as start_time, DATE_FORMAT(p.end_date_time,'%d-%m-%Y') as end_date_time, TIME_FORMAT(p.end_time,'%h:%i %p') as end_time FROM products p LEFT JOIN country co ON co.country_id=p.country_id LEFT JOIN city ci ON ci.city_id=p.city_id LEFT JOIN brand b ON b.brand_id=p.brand_id LEFT JOIN model m ON m.model_id=p.model_id LEFT JOIN (select count(b1.bid_id) as bidCount,b1.product_id from bids b1 group by b1.product_id) as totalbids on totalbids.product_id = p.product_id WHERE p.status=?";
            let query = "SELECT p.product_id,p.title,p.name,p.auction_type,totalbids.bidCount,p.category_id,p.sub_category_id,p.brand_id,b.brand_name,p.model_id,m.model_name,p.year_id,p.starting_price,p.country_id,co.country_name,p.city_id,ci.city_name, DATE_FORMAT(p.start_date_time,'%d-%m-%Y') as start_date_time,	TIME_FORMAT(p.start_time,'%h:%i %p') as start_time, DATE_FORMAT(p.end_date_time,'%d-%m-%Y') as end_date_time, TIME_FORMAT(p.end_time,'%h:%i %p') as end_time FROM products p LEFT JOIN country co ON co.country_id=p.country_id LEFT JOIN city ci ON ci.city_id=p.city_id LEFT JOIN brand b ON b.brand_id=p.brand_id LEFT JOIN model m ON m.model_id=p.model_id LEFT JOIN (select count(b1.bid_id) as bidCount,b1.product_id from bids b1 group by b1.product_id) as totalbids on totalbids.product_id = p.product_id WHERE p.status=?";

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
				data.push(eval(req.query.subcat_arr));
			}

			if (req.query.brand_id && req.query.brand_id != '') {
				let brand_arr= req.query.brand_id.split(',');
				query += " and p.brand_id in (?)";
				data.push(eval(req.query.brand_arr));
			}
			if (req.query.model_id && req.query.model_id != '') {
				let model_arr= req.query.model_id.split(',');
				query += " and p.model_id in (?)";
				data.push(eval(req.query.model_arr));
			}
			if (req.query.city_id && req.query.city_id != '') {
				query += " and p.city_id in (?)";
				data.push(eval(req.query.city_id));
			}
			if (req.query.country_id && req.query.country_id != '') {
				query += " and p.country_id in (?)";
				data.push(eval(req.query.country_id));
			}
			if (req.query.auction_type && req.query.auction_type != '') {
				query += " and p.auction_type=?";
				data.push(req.query.auction_type);
				var todaydate=moment().format('YYYY-MM-DD HH:mm:ss');
				var nowtime= moment().format("HH:mm:ss");
				// var add(moment.duration(2, 'hours'));
				if(req.query.auction_type=='golivenow')
				{
					console.log(todaydate);
					console.log(nowtime);
					// query += " and p.start_date_time=CONVERT(datetime,?)";
					// data.push(todaydate);
					//query += " and p.start_date_time=CONVERT(?,datetime) and p.start_time>=TIME(?) and p.end_time<=TIME(?)";
					//data.push(todaydate,nowtime,nowtime);
					// query += " and DATE(p.start_date_time) >= ? and DATE(p.end_date_time) <= ? and TIME(p.start_time) <= ? and TIME(p.end_time) > ?";
					query += " and (p.start_date_time <= ? and p.end_date_time >= ?)  ";
					data.push(todaydate,todaydate);
					console.log(query);
				}
			}
			if (req.query.year_id && req.query.year_id != '') {
				query += " and p.year_id in (?)";
				data.push(req.query.year_id);
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

}
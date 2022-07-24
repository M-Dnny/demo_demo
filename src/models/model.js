const sql = require('./../../src/config/conn');
const moment = require('moment');
const now = moment();
const Logger = require('../../src/helper/loggerService');
const logger = new Logger('Model');
var path = require('path');
var handlebars =require('handlebars');
const UploadLink = process.env.HOST+process.env.PORT+'/';
const WEB_URL = process.env.WEB_URL; 
const request = require('request');
const ACTIVE_STATUS=process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS=process.env.IN_ACTIVE_STATUS;
const this_=this;
// const ProductsUploadLink =process.env.HOST+process.env.PORT+'/uploads/products/';

exports.QueryListData = async(query,data,res) => {
return new Promise( function(resolve , reject ){
	console.log(query);
	sql.query(query,data,(err, result,cache) => {
    	if(err) 
		{
			console.log(err);
			logger.error(err);
			reject(err);
		}
		resolve(result);
			
	});
  });
};
exports.CheckUnique = async(field,table,val,res,id_field='',id='') => {
return new Promise( function(resolve , reject ){
	let where ='';
	let data=[ACTIVE_STATUS,val];

	if(id!==undefined && id!=='' && id_field!==undefined && id_field!=='')
	{
		where=' AND '+id_field+'!=?';
		data.push(id);
	}
	let str=' AND '+field+'=?';
	let query = "SELECT `"+field+"` FROM "+table+" WHERE status=?"+str+where+"";
	console.log(query);
	sql.query(query,data,(err, result,cache) => {
    	if(err) 
		{
			console.log(err);
			logger.error(err);
			reject(err);
		}
		
		if(result.length) resolve(false);
			
		else resolve(true);
	});
  });
};

exports.CheckIfExists = async(field,table,val,res,id_field='',id='') => {
	return new Promise( function(resolve , reject ){
		let where ='';
		let data=[ACTIVE_STATUS,val];
	
		if(id!=undefined && id!='' && id_field!=undefined && id_field!='')
		{
			where=' AND '+id_field+'!=?';
			data.push(id);
		}
		let str=' AND '+field+'=?';
		let query = "SELECT `"+field+"` FROM "+table+" WHERE status=?"+str+where+"";
		console.log(query);
		sql.query(query,data,(err, result,cache) => {
			if(err) 
			{
				console.log(err);
				logger.error(err);
				reject(err);
			}
		
	
			if(result.length) resolve(true);
				
			else resolve(false);
		});
	  });
	};
exports.CheckUniqueWithRef = async(field,table,val,res,id_field='',id='',ref_feild='',ref_id='') => {
return new Promise( function(resolve , reject ){
	let where ='';
	let data=[ACTIVE_STATUS,val];

	if(id!=undefined && id!='' && id_field!=undefined && id_field!='')
	{
		where+=' AND '+id_field+'!=?';
		data.push(id);
	}
	if(ref_feild!=undefined && ref_feild!='' && ref_id!=undefined && ref_id!='')
	{
		where+=' AND '+ref_feild+'=?';
		data.push(ref_id);
	}
	let str=' AND '+field+'=?';
	let query = "SELECT `"+field+"` FROM "+table+" WHERE status=?"+str+where+"";
	console.log(query);
	sql.query(query,data,(err, result,cache) => {
    	if(err) 
		{
			console.log(err);
			logger.error(err);
			reject(err);

		}
		console.log(typeof result);

		if(result.length) resolve(false);
			
		else resolve(true);
	});
  });
};

exports.CheckUniqueWithTwoRef = async(field,table,val,res,id_field='',id='',ref1_feild='',ref1_id='',ref2_feild='',ref2_id='') => {
	return new Promise( function(resolve , reject ){
		let where ='';
		let data=[ACTIVE_STATUS,val];
	
		if(id!=undefined && id!='' && id_field!=undefined && id_field!='')
		{
			where+=' AND '+id_field+'!=?';
			data.push(id);
		}
		if(ref1_feild!=undefined && ref1_feild!='' && ref1_id!=undefined && ref1_id!='')
		{
			where+=' AND '+ref1_feild+'=?';
			data.push(ref1_id);
		}
		if(ref2_feild!=undefined && ref2_feild!='' && ref2_id!=undefined && ref2_id!='')
		{
			where+=' AND '+ref2_feild+'=?';
			data.push(ref2_id);
		}
		let str=' AND '+field+'=?';
		let query = "SELECT `"+field+"` FROM "+table+" WHERE status=?"+str+where+"";
		console.log(query);
		sql.query(query,data,(err, result,cache) => {
			if(err) 
			{
				console.log(err);
				logger.error(err);
				reject(err);
	
			}
			console.log(typeof result);
	
			if(result.length) resolve(false);
				
			else resolve(true);
		});
	  });
	};
	
	exports.CheckUniqueWithThreeRef = async(field,table,val,res,id_field='',id='',ref1_feild='',ref1_id='',ref2_feild='',ref2_id='',ref3_feild='',ref3_id='') => {
		return new Promise( function(resolve , reject ){
			let where ='';
			let data=[ACTIVE_STATUS,val];
		
			if(id!=undefined && id!='' && id_field!=undefined && id_field!='')
			{
				where+=' AND '+id_field+'!=?';
				data.push(id);
			}
			if(ref1_feild!=undefined && ref1_feild!='' && ref1_id!=undefined && ref1_id!='')
			{
				where+=' AND '+ref1_feild+'=?';
				data.push(ref1_id);
			}
			if(ref2_feild!=undefined && ref2_feild!='' && ref2_id!=undefined && ref2_id!='')
			{
				where+=' AND '+ref2_feild+'=?';
				data.push(ref2_id);
			}
			if(ref3_feild!=undefined && ref3_feild!='' && ref3_id!=undefined && ref3_id!='')
			{
				where+=' AND '+ref3_feild+'=?';
				data.push(ref3_id);
			}
			let str=' AND '+field+'=?';
			let query = "SELECT `"+field+"` FROM "+table+" WHERE status=?"+str+where+"";
			console.log(query);
			sql.query(query,data,(err, result,cache) => {
				if(err) 
				{
					console.log(err);
					logger.error(err);
					reject(err);
		
				}
				console.log(typeof result);
		
				if(result.length) resolve(false);
					
				else resolve(true);
			});
		  });
		};

exports.QueryPostData = async(query,data,res) => {
  return new Promise( function(resolve , reject){
	sql.query(query,data,(err, result,cache) => {
    	if(err) 
		{
			console.log(err);
			logger.error(err);
			reject(err);
		}		
			if(cache && cache.isCache==false)
			{
				sql.flush();
			}
			resolve(result);			
		});
    });
};

exports.CheckForDelete = async(table_name,cond,data)=>{
	return new Promise(async function(resolve, reject){
		let query ="SELECT * FROM "+table_name+" WHERE "+cond;
		sql.query(query,data,(err, result,cache) => {
    	if(err) 
		{
			console.log(err);
			logger.error(err);
			reject(err);

		}
		if(result && result.length>0)
		{
			resolve(false);
		}
		else
		{
			resolve(true);
		}
	});
	});
};

exports.UniqueMobileNo=(req)=>{
	return new Promise( function(resolve , reject ){
		
	let query ="SELECT `mobile_no` FROM `users` WHERE status=? AND `mobile_no`=? And verify_status=? ";
	let data = [ACTIVE_STATUS,req.body.mobile_no,'1'];
		sql.query(query,data,(err, result,cache) => {
			console.log(result);
			if(err) 
			{
				logger.error(err);
				reject(err);

			}
			 resolve(result);
			
		});
	});
};

exports.GetProductFirstImg=(product_id,res)=>{
	return new Promise(async function(resolve , reject ){
		let query ="SELECT Concat(?, CASE WHEN product_img  != '' THEN  Concat(product_img ) end) as product_img FROM product_imgs WHERE product_id=? and status=? limit 1";
		let	data=[ProductsUploadLink,product_id,ACTIVE_STATUS];
		let result1=await this_.QueryListData(query,data,res);
		 	if(result1.length>0)
		 	{
			 	resolve(result1[0]['product_img']);
			}
			else
			{
				resolve('');
			}
		 });
};

exports.QueryPostDataNew = async(query,data,res) => {
  return new Promise( function(resolve , reject ){
	sql.query(query,data,(err, result,cache) => {
    if(err) 
		{
			console.log(err);
			logger.error(err);
			reject(err)
		}
		
			if(cache && cache.isCache==false)
			{
				sql.flush();
			}
			resolve(result);
		
	});
  });
};

exports.QueryListDataNew = async(query,data,res) => {
return new Promise( function(resolve , reject ){
	console.log(query);
	sql.query(query,data,(err, result,cache) => {
    if(err) 
		{
			console.log(err);
			logger.error(err);
			reject(err)
		}
		resolve(result);
			
	});
  });
};

// exports.SendMail=async(email,subject,html,name='',cc_email_id='',u_name='',post_info='',user_post_info='',amount='', user_details='')=>{
exports.SendMail=async(email,subject,html,name='',cc_email_id='',u_name='',post_info='',user_post_info='',amount='', user_details='')=>{

	return new Promise( function(resolve , reject ){
		// console.log('email');
		// console.log(email);
	
		var template = handlebars.compile(html);
		var replacements = {
			 username: name,
			 u_name: u_name,
			 links : UploadLink,
			 web_link : WEB_URL,
		};
	
		if(post_info!='')
		{
			var replacements = {
			 username: name,
			 u_name: u_name,
			 location:post_info.location,
			 goods_quantity:post_info.goods_quantity,
			 goods_details:post_info.goods_details,
			 links : UploadLink,
			 web_link : WEB_URL,
				};
	
		}
		 if(user_post_info!='')
		{
			var replacements = {
			 username: name,
			 u_name: u_name,
			 location:user_post_info.location,
			 skill:user_post_info.skill,
			 links : UploadLink,
			 web_link : WEB_URL,
				};
	
		}
		 if(amount!='')
		{
			var replacements = {
			 username: name,
			 u_name: u_name,
			 amount:amount,
			 links : UploadLink,
			 web_link : WEB_URL,
				};
	
		}
	
	  if(user_details!='')
		{
			var replacements = {
			 username: name,
			 u_name: u_name,
			 
			 amount:user_details.amount,
			 user_email_id:user_details.user_email_id,
			 user_mobile_no:user_details.user_mobile_no,
			 user_aadhar_card:user_details.user_aadhar_card,
			 user_pan_card:user_details.user_pan_card,
			 ngo_legal_name:user_details.ngo_legal_name,
			 ngo_pan_no:user_details.ngo_pan_no,
			 ngo_address:user_details.ngo_address,
			 payment_id:user_details.payment_id,
			 doc_no:user_details.doc_no,
			 doc_date:user_details.doc_date,
			 issuer_name:user_details.issuer_name,
			 valid_date:user_details.valid_date,
			 links : UploadLink,
			 web_link : WEB_URL,
				};
	
		}
	
		console.log(replacements);
		// else
		// {
			
		// }
		
		var htmlToSend = template(replacements);
		var mailData = {
				from:'aidbees <aidbees@aidbees.org>',
				to:email,
				subject:subject,
				html:htmlToSend
			}
	
		if(cc_email_id && typeof cc_email_id !=="undefined" && cc_email_id !==""){
			var mailData = {
				from:'aidbees <aidbees@aidbees.org>',
				to:email,
				cc:cc_email_id,
				subject:subject,
				html:htmlToSend
			}
		}
		// console.log('mailData');
		// console.log(mailData);
		transporter.sendMail(mailData,(error,info)=>{
			if(error)
			{
				logger.error(error);
				console.log(error);
			}
			if(info)
			{
				// info.messageId;
				resolve(true);
			}
			else
			{
				resolve(false);
			}
		});
	  });
	};


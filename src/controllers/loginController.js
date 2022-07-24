var express = require('express');
var router = express.Router();
const sql = require('./../../src/config/conn');
var session = require('express-session');
var flash = require('req-flash');
var md5 = require('md5');
const jwt = require("jsonwebtoken");
const config = require("../../src/config/auth.config.js");
const Logger = require('../../src/helper/loggerService');
const logger = new Logger('login');
const nodemailer= require('nodemailer');

var validator = require('./../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;


const moment = require('moment');
var model = require('./../models/model');


async function UpdateLoginData(req, res) {
	return new Promise(async function (resolve, reject) {
		let now = moment();
		let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
		let obj = {};
		obj.last_login_dt = todays_dt;

		let query = "UPDATE `user` SET ? WHERE email_id=? and status=?";
		let data = [obj, req.body.email_id, ACTIVE_STATUS];
		let result1 = await model.QueryPostData(query, data, res);
		if (result1) {
			resolve(result1);
		}
		else {
			resolve([]);
		}

	});

}

exports.Login = async function (req, res, next) {
	const validationRule = {
		'user_id': 'required',
		'password': 'required'
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
				let query = "SELECT * FROM `user` WHERE (email_id=? or mobile_no=?) and password=? and status=? and role=?";
				let data = [req.body.user_id,req.body.user_id, md5(req.body.password), ACTIVE_STATUS,'customer'];

				let result = await model.QueryListData(query, data, res);
				console.log(result);
				if (result && result.length) {
					await UpdateLoginData(req, res);

					var token = jwt.sign({ id: result[0].id, role: result[0].role, }, config.secret, {
						expiresIn: 86400
					});

					res.send({
						success: true,
						message: 'Login Successfully..!',
						token: token,
						role: result[0].role,
						data: result
					});
				}
				else {

					let query = "SELECT * FROM `user` WHERE (email_id=? or mobile_no=?) and status=?";
					let data = [req.body.user_id,req.body.user_id, ACTIVE_STATUS];
					let result_acc_check = await model.QueryListData(query, data, res);
				if(result_acc_check && typeof(result_acc_check)!=='undefined' && result_acc_check.length > 0)
				{
					logger.info('Invalid mobile no/email_id Or Password..!');
					res.send({
						success: false,
						message: 'Invalid mobile no/email_id Or Password..!',
						data: []
					});
				}
				else{
					logger.info('Account not found, Please register');
					res.send({
						success: false,
						message: 'Account not found, Please register',
						data: []
					});
				}

					

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

};

exports.GoogleLogin = async function (req, res, next) {
	const validationRule = {
		'user_id': 'required'
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
				let query = "SELECT id,name,email_id,country_code_id,mobile_no,role,status,otp,add_by,mdf_by,add_dt,mdf_dt,last_login_dt,last_logout_dt FROM `user` WHERE email_id=? and status=? and role=?";
				let data = [req.body.user_id, ACTIVE_STATUS,'customer'];

				let result = await model.QueryListData(query, data, res);
				console.log(result);
				if (result && result.length) {
					await UpdateLoginData(req, res);

					var token = jwt.sign({ id: result[0].id, role: result[0].role, }, config.secret, {
						expiresIn: 86400
					});

					res.send({
						success: true,
						message: 'Login Successfully..!',
						token: token,
						role: result[0].role,
						data: result
					});
				}
				else {

					let query = "SELECT id,name,email_id,country_code_id,mobile_no,role,status,otp,add_by,mdf_by,add_dt,mdf_dt,last_login_dt,last_logout_dt FROM `user` WHERE email_id=? and status=?";
					let data = [req.body.user_id, ACTIVE_STATUS];
					let result_acc_check = await model.QueryListData(query, data, res);
				if(result_acc_check && typeof(result_acc_check)!=='undefined' && result_acc_check.length > 0)
				{
					logger.info('Invalid email_id !');
					res.send({
						success: false,
						message: 'Invalid email_id !',
						data: []
					});
				}
				else{
					logger.info('Account not found, Please register');
					res.send({
						success: false,
						message: 'Account not found, Please register',
						data: []
					});
				}

					

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

};

exports.LoginAdmin = async function (req, res, next) {
	const validationRule = {
		'email_id': 'required',
		'password': 'required'
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
				let query = "SELECT id,name,role FROM `user` WHERE email_id=? and password=? and status=? and role=?";
				let data = [req.body.email_id, md5(req.body.password), ACTIVE_STATUS, 'admin'];

				let result = await model.QueryListData(query, data, res);
				console.log(result);
				if (result && result.length) {
					await UpdateLoginData(req, res);

					var token = jwt.sign({ id: result[0].id, role: result[0].role, }, config.secret, {
						expiresIn: 86400
					});

					res.send({
						success: true,
						message: 'Login Successfully..!',
						token: token,
						role: result[0].role,
						data: result
					});
				}
				else {
					logger.info('Invalid email_id Or Password..!');
					res.send({
						success: false,
						message: 'Invalid email_id Or Password..!',
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

};

exports.Logout = async function (req, res, next) {
	
	try {
		let now = moment();
		let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");

		let query = "UPDATE `user` SET last_logout_dt=? WHERE id=? ";
		let data = [todays_dt, req.logged_in_id];
		let result = await model.QueryPostData(query, data, res);
		if (result) {
			req.session.destroy();
			res.send({
				success: true,	
				message: 'Logout Successfully..!',
				data: []
			});

		}
		else {
			res.send({
				success: false,
				message: 'Not Logged Out Successfully..!',
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
	// res.redirect('/');
	// res.end();
}








exports.ForgotPassword = async function (req, res, next) {
	const validationRule = {
		'user_id': 'required'
		//uOtpCheckser_id comman nam for email and mobile no
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
				console.log("There >");
				let now = moment();
				let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
				//checking for email
				let query = "SELECT * FROM `user` WHERE (email_id=? or mobile_no=?)  and status=?";
				let data = [req.body.user_id,req.body.user_id, ACTIVE_STATUS];
				let result = await model.QueryListData(query, data, res);

				console.log("result is ");
				console.log(result[0].id)
				
				// //checking for mobile
				// let query2 = "SELECT * FROM `user` WHERE mobile_no=? and status=?";
				// let data2 = [req.body.user_id, ACTIVE_STATUS];
				// let result2 = await model.QueryListData(query2, data2, res);
				// console.log("result2 is ".result2);


				// if (result && result.length) {
				// 	await UpdateLoginData(req, res);

				// 	var token = jwt.sign({ id: result[0].id, role: result[0].role, }, config.secret, {
				// 		expiresIn: 86400
				// 	});

				// 	res.send({
				// 		success: true,
				// 		message: 'Login Successfully..!',
				// 		token: token,
				// 		role: result[0].role,
				// 		data: result
				// 	});
				// }
				// else {
				// 	logger.info('Invalid email_id Or Password..!');
				// 	res.send({
				// 		success: false,
				// 		message: 'Invalid email_id Or Password..!',
				// 		data: []
				// 	});

				// }

				//handling email alerts	
				if (result && result.length) {
					var otp_code = Math.floor(1000 + Math.random()*1000);
					// var otp_code = 1234;
					let user_data ={};
					user_data.otp = otp_code;
					let query ="UPDATE user SET ? WHERE id=?";
					let data=[user_data,result[0].id];
					console.log("hello2"); 
					console.log(data);  
					try {
						let user_result = await model.QueryPostDataNew(query, data, res);
						console.log("hello3");  
						console.log(user_result);  
						if (user_result && typeof user_result !== "undefined" && user_result.affectedRows) {
							// let send = await model.SendMail(email_id,subject,html,name,'',u_name,post_info);
							console.log("hello4");  
							let mailTransporter = nodemailer.createTransport({
								service: 'gmail',
								auth: {
									user: process.env.MAILER_USER,
									pass: process.env.MAILER_PASS
								}
							});
							// let mailTransporter = {
							// 	service: 'gmail',
							// 	auth: {
							// 		user: process.env.MAILER_USER,
							// 		pass: process.env.MAILER_PASS
							// 	}
							// };
							console.log(mailTransporter);  
							let mailDetails = {
								from: process.env.MAILER_USER,
								to: req.body.user_id,
								subject: 'Forgot password',
								text: 'OTP is '+ otp_code
							};
							console.log(mailDetails);
							mailTransporter.sendMail(mailDetails, function(err, data) {
								if(err) {
									console.log('Error Occurs');
									res.send('Error Occurs');
									console.log(err);
								} else {
									console.log('Email sent successfully');
									res.send('Email sent successfully');
								}
							});

						  res.send({
							success: true,
							message: 'user exists & Otp Inserted successfully..!',
							data: []
						  });
						}
						else {
						  res.send({
							success: false,
							message: 'user exists & Otp Not Inserted Added successfully..!',
							data: []
						  });
		  
						}
					  }
					  catch (error) {
						// console.log("Shree Err Msg....................");
						res.send({
						  success: false,
						  message: 'Something Went Wrong..!',
						  data: error
						});
					  }

					
				}
				else {
					logger.info('Account not found !');
					res.send({
						success: false,
						message: 'Account not found !',
						data: []
					});

				}
			} catch (error) {
				// console.log(e.message);
				res.send({
					success: false,
					message: 'Something Went Wrong...in mail',
					data: error.message
				});
			}

		}
	});

};


//under construction
// exports.ForgotPassword = async function (req, res, next) {
// 	const validationRule = {
// 		'user_id': 'required'
// 		//user_id comman nam for email and mobile no
// 	}
// 	validator(req.body, validationRule, {}, async (err, status) => {
// 		console.log(status);
// 		if (!status) {
// 			res.send({
// 				success: false,
// 				message: 'Validation failed',
// 				data: err
// 			});
// 		}
// 		else {
// 			try {
// 				let now = moment();
// 				let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
// 				//checking for email
// 				let query = "SELECT * FROM `user` WHERE (email_id=? or mobile_no=?)  and status=?";
// 				let data = [req.body.user_id,req.body.user_id, ACTIVE_STATUS];
// 				let result = await model.QueryListData(query, data, res);
// 				// console.log("result is ");
// 				// console.log(result[0].id)
				
// 				// //checking for mobile
// 				// let query2 = "SELECT * FROM `user` WHERE mobile_no=? and status=?";
// 				// let data2 = [req.body.user_id, ACTIVE_STATUS];
// 				// let result2 = await model.QueryListData(query2, data2, res);
// 				// console.log("result2 is ".result2);


// 				// if (result && result.length) {
// 				// 	await UpdateLoginData(req, res);

// 				// 	var token = jwt.sign({ id: result[0].id, role: result[0].role, }, config.secret, {
// 				// 		expiresIn: 86400
// 				// 	});

// 				// 	res.send({
// 				// 		success: true,
// 				// 		message: 'Login Successfully..!',
// 				// 		token: token,
// 				// 		role: result[0].role,
// 				// 		data: result
// 				// 	});
// 				// }
// 				// else {
// 				// 	logger.info('Invalid email_id Or Password..!');
// 				// 	res.send({
// 				// 		success: false,
// 				// 		message: 'Invalid email_id Or Password..!',
// 				// 		data: []
// 				// 	});

// 				// }

// 				//handling email alerts	
// 				if (result && result.length) {
// 					// var otp_code = Math.floor(1000 + Math.random()*1000);
// 					var otp_code = 1234;
// 					let user_data ={};
// 					user_data.otp = otp_code;
// 					let query ="UPDATE user SET ? WHERE id=?";
// 					let data=[user_data,result[0].id];
// 					try {
// 						let user_result = await model.QueryPostDataNew(query, data, res);
// 						if (user_result && typeof user_result !== "undefined" && user_result.affectedRows) {
// 							// let send = await model.SendMail(email_id,subject,html,name,'',u_name,post_info);


// 						  res.send({
// 							success: true,
// 							message: 'user exists & Otp Inserted successfully..!',
// 							data: []
// 						  });
// 						}
// 						else {
// 						  res.send({
// 							success: false,
// 							message: 'user exists & Otp Not Inserted Added successfully..!',
// 							data: []
// 						  });
		  
// 						}
// 					  }
// 					  catch (error) {
// 						// console.log("Shree Err Msg....................");
// 						res.send({
// 						  success: false,
// 						  message: 'Something Went Wrong..!',
// 						  data: error
// 						});
// 					  }

					
// 				}
// 				else {
// 					logger.info('Account not found !');
// 					res.send({
// 						success: false,
// 						message: 'Account not found !',
// 						data: []
// 					});

// 				}
// 			} catch (error) {
// 				// console.log(e.message);
// 				res.send({
// 					success: false,
// 					message: 'Something Went Wrong...in mail',
// 					data: error.message
// 				});
// 			}

// 		}
// 	});

// };

// //under construction
exports.OtpCheck = async function (req, res, next) {
	const validationRule = {
		'email_id': 'required',
		'otp': 'required'
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
				let query = "SELECT * FROM `user` WHERE email_id=? and otp=? and status=? ";
				let data = [req.body.email_id,req.body.otp, ACTIVE_STATUS];

				let result = await model.QueryListData(query, data, res);
				console.log(result);
				if (result && result.length) {
					await UpdateLoginData(req, res);

					// var token = jwt.sign({ id: result[0].id, role: result[0].role, }, config.secret, {
					// 	expiresIn: 86400
					// });

					res.send({
						success: true,
						message: 'Otp verified successfully ',
						// token: token,
						// role: result[0].role,
						// data: result
					});
				}
				else {

					res.send({
						success: false,
						message: 'Invalid details ',
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

};

//under construction
exports.UpdatePassword= async function (req, res, next) {
	const validationRule = {
		'email_id': 'required',
		'password': 'required'
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
				let query = "UPDATE `user` SET password=? WHERE email_id=? and status=?";
				let data = [md5(req.body.password),req.body.email_id, ACTIVE_STATUS];

				let result = await model.QueryListData(query, data, res);
				// console.log("hello".result);
				if (result) {
					await UpdateLoginData(req, res);

					res.send({
						success: true,
						message: 'Password updated Successfully..!',
						// token: token,
						// role: result[0].role,
						data: []
					});
				}
				else {
					
					res.send({
						success: false,
						message: 'Password not updated Successfully',
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

};


// async function UpdatePassword(req, res) {
// 	const validationRule = {
// 		'user_id': 'required',
// 		'password': 'required'
// 	}
// 		c (err, status) => {
// 		console.log(status);
// 		if (!status) {
// 			res.send({
// 				success: false,
// 				message: 'Validation failed',
// 				data: err
// 			});
// 		}
// 		else {
// 			return new Promise(async function (resolve, reject) {
// 				let now = moment();
// 				let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
// 				let obj = {};
// 				obj.last_login_dt = todays_dt;
// 				obj.password = md5(req.body.password);

// 				let query = "UPDATE `user` SET ? WHERE email_id=? and status=?";
// 				let data = [obj, req.body.email_id, ACTIVE_STATUS];
// 				let result1 = await model.QueryPostData(query, data, res);
// 				if (result1) {
// 					resolve(result1);
// 				}
// 				else {
// 					resolve([]);
// 				}

// 			});
// 		}	
// 	})
// }
const sql = require('../config/conn');
var model = require('../models/model');

const moment = require('moment');

module.exports = {
    Worksheet: async(req, res, result) => {		
        return new Promise(async function(resolve, reject){
			try{
				console.log("req.body.test_details_id:");
				console.log(req.body.test_details_id);
				
				let upquery = "UPDATE `test_request_details` SET `worksheet_id` = ? WHERE `test_details_id` = ?"
				let updata = [result.insertId, req.body.test_details_id]
				let upresult = await model.QueryPostData(upquery, updata, res);
				
				if(upresult && upresult.affectedRows > 0){

                    res.send({
                        success: true,
                        message: 'Data Added and worksheet_id updated successfully..!',
                        data: result
                    });

					resolve();
				}
				else{
					res.send({
						success: false,
						message: 'worksheet id not updated',
						data: error.message
					});
				}
			}
			catch(error){
				
				reject(error);
				
				console.log("worksheet error:");
				console.log(error);
			}						    
        })
    },

    CompWorksheet: async(req, res, id) => {
        return new Promise(async function(resolve, reject){
			try{
				console.log("req.body.test_details_id:");
				console.log(req.body.test_details_id);
				
				let upquery = "UPDATE `test_request_details` SET `worksheet_id` = ? WHERE `test_details_id` = ?"
				let updata = [id, req.body.test_details_id]
				let upresult = await model.QueryPostData(upquery, updata, res);
				
				if(upresult && upresult.affectedRows > 0) {
                    res.send({
                        success: true,
                        message: 'Data Added and worksheet_id updated successfully..!',
                        data:[]
                    });

					resolve();
				}
				else{
					res.send({
						success: false,
						message: 'worksheet id not updated',
						data: error.message
					});
				}
			}
			catch(error){				
				reject(error);
				
				console.log("worksheet error:");
				console.log(error);
			}						    
        })
    },

    CACWorksheet: async(id, req, res, result) => {
        return new Promise(async function(resolve, reject){
			try{
				console.log("test_details_id:");
				console.log(id);
                console.log(result.insertId)
				
				let upquery = "UPDATE `test_request_details` SET `worksheet_id` = ? WHERE `test_details_id` = ?"
				let updata = [result.insertId, id]
				let upresult = await model.QueryPostData(upquery, updata, res);

                console.log("upresult:");
                console.log(upresult);
				
				if(upresult && upresult.affectedRows > 0){

					resolve("success");
				}
				else{
                    resolve("Worksheet failure");
				}
			}
			catch(error){
				
				reject(error);
				
				console.log("worksheet error:");
				console.log(error);
			}						    
        })
    },

    Date: async(date) => {
        return new Promise(async function(resolve, reject){
            var date1 = new Date(date);
            console.log("date1", date1);

            var year = date1.getFullYear();
            var month = date1.getMonth();
            var day = date1.getDate();

            const today = new Date(Date.UTC(year, month, day));
            const utc = today.toUTCString();

            const yyyy = today.getFullYear();
            let mm = today.getMonth() + 1; 
            let dd = today.getDate();

            if(mm < 10){
                mm = "0" + mm;
            }
            if(dd < 10){
                dd = "0" + dd;
            }
            var d = yyyy +"-"+ mm +"-"+ dd;

            console.log("d", d);

            resolve(d);
        })        
    },

    DeleteChemical: async(master_id) =>{
        console.log("master_id:", master_id);
        return new Promise(async function(resolve, reject){
            try {
                let query = "DELETE FROM `cement_chemical_master` WHERE `master_id` = ?"
                await model.QueryPostData(query, [master_id]); 

                let query1 = "DELETE FROM `cement_chemical_alumina` WHERE `master_id` = ?"
                await model.QueryPostData(query1, [master_id]);

                let query2 = "DELETE FROM `cement_chemical_calcium_oxide` WHERE `master_id` = ?"
                await model.QueryPostData(query2, [master_id]);

                let query3 = "DELETE FROM `cement_chemical_chloride_content` WHERE `master_id` = ?"
                await model.QueryPostData(query3, [master_id]);

                let query4 = "DELETE FROM `cement_chemical_combined_ferric_alumina` WHERE `master_id` = ?"
                await model.QueryPostData(query4, [master_id]);

                let query5 = "DELETE FROM `cement_chemical_ferric_oxide` WHERE `master_id` = ?"
                await model.QueryPostData(query5, [master_id]);

                let query6 = "DELETE FROM `cement_chemical_ignition_loss` WHERE `master_id` = ?"
                await model.QueryPostData(query6, [master_id]);

                let query7 = "DELETE FROM `cement_chemical_insoluble_residue` WHERE `master_id` = ?"
                await model.QueryPostData(query7, [master_id]);

                let query8 = "DELETE FROM `cement_chemical_magnesia` WHERE `master_id` = ?"
                await model.QueryPostData(query8, [master_id]);

                let query9 = "DELETE FROM `cement_chemical_silica` WHERE `master_id` = ?"
                await model.QueryPostData(query9, [master_id]);

                let query10 = "DELETE FROM `cement_chemical_sulpher` WHERE `master_id` = ?"
                await model.QueryPostData(query10, [master_id]);
            
            } catch (error) {
                console.log("Error:");
                console.log(error.message);
            }
            resolve();
        })
    },

    DeleteSteelChemical: async(master_id) =>{
        console.log("master_id:", master_id);
        return new Promise(async function(resolve, reject){
            try {
                let query = "DELETE FROM `steel_chemical_master` WHERE `master_id` = ?"
                await model.QueryPostData(query, [master_id]); 

                let query1 = "DELETE FROM `steel_silicon` WHERE `master_id` = ?"
                await model.QueryPostData(query1, [master_id]);

                let query2 = "DELETE FROM `steel_sulphur` WHERE `master_id` = ?"
                await model.QueryPostData(query2, [master_id]);

                let query3 = "DELETE FROM `steel_carbon` WHERE `master_id` = ?"
                await model.QueryPostData(query3, [master_id]);

                let query4 = "DELETE FROM `steel_phosphorus` WHERE `master_id` = ?"
                await model.QueryPostData(query4, [master_id]);

                let query5 = "DELETE FROM `steel_manganese` WHERE `master_id` = ?"
                await model.QueryPostData(query5, [master_id]);

                let query6 = "DELETE FROM `steel_s_p` WHERE `master_id` = ?"
                await model.QueryPostData(query6, [master_id]);

                let query7 = "DELETE FROM `steel_carbon_eq` WHERE `master_id` = ?"
                await model.QueryPostData(query7, [master_id]);
            
            } catch (error) {
                console.log("Error:");
                console.log(error.message);
            }
            resolve();
        })
    },

    DeleteAgChemical: async(master_id) =>{
        console.log("master_id:", master_id);
        return new Promise(async function(resolve, reject){
            try {
                let query = "DELETE FROM `coarse_aggregate_chemical_master` WHERE `master_id` = ?"
                await model.QueryPostData(query, [master_id]); 

                let query1 = "DELETE FROM `coarse_aggregate_chemical_alkalinity_reduction` WHERE `master_id` = ?"
                await model.QueryPostData(query1, [master_id]);

                let query2 = "DELETE FROM `coarse_aggregate_chemical_chloride` WHERE `master_id` = ?"
                await model.QueryPostData(query2, [master_id]);

                let query3 = "DELETE FROM `coarse_aggregate_chemical_dissolved_silica` WHERE `master_id` = ?"
                await model.QueryPostData(query3, [master_id]);

                let query4 = "DELETE FROM `coarse_aggregate_chemical_organic_impurirties` WHERE `master_id` = ?"
                await model.QueryPostData(query4, [master_id]);

                let query5 = "DELETE FROM `coarse_aggregate_chemical_ph` WHERE `master_id` = ?"
                await model.QueryPostData(query5, [master_id]);

                let query6 = "DELETE FROM `coarse_aggregate_chemical_sulphate` WHERE `master_id` = ?"
                await model.QueryPostData(query6, [master_id]);
            
            } catch (error) {
                console.log("Error:");
                console.log(error.message);
            }
            resolve();
        })
    }
    
}



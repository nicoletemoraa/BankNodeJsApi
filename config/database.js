const mysql = require('mysql');
let current_UTC_date = new Date();
const mysqlconnect = mysql.createConnection({
    host: 'localhost',
    user: 'yourusernane',
    password: 'yourpassword',
    database: 'bank_account'
});
mysqlconnect.connect(function(error){
	if(error){
		console.log("[INFO: "+current_UTC_date+"] Some description: Database Connection error-> "+error.message);
		console.log("-------------------------------------------------------------------------------------------")
	}else{
		console.log("[INFO: "+current_UTC_date+"] Connected to the database");
		console.log("-------------------------------------------------------------------------------------------")
	}
});

module.exports = mysqlconnect;
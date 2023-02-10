const mysqlconnect = require('../config/database');
const secret = require('../config/secret');
var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const verifyToken = require("../config/jwt");
var bcrypt = require('bcryptjs');

//*******LOGIN REST API**********
router.post("/login", function(req, res){
    console.log(req.body);
    var params = req.body;
    if(params.username && params.password){
        mysqlconnect.query("SELECT * FROM customer WHERE username = ?", [params.username], function(error, results, fields){
                if(error){
                    res.status(500).send({ status: false, status_code: 500, status_code: error.message });
                }else{
                if(results.length > 0){
                    if(bcrypt.compareSync(params.password, results[0].password)){
                        //res.json({status: true, status_code: 200, status_message: "Logged in successfully"});                    
                    var user = {id: results[0].id,username: params.username, account_no: results[0].account_no};
                    jwt.sign({ user }, secret, { expiresIn: 60 * 60 }, (err, token) => {
                        if (err) throw err;
                        var success_response = {
                        status: true,status_code: 200,status_message: "Login success",id: results[0].id, 
                        username: params.username,token: token, msisdn: results[0].msisdn, 
                        first_name: results[0].firstName, 
                        last_name: results[0].lastName};
                        //mysqlconnect.query("UPDATE user SET status_id = ? WHERE username = ?", ['1', params.username]);
                        res.json(success_response);
                        
                    });
                }else{
                    res.status(200).send({status: false, status_code: 201, status_message: "Wrong Username or Password"})
                    console.log("Login failed");
                }
                }else{
                    res.status(200).send({status: false, status_code: 201, status_message: "Wrong Username or Password"})
                }
            }
        })
    }else{
        res.status(400).send({status: false, status_code: 400, status_message: "Error Bad Request!"});
    }
});



module.exports = router;
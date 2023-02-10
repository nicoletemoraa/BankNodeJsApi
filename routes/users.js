var express = require('express');
var router = express.Router();
const verifyToken = require("../config/jwt");
const jwt = require("jsonwebtoken");
const secret = require('../config/secret');
const mysqlconnect = require('../config/database');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
//var da = new Date();
var dt = new Date();
var myDate = dt.getFullYear() + '-' + (((dt.getMonth() + 1) < 10) ? '0' : '') + (dt.getMonth() + 1) + '-' + ((dt.getDate() < 10) ? '0' : '') + dt.getDate();
console.log(myDate);


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//GET customer balance PER account_number: POST


router.get('/v1/balance', verifyToken, function (req, res, next) {
  jwt.verify(req.token, secret, (err, authData) => {        
      if (err) {
          res.json({ status: false, message: err.message });
      } else {
             try{ 
             mysqlconnect.query("SELECT account_balance FROM customer WHERE account_no = ?",[authData.user.account_no],function (error, results, fields) {
              if (error){
                console.error(error)
                res.status(500).json({status: false, message: 'internal server error'})
              }
              let accountBalance = results.length > 0 ? results[0].account_balance : 0
              res.status(200).json({status:true, message: 'success',results: { balance: accountBalance}});
          })
        }catch(e){
          console.error(e)
          res.status(500).json({status: false, message: 'internal server error', results: {balance: 0}})
        }
      }
  });
});

//deposit api

router.post('/v1/deposit', verifyToken, function(req, res, next){
  jwt.verify(req.token, secret, (err, authData) => {
    if(err){
      //res.json({ status: false, status_code: 504, status_message: err.message });
      res.json({ status: false, message: err.message });
    }else{
    try{
      var data = req.body;
      console.log(data);
      if(data.amount){          
          mysqlconnect.query("SELECT SUM(depos) AS today_deposit, count(id) AS today_deposit_no_transactions FROM customer_trx_log WHERE account_no = ? AND DATE(date_created) = ? AND trx_type= ?", [authData.user.account_no, myDate, "Desposit"], function(error, results, fields){
            if(error){
              console.error(error)
              res.status(500).json({status: false, message: 'internal server error'})
              //res.status(500).send({ status: false, status_code: 500, status_code: error.message });
            }else{
                  if(data.amount > 40000){
                    res.status(200).json({status: false, message: 'Exceeded Maximum Deposit Per Transaction'})
                    console.log("deposit failed because maximum limit per transaction exceded");

                  }else{
                        if(results[0].today_deposit >= 150000){
                                    //res.status(200).send({status: false, status_code: 201, status_message: "Exceeded today's maximum deposit limit"})
                                    res.status(200).json({status: false, message: 'Exceeded today maximum deposit limit'})
                                    console.log("deposit failed because maximum limit per day exceded");
                    
                        }else{
                              if(results[0].today_deposit_no_transactions >= 4){
                                      //res.status(200).send({status: false, status_code: 201, status_message: "Exceeded today's maximum number of transactions"})
                                      res.status(200).json({status: false, message: 'Exceeded todays maximum number of transactions'})                                      
                                      console.log("deposit failed because number of transactions per day exceded");
                              }else{
                                mysqlconnect.query("UPDATE customer SET account_balance =account_balance + ? WHERE account_no = ?", [data.amount, authData.user.account_no], function(error, result, fields){
                                  if(error){
                                    res.json({ status: false, error_code: 500, error_message: error.message });
                                  }else{
                                    if(result.affectedRows > 0){
                                      var record_data = {account_no: authData.user.account_no, trx_type:"Desposit", depos: data.amount, withs: 0,
                                      date_created:dt};
                                      mysqlconnect.query("INSERT INTO customer_trx_log SET ?", [record_data], function(error, result, fields){
                                        if(error){
                                          res.json({ status: false, message: error.message });
                                        }
                                      })

                                      //res.json({status: true, status_code: 200, status_message: "Deposit was successful"});
                                      res.status(200).json({status: true, message: 'Deposit was successful'})  
                                      
                                    }else{
                                      //res.json({status: true, status_code: 201, status_message: "Deposit was unsuccessful"});
                                      res.status(200).json({status: false, message: 'Deposit was unsuccessful'})
                                    }
                                  }
                                })


                              }
                                    
                        }

                  }

            }    

          })
      }else{
      res.json({ status: false, status_code: 501, status_message: "Missing parameter" });

     }
    }catch(e){
      console.error(e)
      res.status(500).json({status: false, message: 'internal server error', results: {balance: 0}})
    }
    }

  });
});



//withdraw api
router.post('/v1/withdraw', verifyToken, function(req, res, next){
  jwt.verify(req.token, secret, (err, authData) => {
    if(err){
      //res.json({ status: false, status_code: 504, status_message: err.message });
      res.json({ status: false, message: err.message });
    }else{
    try{
      var data = req.body;
      console.log(data);
      if(data.amount){
        mysqlconnect.query("SELECT * FROM customer WHERE account_no = ?", [authData.user.account_no], function(error, results, fields){
          if(error){
            console.error(error)
            res.status(500).json({status: false, message: 'internal server error'})          
          }else{
            if(data.amount > results[0].account_balance){
              res.status(500).json({status: false, message: 'withdraw amount more than account balance'})
            }else{        
                  mysqlconnect.query("SELECT SUM(withs) AS today_withdraw, count(id) AS today_withdraw_no_transactions FROM customer_trx_log WHERE account_no = ? AND DATE(date_created) = ? AND trx_type= ?", [authData.user.account_no, myDate, "withdrawal"], function(error, results, fields){
                    if(error){
                      console.error(error)
                      res.status(500).json({status: false, message: 'internal server error'})
                      //res.status(500).send({ status: false, status_code: 500, status_code: error.message });
                    }else{
                          if(data.amount > 20000){
                            res.status(200).json({status: false, message: 'Exceeded Maximum withdrawal Per Transaction'})
                            console.log("withdrawal failed because maximum limit per transaction exceded");
                          }else{
                                if(results[0].today_withdraw >= 50000){
                                            //res.status(200).send({status: false, status_code: 201, status_message: "Exceeded today's maximum deposit limit"})
                                            res.status(200).json({status: false, message: 'Exceeded today maximum withdrawal limit'})
                                            console.log("withdrawal failed because maximum limit per day exceded");
                            
                                }else{
                                      if(results[0].today_withdraw_no_transactions >= 3){
                                              //res.status(200).send({status: false, status_code: 201, status_message: "Exceeded today's maximum number of transactions"})
                                              res.status(200).json({status: false, message: 'Exceeded todays maximum number of transactions'})                                      
                                              console.log("withdrawal failed because number of transactions per day exceded");
                                      }else{
                                        mysqlconnect.query("UPDATE customer SET account_balance =account_balance - ? WHERE account_no = ?", [data.amount, authData.user.account_no], function(error, result, fields){
                                          if(error){
                                            res.json({ status: false, message: error.message });
                                          }else{
                                            if(result.affectedRows > 0){
                                              var record_data = {account_no: authData.user.account_no, trx_type:"withdrawal", depos: data.amount, withs: 0,
                                              date_created:dt};
                                              mysqlconnect.query("INSERT INTO customer_trx_log SET ?", [record_data], function(error, result, fields){
                                                if(error){
                                                  res.json({ status: false, message: error.message });
                                                }
                                              })

                                              //res.json({status: true, status_code: 200, status_message: "Deposit was successful"});
                                              res.status(200).json({status: true, message: 'Withdrawal was successful'})  
                                              
                                            }else{
                                              //res.json({status: true, status_code: 201, status_message: "Deposit was unsuccessful"});
                                              res.status(200).json({status: false, message: 'Withdrawal was unsuccessful'})
                                            }
                                          }
                                        })


                                      }
                                            
                                }

                          }

                    }    

                  }) 
               }
          }
        })    
      }else{
      res.json({ status: false, message: "Missing parameter" });

     }
    }catch(e){
      console.error(e)
      res.status(500).json({status: false, message: 'internal server error'})
    }
    }

  });
});

//add user

router.post('/add-user', function(req, res, next){
  /*jwt.verify(req.token, secret, (err, authData) => {
    if(err){
      res.json({ status: false, status_code: 504, status_message: err.message });
    }else{*/
      var data = req.body;
      console.log(data);
      if(data.cust_name && data.date_created && data.account_no && data.username && data.password){
        var hashed_password = bcrypt.hashSync(data.password, salt);
        var user = {cust_name: data.cust_name, account_no:data.account_no, username: data.username, password: hashed_password,
          account_balance: data.account_balance,date_created:data.date_created};
              mysqlconnect.query("INSERT INTO customer SET ?", [user], function(error, results, fields){
                  if(error){
                      res.json({ status: false, error_code: 500, error_message: error.message });
                  }else{
                      if(results.affectedRows > 0){
                          res.json({status: true, status_code: 200, status_message: "User created successfully!"});
                      }else{
                          res.json({status: true, status_code: 201, status_message: "User not created successfully!"});
                      }
                  }
              })
          }else{
              res.json({ status: false, status_code: 501, status_message: "Missing parameters" });
          }
       /* }
  });*/
});




module.exports = router;

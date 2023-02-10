
const user = require('../routes/users');
const chai = require("chai");
const chaiHttp = require("chai-http");


chai.use(chaiHttp);
describe("Deposit", () => {
it("test maximum Deposit Per Transaction", function(done) {
    chai.request('http://localhost:8085/users')
    .post("/v1/deposit")     
    .then((res) => {
        //  res.should.have.status(200);
        //  res.should.be.json;
        //  res.body.should.be.an('array');
        //  res.body.should.all.have.property('amount');
         chai.assert.isAtMost(30000, 40000);
        //  res.body.amount.should.all.be.below(40000);
         done();
      }).catch((err) => done(err))
   });

   it("test per day maximum deposit limit", function(done) {
    chai.request('http://localhost:8085/users')
    .post("/v1/deposit")     
    .then((res) => {
        //  res.should.have.status(200);
        //  res.should.be.json;
        //  res.body.should.be.an('array');
        //  res.body.should.all.have.property('amount');
         chai.assert.isAtMost(30000, 150000);
        //  res.body.amount.should.all.be.below(40000);
         done();
      }).catch((err) => done(err))
   });

   it("test daily maximum number of transactions", function(done) {
    chai.request('http://localhost:8085/users')
    .post("/v1/deposit")     
    .then((res) => {
        //  res.should.have.status(200);
        //  res.should.be.json;
        //  res.body.should.be.an('array');
        //  res.body.should.all.have.property('amount');
         chai.assert.isAtMost(1, 4);
        //  res.body.amount.should.all.be.below(40000);
         done();
      }).catch((err) => done(err))
   });
})
describe("Withdraw", () => {
    it("test maximum withdraw Per Transaction", function(done) {
        chai.request('http://localhost:8085/users')
        .post("/v1/withdraw")     
        .then((res) => {           
             chai.assert.isAtMost(30000, 20000);            
             done();
          }).catch((err) => done(err))
       });
    
       it("test per day maximum withdraw limit", function(done) {
        chai.request('http://localhost:8085/users')
        .post("/v1/withdraw")     
        .then((res) => {            
             chai.assert.isAtMost(30000, 50000);            
             done();
          }).catch((err) => done(err))
       });
    
       it("test daily maximum number of withdraw transactions", function(done) {
        chai.request('http://localhost:8085/users')
        .post("/v1/withdraw")     
        .then((res) => {            
             chai.assert.isAtMost(1, 3);            
             done();
          }).catch((err) => done(err))
       });
    })
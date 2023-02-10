function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      var current_date = new Date();
      res.json({status: false, error_code: 504, error_message: "Missing header authorization token"});
      console.log("INFO: "+current_date+" Some Description: Undefined header provided");
    }
  }
  module.exports = verifyToken;
  
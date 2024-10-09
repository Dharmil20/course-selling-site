const { JWT_USER_PASSWORD } = require("../config");
const jwt = require("jsonwebtoken");

function UserAuth(req, res, next) {
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_USER_PASSWORD);
  
    if(decodedData){
      req.userId = decodedData.id;
      next();
    } else{
      res.status(403).json({
        message: "Invalid Credentials"
      })
    }
  }

  module.exports = {
    UserAuth: UserAuth,
  }
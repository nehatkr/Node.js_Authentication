const jwt = require("jsonwebtoken");

const authmiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1]; // this [1] give the first element that is the token present after the brearer ketword.

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied . No token provided. Please login to continue",
    });
  }

  //   Decode this token
  try {
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedTokenInfo);

    req.userInfo = decodedTokenInfo; //hold the user information
    next(); //call the next handler

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Access denied . No token provided. Please login to continue",
    });
  }
};

module.exports = authmiddleware;

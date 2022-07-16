const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("------req-----", req.originalUrl);
  if (
    req.originalUrl !== "/api/v0.0.1/auth/login" &&
    req.originalUrl !== "/api/v0.0.1/auth/register" &&
    req.originalUrl !== "/api/v0.0.1/admin/getFile"
  ) {
    const token = req.header("X-Auth-Token");
    if (!token) {
      return res.status(401).json({
        msg: "no token, authorization denied",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT);
      req.user = decoded.user;

      console.log("token varify ", decoded);
      next();
    } catch (e) {
      console.log("token error ");
      res.status(401).json({
        msg: "token is not valid",
      });
    }
  } else {
    next();
  }
};

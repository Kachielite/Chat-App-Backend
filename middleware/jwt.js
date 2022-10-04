const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const authToken = req.get("authorization");
  try {
    if (!authToken) {
      console.log(authToken)
      const error = new Error("User not authenticated.");
      error.statusCode = 401;
      throw error;
    }

    const token = authToken.split(" ")[1];
    

    const decodedToken = jwt.verify(
      token,
      "chatappsupersecretpasswordtoken"
    );

    if (!decodedToken) {
      const error = new Error("Invalid Token");
      error.statusCode = 403;
      throw error;
    }

    req.userId = decodedToken.userId;
    req.token = decodedToken.token;


    next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

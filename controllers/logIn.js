const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.logIn = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let error = new Error('Invalid User Input');
        error.statusCode = 422;
        error.data = errors.array()
        throw error;
    }

  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
};

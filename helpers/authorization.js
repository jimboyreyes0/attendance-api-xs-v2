const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const UserTokens = require("../models/UserTokens");
const Employees = require("../models/Employees");
const errorHandler = require("./errorHandler");
dotenv.config();

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return errorHandler("Not authenticated", 401);
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.SECRETKEY);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    errorHandler("Not Authenticated", 401);
  }

  const { employee_id } = decodedToken;

  Employees.findOne({
    where: {
      emp_no: employee_id,
    },
  })
    .then((user) => {
      if (!user) {
        return errorHandler("User token not valid.", 401);
      }

      req.employeeID = employee_id;

      return UserTokens.findOne({
        where: {
          token: token,
          user_id: employee_id,
        },
      });
    })
    .then((isExist) => {
      if (!isExist) {
        return errorHandler("User token not valid.", 401);
      }
      next();
    })
    .catch((err) => {
      throw err;
    });
};

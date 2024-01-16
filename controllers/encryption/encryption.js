const jwt = require("jsonwebtoken");
const UserTokens = require("../../models/UserTokens");
const Employees = require("../../models/Employees");
const errorHandler = require("../../helpers/errorHandler");

exports.encryptEmployeeId = (req, res, next) => {
  const { employeeID } = req.body;
  const secretKey = process.env.SECRETKEY;

  Employees.findOne({
    where: {
      emp_no: employeeID,
    },
  })
    .then((isExist) => {
      if (!isExist) {
        return errorHandler("Employee Id not found.");
      }
      const token = jwt.sign(
        {
          employee_id: employeeID,
        },
        secretKey,
        {
          expiresIn: "5m",
        }
      );

      UserTokens.create({
        user_id: employeeID,
        token,
        dateTime: new Date(),
      })
        .then(() => {
          res.status(200).send({ success: true, encrypted: token });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

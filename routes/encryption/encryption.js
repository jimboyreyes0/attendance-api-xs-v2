const express = require("express");
const { body, param } = require("express-validator");

const inputValidation = require("../../middlewares/validation");

const EmployeesModel = require("../../models/Employees");
const AttendanceModel = require("../../models/Attendance");

const {
  encryptEmployeeId,
} = require("../../controllers/encryption/encryption");

const router = express.Router();

router.post(
  "/encrypter",
  [
    body("employeeID")
      .notEmpty()
      .custom((value, { req }) => {
        return EmployeesModel.findOne({
          where: {
            emp_no: value,
          },
        }).then((isExist) => {
          if (!isExist) {
            return Promise.reject("Employee Id doesn't exist");
          }
        });
      }),
  ],
  inputValidation,
  encryptEmployeeId
);
module.exports = router;

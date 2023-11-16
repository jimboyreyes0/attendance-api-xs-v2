const express = require("express");
const { body, param } = require("express-validator");

const inputValidation = require("../../middlewares/validation");

const EmployeesModel = require("../../models/Employees");
const AttendanceModel = require("../../models/Attendance");

const {
  timeInOut,
  getAttendanceRecords,
} = require("../../controllers/attendance/attendance");

const router = express.Router();

router.post(
  "/attendance",
  [body("data").notEmpty().withMessage("Employee Id cannot be empty!")],
  inputValidation,
  timeInOut
);

router.get(
  "/attendance/:employeeId",
  [param("employeeId").notEmpty().withMessage("Employee Id cannot be empty!")],
  inputValidation,
  getAttendanceRecords
);

module.exports = router;

const express = require("express");
const { body, param } = require("express-validator");

const inputValidation = require("../../middlewares/validation");

const isAuth = require('../../helpers/authorization');

const {
  timeInOut,
  getAttendanceRecords,
} = require("../../controllers/attendance/attendance");

const router = express.Router();

router.post(
  "/attendance",
  isAuth,
  timeInOut
);

router.get(
  "/attendance",
  isAuth,
  getAttendanceRecords
);

module.exports = router;

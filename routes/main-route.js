const express = require("express");

const router = express.Router();

const encryptionRoute = require("./encryption/encryption");
const attendanceRoute = require("./attendance/attendance");

router.use("/encryption", encryptionRoute);
router.use("/attendance", attendanceRoute);

module.exports = router;

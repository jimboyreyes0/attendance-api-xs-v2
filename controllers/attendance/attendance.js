const AttendanceModel = require("../../models/Attendance");
const EmployeesModel = require("../../models/Employees");

const { decryptLink } = require("../../helpers/encryption");
const errorHandler = require("../../helpers/errorHandler");

exports.timeInOut = async (req, res, next) => {
  try {
    const { data } = req.body;
    const employeeId = decryptLink(data);
    const ipAddress = req.ip;

    //   Check if Employee Exists
    const employeeData = await EmployeesModel.findOne({
      where: {
        emp_no: employeeId,
      },
    });
    if (!employeeData) {
      errorHandler("Employee Id does not exists!");
    }

    const lastRecord = await AttendanceModel.findOne({
      where: {
        employee: employeeId,
      },
      order: [["id", "DESC"]],
    });

    // Function to create and save a new record
    const createAndSaveRecord = async (attendanceType) => {
      const newRecord = new AttendanceModel({
        employee: employeeId,
        attendance_type: attendanceType,
        ip_address: ipAddress,
      });

      const record = await newRecord.save();
      const reloadedRecord = await record.reload();

      const responseInfo = attendanceType === 1 ? "Time in" : "Time out";
      res.status(200).json({
        success: true,
        hasRecord: true,
        info: responseInfo,
        date: reloadedRecord.date,
        time: reloadedRecord.time,
      });
    };

    // No previous record found, create a new time-in
    if (!lastRecord) {
      await createAndSaveRecord(1);
    } else {
      const newAttendanceType = lastRecord.attendance_type === 1 ? 2 : 1;
      await createAndSaveRecord(newAttendanceType);
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAttendanceRecords = async (req, res, next) => {
  const { employeeId: encryptedEmpId } = req.params;

  const employeeId = decryptLink(encryptedEmpId);

  //   Check if Employee Exists
  const employeeData = await EmployeesModel.findOne({
    where: {
      emp_no: employeeId,
    },
  });
  if (!employeeData) {
    errorHandler("Employee Id does not exists!");
  }

  AttendanceModel.findAll({
    where: {
      employee: employeeId,
    },
    order: [["id", "DESC"]],
  })
    .then((records) => {
      const responseJson = records.map((record) => ({
        employeeID: record.employee,
        attendanceType: record.attendance_type === 1 ? "Time In" : "Time Out",
        date: record.date,
        time: record.time,
      }));

      res.status(200).json({ success: true, records: responseJson });
    })
    .catch((err) => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

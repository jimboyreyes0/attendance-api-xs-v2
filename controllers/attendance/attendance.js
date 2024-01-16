const AttendanceModel = require("../../models/Attendance");
const EmployeesModel = require("../../models/Employees");

const errorHandler = require("../../helpers/errorHandler");

exports.timeInOut = async (req, res, next) => {
  try {
    const { employeeID } = req;
    const ipAddress = req.ip;

    const currentDate = new Date();

    const date = currentDate.toLocaleDateString('en-US', { timeZone: 'Asia/Singapore' });
    const time = currentDate.toLocaleTimeString('en-US', { timeZone: 'Asia/Singapore', hour12: false });


    const employeeData = await EmployeesModel.findOne({
      where: {
        emp_no: employeeID,
      },
    });
    if (!employeeData) {
      return errorHandler("Employee Id does not exists!");
    }

    const lastRecord = await AttendanceModel.findOne({
      where: {
        employee: employeeID,
      },
      order: [["id", "DESC"]],
    });

    const createAndSaveRecord = async (attendanceType) => {
      const newRecord = new AttendanceModel({
        employee: employeeID,
        attendance_type: attendanceType,
        date: date,
        time: time,
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
  const { employeeID } = req;


  const employeeData = await EmployeesModel.findOne({
    where: {
      emp_no: employeeID,
    },
  });
  if (!employeeData) {
    errorHandler("Employee Id does not exists!");
  }

  AttendanceModel.findAll({
    where: {
      employee: employeeID,
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

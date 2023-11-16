const Sequelize = require("sequelize");
const sequelizeConnection = require("../connection/connect");

const AttendanceModel = require("./Attendance");

const EmployeesModel = sequelizeConnection.define(
  "employees",
  {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    emp_no: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    first_name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    middle_name: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "employees",
    timestamps: false
  }
);

AttendanceModel.belongsTo(EmployeesModel, {
  foreignKey: "employee",
  targetKey: "emp_no",
  as: "employeeNo",
});

module.exports = EmployeesModel;

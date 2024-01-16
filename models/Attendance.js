const Sequelize = require("sequelize");
const sequelizeConnection = require("../connection/connect");

const AttendanceModel = sequelizeConnection.define(
  "attendance",
  {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    employee: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    attendance_type: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      // defaultValue: Sequelize.literal("CURRENT_DATE"),
    },
    time: {
      type: Sequelize.TIME,
      allowNull: false,
      // defaultValue: Sequelize.fn("current_time"),
    },
    ip_address: {
      type: Sequelize.STRING(500),
      allowNull: false,
    },
  },
  {
    tableName: "attendance",
    timestamps: false,
  }
);

module.exports = AttendanceModel;

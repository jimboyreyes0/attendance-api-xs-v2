const Sequelize = require("sequelize");

const dotenv = require("dotenv");

dotenv.config();

module.exports = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

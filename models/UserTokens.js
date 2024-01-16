const Sequelize = require("sequelize");
const sequelizeConnection = require("../connection/connect");

const UserTokens = sequelizeConnection.define(
  "user_tokens",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    token: {
      type: Sequelize.STRING(500),
      allowNull: false,
    },
    dateTime: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "user_tokens",
    timestamps: false,
  }
);

module.exports = UserTokens;

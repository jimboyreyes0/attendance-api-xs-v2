const Sequelize = require("sequelize");
const schedule = require("node-schedule");
const UserTokens = require("../models/UserTokens");
const errorHandler = require("../helpers/errorHandler");

const deleteExpiredTokens = schedule.scheduleJob("* * * * *", async () => {
  try {
    const fiveMinutesAgo = new Date(new Date() - 5 * 60 * 1000);
    await UserTokens.destroy({
      where: {
        dateTime: {
          [Sequelize.Op.lt]: fiveMinutesAgo,
        },
      },
    });
    console.log("Tokens Deleted");
  } catch (err) {
    errorHandler(`Deleting token error: ${err}`, 500);
  }
});

module.exports = deleteExpiredTokens;

const express = require("express");
const bodyParser = require("body-parser");

const sequelizeConnection = require("./connection/connect");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const routes = require("./routes/main-route");

// Routes
app.use("/api/v2", routes);

// Error Handler
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ success: false, message: message, data: data });
});

const port = process.env.PORT || 3000;

sequelizeConnection
  .sync({
    // force: true
  })
  .then(() => {
    app.listen(port, () => {
      console.log("Server started at port:", port);
    });
  })
  .catch((err) => {
    console.error(err);
  });

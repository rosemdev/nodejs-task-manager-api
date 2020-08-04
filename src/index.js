const express = require("express");
const mongoose = require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT;

/* app.use(function (err, req, res, next) {
  console.log('This is the invalid field ->', err.field)
  next(err)
}) */


app.use(express.json());
app.use(userRouter);

app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

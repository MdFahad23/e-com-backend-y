const express = require("express");
const morgna = require("morgan");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const app = express();

const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./helper/responseHandler");

// Configure RateLimite
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Too many request from this IP, Please try again later.",
});

app.use(xssClean());
app.use(morgna("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(rateLimiter);

app.use("/api/users", userRouter);
app.use("/api/seed", seedRouter);

// Client error handling
app.use((req, res, next) => {
  next(createError(404, "route not found"));
});

// Server error handling -> all the errors
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message
  })
});

module.exports = app;

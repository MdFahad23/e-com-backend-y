const createError = require("http-errors");

module.exports.getUsers = (req, res, next) => {
  try {
    res.status(200).send("Send All User");
  } catch (error) {
    next(error);
  }
};

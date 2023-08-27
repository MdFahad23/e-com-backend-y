const createError = require("http-errors");
const { User } = require("../models/userModel");
const { successResponse } = require("../helper/responseHandler");


// Get Users for admin
module.exports.getUsers = async (req, res, next) => {
  try {

    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1;

    const serachRegExp = new RegExp('.*' + search + '.*', 'i')

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: serachRegExp } },
        { email: { $regex: serachRegExp } },
        { phone: { $regex: serachRegExp } },
      ]
    }

    const options = { password: 0 }

    const users = await User.find(filter, options).limit(limit).skip((page - 1) * limit)

    const count = await User.find(filter).countDocuments()

    if (!users) throw createError(404, 'no users found')

    return successResponse(res, {
      statusCode: 200, message: "users were returned Successfully!", payload: {
        users,
        pagination: {
          totalPage: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null
        }
      }
    })
  } catch (error) {
    next(error);
  }
};

const createError = require("http-errors");
const jwt = require("jsonwebtoken")

const { User } = require("../models/userModel");
const { successResponse } = require("../helper/responseHandler");
const { findWithId } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");
const { createJSONWebToken } = require("../helper/jsonWebToken");
const { jwtActivationKey, clientUrl } = require("../secret");
const { emailWithNodeMail } = require("../helper/email");


// Get Users for admin
module.exports.getUsers = async (req, res, next) => {
  try {

    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

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

// Get Single User for admin
module.exports.getUserById = async (req, res, next) => {
  try {
    const id = req.params.id
    const options = { password: 0 }
    const user = await findWithId(User, id, options)
    return successResponse(res, {
      statusCode: 200, message: "user were returned Successfully!", payload: {
        user
      }
    })
  } catch (error) {
    next(error)
  }
}

// Delete User for admin
module.exports.deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id
    const options = { password: 0 }
    const user = await findWithId(User, id, options)

    const userImagePath = user.image

    deleteImage(userImagePath)

    await User.findByIdAndDelete({ _id: id, isAdmin: false })

    return successResponse(res, {
      statusCode: 200, message: "user was deleted Successfully!"
    })
  } catch (error) {
    next(error)
  }
}

// Create User and send verify email
module.exports.processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body

    const userExists = await User.exists({ email: email })
    if (userExists) throw createError(409, 'User with this email already exits. Please sign in.')

    // Create jwt
    const token = createJSONWebToken({ name, email, password, phone, address }, jwtActivationKey, '10m')

    // Prepaer Email
    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `
        <h2>Hello ${name} !</h2>
        <p>Please click here to <a href="${clientUrl}/api/users/activate/${token}" target="_blank">activate your account</a> </p>
      `
    }

    // send email with nodemailer
    try {
      await emailWithNodeMail(emailData)
    } catch (error) {
      next(createError(500, 'Failed to send verification email'))
      return
    }

    return successResponse(res, {
      statusCode: 200, message: `Please go to your ${email} for completing your registration process`, payload: { token }
    })
  } catch (error) {
    next(error)
  }
}

// Verify User and activate Account
module.exports.activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token
    if (!token) throw createError(404, 'Token not found!')

    try {
      const decoded = jwt.verify(token, jwtActivationKey)
      if (!decoded) throw createError(401, 'Unable to verify user')

      const userExists = await User.exists({ email: decoded.email })
      if (userExists) throw createError(409, 'User with this email already exits. Please sign in.')

      await User.create(decoded)

      return successResponse(res, {
        statusCode: 201, message: "User was registered successfully"
      })
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw createError(401, 'Token has expired')
      } else if (error.name === 'JsonWebTokenError') {
        throw createError(401, 'Invalid Token')
      } else {
        throw error
      }
    }

  } catch (error) {
    next(error)
  }
}
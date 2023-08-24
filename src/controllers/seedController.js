const { User } = require("../models/userModel")
const data = require("../data")

module.exports.seedUser = async (req, res, next) => {
    try {
        // deleting all existing users
        await User.deleteMany({})

        // instering new users
        const users = await User.insertMany(data.users)

        // successful response
        return res.status(201).json(users)
    } catch (error) {
        next(error)
    }
}
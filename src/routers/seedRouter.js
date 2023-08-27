const seedRouter = require("express").Router()

const { seedUser } = require("../controllers/seedController")

// GET: api/seed/users
seedRouter.get("/users", seedUser)

module.exports = seedRouter
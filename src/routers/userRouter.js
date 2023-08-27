const router = require("express").Router();

const { getUsers, getUser } = require("../controllers/userController");

// GET: api/users
router.route("/").get(getUsers);
// Get: api/users/:id
router.route("/:id").get(getUser)

module.exports = router;

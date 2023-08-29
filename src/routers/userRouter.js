const router = require("express").Router();

const { getUsers, getUserById, deleteUserById, processRegister } = require("../controllers/userController");

// GET: api/users
router.route("/").get(getUsers);
// Get/delete: api/users/:id
router.route("/:id").get(getUserById).delete(deleteUserById)
// Get: api/users/process-register
router.route("/process-register").post(processRegister)

module.exports = router;

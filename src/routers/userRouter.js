const router = require("express").Router();

const { getUsers, getUserById, deleteUserById, processRegister, activateUserAccount } = require("../controllers/userController");
const { upload } = require("../middlewares/uploadFile");

// GET: api/users
router.route("/").get(getUsers);
// Get/delete: api/users/:id
router.route("/:id").get(getUserById).delete(deleteUserById)
// post: api/users/process-register
router.route("/process-register").post(upload.single("image"), processRegister)
// post: api/users/verify
router.route("/verify").post(activateUserAccount)

module.exports = router;

const express = require("express");
const { register, login, getUserData, logout, getAllStaff, deleteStaff, updateStaffPassword, updateStaff } = require("../controllers/userController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const { checkRole } = require("../middlewares/verifyRole");

const router = express.Router();

// Authentication Routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(isVerifiedUser, logout);
router.route("/").get(isVerifiedUser, getUserData);

// Admin-only Staff Management Routes
router.get("/staff", isVerifiedUser, checkRole(["admin"]), getAllStaff);
router.route("/staff/:id")
    .put(isVerifiedUser, checkRole(["admin"]), updateStaff)
    .delete(isVerifiedUser, checkRole(["admin"]), deleteStaff);
router.put("/staff/:id/password", isVerifiedUser, checkRole(["admin"]), updateStaffPassword);

module.exports = router;
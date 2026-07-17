const express = require("express");
const { register, login, getUserData, logout, getAllStaff, deleteStaff, updateStaffPassword, updateStaff } = require("../controllers/userController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const { checkRole } = require("../middlewares/verifyRole");
const validateRequest = require("../middlewares/validateRequest");
const { registerSchema, loginSchema, updateStaffSchema, updateStaffPasswordSchema } = require("../validations/userValidation");

const router = express.Router();

// Authentication Routes
router.route("/register").post(isVerifiedUser, checkRole(["admin"]), validateRequest(registerSchema), register);
router.route("/login").post(validateRequest(loginSchema), login);
router.route("/logout").post(isVerifiedUser, logout);
router.route("/").get(isVerifiedUser, getUserData);

// Admin-only Staff Management Routes
router.get("/staff", isVerifiedUser, checkRole(["admin"]), getAllStaff);
router.route("/staff/:id")
    .put(isVerifiedUser, checkRole(["admin"]), validateRequest(updateStaffSchema), updateStaff)
    .delete(isVerifiedUser, checkRole(["admin"]), deleteStaff);
router.put("/staff/:id/password", isVerifiedUser, checkRole(["admin"]), validateRequest(updateStaffPasswordSchema), updateStaffPassword);

module.exports = router;
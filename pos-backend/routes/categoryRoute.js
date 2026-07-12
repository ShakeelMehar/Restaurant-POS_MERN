const express = require("express");
const { createCategory, getCategories, updateCategory, deleteCategory } = require("../controllers/categoryController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const { checkRole } = require("../middlewares/verifyRole");

const router = express.Router();

router.route("/")
    .get(isVerifiedUser, getCategories)
    .post(isVerifiedUser, checkRole(["admin"]), createCategory);

router.route("/:id")
    .put(isVerifiedUser, checkRole(["admin"]), updateCategory)
    .delete(isVerifiedUser, checkRole(["admin"]), deleteCategory);

module.exports = router;

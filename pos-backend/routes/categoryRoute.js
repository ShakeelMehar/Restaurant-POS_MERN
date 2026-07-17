const express = require("express");
const { createCategory, getCategories, updateCategory, deleteCategory } = require("../controllers/categoryController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const { checkRole } = require("../middlewares/verifyRole");
const validateRequest = require("../middlewares/validateRequest");
const { createCategorySchema, updateCategorySchema } = require("../validations/categoryValidation");

const router = express.Router();

router.route("/")
    .get(isVerifiedUser, getCategories)
    .post(isVerifiedUser, checkRole(["admin"]), validateRequest(createCategorySchema), createCategory);

router.route("/:id")
    .put(isVerifiedUser, checkRole(["admin"]), validateRequest(updateCategorySchema), updateCategory)
    .delete(isVerifiedUser, checkRole(["admin"]), deleteCategory);

module.exports = router;

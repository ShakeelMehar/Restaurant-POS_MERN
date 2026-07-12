const express = require("express");
const { createProduct, getProducts, updateProduct, deleteProduct } = require("../controllers/productController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const { checkRole } = require("../middlewares/verifyRole");

const router = express.Router();

router.route("/")
    .get(isVerifiedUser, getProducts)
    .post(isVerifiedUser, checkRole(["admin"]), createProduct);

router.route("/:id")
    .put(isVerifiedUser, checkRole(["admin"]), updateProduct)
    .delete(isVerifiedUser, checkRole(["admin"]), deleteProduct);

module.exports = router;

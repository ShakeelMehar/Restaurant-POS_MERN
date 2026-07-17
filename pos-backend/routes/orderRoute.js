const express = require("express");
const { addOrder, getOrders, getOrderById, updateOrder } = require("../controllers/orderController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const validateRequest = require("../middlewares/validateRequest");
const { addOrderSchema, updateOrderSchema } = require("../validations/orderValidation");

const router = express.Router();

router.route("/").post(isVerifiedUser, validateRequest(addOrderSchema), addOrder);
router.route("/").get(isVerifiedUser, getOrders);
router.route("/:id").get(isVerifiedUser, getOrderById);
router.route("/:id").put(isVerifiedUser, validateRequest(updateOrderSchema), updateOrder);

module.exports = router;
const Razorpay = require("razorpay");
const config = require("../config/config");
const crypto = require("node:crypto");
const createHttpError = require("http-errors");
const Payment = require("../models/paymentModel");
const Order = require("../models/orderModel");
const tenantContext = require("../middlewares/tenantContext");

const safeCompare = (a, b) => {
  if (!a || !b || a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
};

const createOrder = async (req, res, next) => {
  const razorpay = new Razorpay({
    key_id: config.razorpayKeyId,
    key_secret: config.razorpaySecretKey,
  });

  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // Amount in paisa (1 PKR = 100 paisa)
      currency: "PKR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        restaurantId: req.user.restaurantId.toString(),
      },
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const expectedSignature = crypto
      .createHmac("sha256", config.razorpaySecretKey)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (safeCompare(expectedSignature, razorpay_signature)) {
      const razorpay = new Razorpay({
        key_id: config.razorpayKeyId,
        key_secret: config.razorpaySecretKey,
      });

      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      
      const newPayment = new Payment({
        restaurantId: req.user.restaurantId,
        paymentId: payment.id,
        orderId: payment.order_id,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        email: payment.email,
        contact: payment.contact,
        createdAt: new Date(payment.created_at * 1000),
      });

      try {
        await newPayment.save();
      } catch (saveError) {
        if (saveError.code === 11000) {
          console.log(`ℹ️ Duplicate payment verify received for paymentId: ${payment.id}. Ignoring duplicate.`);
        } else {
          throw saveError;
        }
      }

      // Reconcile order if it already exists
      let order;
      await tenantContext.run({ bypassIsolation: true }, async () => {
        order = await Order.findOne({ "paymentData.razorpay_order_id": payment.order_id });
      });

      if (order) {
        await tenantContext.run({ restaurantId: req.user.restaurantId }, async () => {
          order.orderStatus = "In Progress";
          order.paymentMethod = "Online";
          order.paymentData = {
            razorpay_order_id: payment.order_id,
            razorpay_payment_id: payment.id
          };
          await order.save();
        });
      }

      res.json({ success: true, message: "Payment verified successfully!" });
    } else {
      const error = createHttpError(400, "Payment verification failed!");
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

const webHookVerification = async (req, res, next) => {
  try {
    const secret = config.razorpyWebhookSecret;
    const signature = req.headers["x-razorpay-signature"];

    const body = JSON.stringify(req.body);

    // 🛑 Verify the signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (safeCompare(expectedSignature, signature)) {
      console.log("✅ Webhook verified:", req.body);

      // ✅ Process payment (e.g., update DB, send confirmation email)
      if (req.body.event === "payment.captured") {
        const payment = req.body.payload.payment.entity;
        console.log(`💰 Payment Captured: ${payment.amount / 100} PKR`);

        // Check if Order exists in DB (bypass isolation for verification)
        let order;
        await tenantContext.run({ bypassIsolation: true }, async () => {
          order = await Order.findOne({ "paymentData.razorpay_order_id": payment.order_id });
        });

        // Resolve restaurantId from notes metadata or matching order
        const restaurantId = payment.notes?.restaurantId || (order ? order.restaurantId?.toString() : null);

        if (!restaurantId) {
          console.error(`❌ Webhook Error: Could not resolve restaurantId for payment: ${payment.id}`);
          const error = createHttpError(400, "Could not resolve restaurantId context.");
          return next(error);
        }

        if (!order) {
          console.warn(`⚠️ Webhook Warning: Order record not found in DB for Razorpay order ID ${payment.order_id} (could be asynchronous delay or orphan payment).`);
        }

        const newPayment = new Payment({
          restaurantId,
          paymentId: payment.id,
          orderId: payment.order_id,
          amount: payment.amount / 100,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          email: payment.email,
          contact: payment.contact,
          createdAt: new Date(payment.created_at * 1000),
        });

        // Wrap save in tenant isolation context
        await tenantContext.run({ restaurantId }, async () => {
          try {
            await newPayment.save();

            // Reconcile order if it exists
            if (order) {
              order.orderStatus = "In Progress";
              order.paymentMethod = "Online";
              order.paymentData = {
                razorpay_order_id: payment.order_id,
                razorpay_payment_id: payment.id
              };
              await order.save();
              console.log(`✅ Order ${order._id} updated to In Progress via webhook.`);
            }
          } catch (saveError) {
            if (saveError.code === 11000) {
              console.log(`ℹ️ Duplicate payment webhook received for paymentId: ${payment.id}. Ignoring duplicate.`);
              
              // Fallback update if order exists but wasn't marked paid yet
              if (order && order.orderStatus !== "In Progress") {
                order.orderStatus = "In Progress";
                order.paymentMethod = "Online";
                order.paymentData = {
                  razorpay_order_id: payment.order_id,
                  razorpay_payment_id: payment.id
                };
                await order.save();
                console.log(`✅ Order ${order._id} updated to In Progress via duplicate webhook.`);
              }
            } else {
              throw saveError;
            }
          }
        });
      }

      res.json({ success: true });
    } else {
      const error = createHttpError(400, "❌ Invalid Signature!");
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, verifyPayment, webHookVerification };

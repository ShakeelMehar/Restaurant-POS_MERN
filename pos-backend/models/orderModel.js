const mongoose = require("mongoose");
const tenantIsolation = require("./plugins/tenantIsolation");

const orderSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        index: true
    },
    customerDetails: {
        name: { type: String, default: "Customer" },
        phone: { type: String, default: "" },
        guests: { type: Number, default: 1 },
    },
    orderStatus: {
        type: String,
        required: true
    },
    orderType: {
        type: String,
        required: true,
        default: "Dine In"
    },
    orderDate: {
        type: Date,
        default : Date.now
    },
    bills: {
        total: { type: Number, required: true },
        tax: { type: Number, required: true },
        totalWithTax: { type: Number, required: true }
    },
    items: [],
    cashier: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentMethod: String,
    paymentData: {
        razorpay_order_id: String,
        razorpay_payment_id: String
    },
    // Client-generated key so offline replays can be de-duplicated server-side
    idempotencyKey: { type: String },
    // When the cashier actually took the order (offline orders sync hours later)
    placedAt: { type: Date },
    // Audit: totals the client submitted differed from server-recomputed prices
    // (e.g. an admin changed prices while the device was offline)
    priceDrift: { type: Boolean, default: false },
    clientBills: {
        total: Number,
        tax: Number,
        totalWithTax: Number
    }
}, { timestamps : true } );

orderSchema.index({ restaurantId: 1, createdAt: -1 });
// Unique per tenant, but only for orders that carry a key (legacy orders have none)
orderSchema.index(
    { restaurantId: 1, idempotencyKey: 1 },
    { unique: true, partialFilterExpression: { idempotencyKey: { $type: "string" } } }
);

orderSchema.plugin(tenantIsolation);

module.exports = mongoose.model("Order", orderSchema);
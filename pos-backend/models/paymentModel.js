const mongoose = require("mongoose");
const tenantIsolation = require("./plugins/tenantIsolation");

const paymentSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        index: true
    },
    paymentId: String,
    orderId: String,
    amount: Number,
    currency: { type: String, default: "PKR" },
    status: String,
    method: String,
    email: String,
    contact: String,
    createdAt: Date
})

paymentSchema.plugin(tenantIsolation);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
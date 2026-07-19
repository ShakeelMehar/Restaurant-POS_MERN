const { z } = require("zod");

const addOrderSchema = z.object({
    body: z.object({
        customerDetails: z.object({
            name: z.string().optional(),
            phone: z.string().optional(),
            guests: z.number().optional()
        }).optional(),
        orderStatus: z.string().optional(),
        orderType: z.enum(["Dine In", "Takeaway", "Delivery"]).optional(),
        bills: z.object({
            total: z.number({ required_error: "bills.total is required" }),
            tax: z.number().optional(),
            totalWithTax: z.number({ required_error: "bills.totalWithTax is required" })
        }),
        items: z.array(z.any()).min(1, "At least one item is required"),
        paymentMethod: z.string().optional(),
        paymentData: z.object({
            razorpay_order_id: z.string().optional(),
            razorpay_payment_id: z.string().optional()
        }).optional(),
        idempotencyKey: z.string().min(8).max(128).optional(),
        placedAt: z.string().optional()
    })
});

const updateOrderSchema = z.object({
    body: z.object({
        customerDetails: z.object({
            name: z.string().optional(),
            phone: z.string().optional(),
            guests: z.number().optional()
        }).optional(),
        orderStatus: z.string().optional(),
        orderType: z.enum(["Dine In", "Takeaway", "Delivery"]).optional(),
        bills: z.object({
            total: z.number().optional(),
            tax: z.number().optional(),
            totalWithTax: z.number().optional()
        }).optional(),
        items: z.array(z.any()).optional(),
        paymentMethod: z.string().optional(),
        paymentData: z.object({
            razorpay_order_id: z.string().optional(),
            razorpay_payment_id: z.string().optional()
        }).optional()
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid order ID format")
    })
});

module.exports = {
    addOrderSchema,
    updateOrderSchema
};

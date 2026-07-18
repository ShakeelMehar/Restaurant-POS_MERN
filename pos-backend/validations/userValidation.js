const { z } = require("zod");

// Cashier creation: role is assigned server-side (always "cashier"), never accepted from the client.
const createCashierSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        phone: z.string().min(1, "Phone is required"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters")
    })
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(1, "Password is required")
    })
});

// Staff edits do not change role — role is immutable through this endpoint.
const updateStaffSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        phone: z.string().min(1, "Phone is required"),
        email: z.string().email("Invalid email format")
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid staff ID format")
    })
});

const updateStaffPasswordSchema = z.object({
    body: z.object({
        password: z.string().min(6, "Password must be at least 6 characters")
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid staff ID format")
    })
});

module.exports = {
    createCashierSchema,
    loginSchema,
    updateStaffSchema,
    updateStaffPasswordSchema
};

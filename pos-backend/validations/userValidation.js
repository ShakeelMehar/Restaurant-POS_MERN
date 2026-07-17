const { z } = require("zod");

const registerSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        phone: z.string().min(1, "Phone is required"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        role: z.enum(["admin", "cashier", "super admin"], {
            errorMap: () => ({ message: "Role must be 'admin', 'cashier', or 'super admin'" })
        })
    })
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(1, "Password is required")
    })
});

const updateStaffSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        phone: z.string().min(1, "Phone is required"),
        email: z.string().email("Invalid email format"),
        role: z.enum(["admin", "cashier", "super admin"], {
            errorMap: () => ({ message: "Role must be 'admin', 'cashier', or 'super admin'" })
        })
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
    registerSchema,
    loginSchema,
    updateStaffSchema,
    updateStaffPasswordSchema
};

const { z } = require("zod");

const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Product name is required"),
        category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID format"),
        description: z.string().optional(),
        price: z.number().min(0, "Price must be a positive number"),
        optionGroups: z.array(z.any()).optional(),
        hasPortions: z.boolean().optional(),
        portions: z.array(z.any()).optional()
    })
});

const updateProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Product name cannot be empty").optional(),
        category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID format").optional(),
        description: z.string().optional(),
        price: z.number().min(0, "Price must be a positive number").optional(),
        optionGroups: z.array(z.any()).optional(),
        hasPortions: z.boolean().optional(),
        portions: z.array(z.any()).optional()
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID format")
    })
});

module.exports = {
    createProductSchema,
    updateProductSchema
};

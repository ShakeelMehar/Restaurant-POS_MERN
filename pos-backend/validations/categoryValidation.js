const { z } = require("zod");

const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1, "Category name is required"),
        bgColor: z.string().optional(),
        icon: z.string().optional(),
        order: z.number().optional()
    })
});

const updateCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1, "Category name cannot be empty").optional(),
        bgColor: z.string().optional(),
        icon: z.string().optional(),
        order: z.number().optional()
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID format")
    })
});

module.exports = {
    createCategorySchema,
    updateCategorySchema
};

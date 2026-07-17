const { ZodError } = require("zod");

const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const issues = error.issues || error.errors || [];
                const formattedErrors = issues.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));
                return res.status(400).json({
                    success: false,
                    message: "Validation Error",
                    errors: formattedErrors,
                });
            }
            next(error);
        }
    };
};

module.exports = validateRequest;

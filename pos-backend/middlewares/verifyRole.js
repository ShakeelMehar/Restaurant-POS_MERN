const createHttpError = require("http-errors");

const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            const error = createHttpError(401, "User not authenticated!");
            return next(error);
        }

        if (!allowedRoles.includes(req.user.role)) {
            const error = createHttpError(403, "Forbidden: You don't have enough permissions!");
            return next(error);
        }

        next();
    };
};

module.exports = { checkRole };

const config = require("../config/config");

const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || "Internal Server Error";

    // Operational/Explicit HTTP Errors are safe to return
    const isOperational = !!(err.statusCode || err.status);

    if (config.nodeEnv === "production") {
        if (err.name === "ValidationError") {
            statusCode = 400;
            message = Object.values(err.errors).map(val => val.message).join(", ");
        } else if (err.code === 11000) {
            statusCode = 400;
            // Parse duplicate key name dynamically
            const keyName = err.keyValue ? Object.keys(err.keyValue)[0] : "record";
            message = `A ${keyName} with that value already exists.`;
        } else if (err.name === "CastError") {
            statusCode = 400;
            message = `Invalid format for field: ${err.path}`;
        } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            statusCode = 401;
            message = "Invalid or expired session token. Please login again.";
        } else if (!isOperational) {
            // General unhandled server error
            message = "Something went wrong. Please try again later.";
        }
    }

    return res.status(statusCode).json({
        status: statusCode,
        message,
        errorStack: config.nodeEnv === "development" ? err.stack : ""
    });
};

module.exports = globalErrorHandler;
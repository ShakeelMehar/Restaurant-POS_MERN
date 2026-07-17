require("dotenv").config();

const { z } = require("zod");

const envSchema = z.object({
    PORT: z.string().optional().default("3000"),
    MONGODB_URI: z.string().url().optional().default("mongodb://localhost:27017/pos-db"),
    NODE_ENV: z.enum(["development", "production", "test"]).optional().default("development"),
    JWT_SECRET: z.string({
        required_error: "JWT_SECRET is required",
        invalid_type_error: "JWT_SECRET must be a string",
    }).min(1, "JWT_SECRET cannot be empty"),
    RAZORPAY_KEY_ID: z.string().optional(),
    RAZORPAY_KEY_SECRET: z.string().optional(),
    RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
});

// Parse the environment variables; this will throw a detailed error if validation fails
const envVars = envSchema.parse(process.env);

const config = Object.freeze({
    port: envVars.PORT,
    databaseURI: envVars.MONGODB_URI,
    nodeEnv: envVars.NODE_ENV,
    accessTokenSecret: envVars.JWT_SECRET,
    razorpayKeyId: envVars.RAZORPAY_KEY_ID,
    razorpaySecretKey: envVars.RAZORPAY_KEY_SECRET,
    razorpyWebhookSecret: envVars.RAZORPAY_WEBHOOK_SECRET
});

module.exports = config;

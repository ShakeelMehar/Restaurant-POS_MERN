const express = require("express");
const connectDB = require("./config/database");
const config = require("./config/config");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const app = express();


const PORT = config.port;
connectDB();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit each IP to 5 requests per 10 minutes
    message: { message: "Too many login attempts, please try again after 10 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middlewares
app.use(helmet());

// Health check — registered BEFORE the rate limiter: clients poll this every ~30s
// to verify real API reachability (navigator.onLine only reports an interface).
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use(limiter);
app.use(compression());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
}))
app.use(express.json()); // parse incoming request in json format
app.use(cookieParser())


// Root Endpoint
app.get("/", (req,res) => {
    res.json({message : "Hello from POS Server!"});
})

// Other Endpoints
app.use("/api/user/login", loginLimiter);
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));
app.use("/api/category", require("./routes/categoryRoute"));
app.use("/api/product", require("./routes/productRoute"));
app.use("/api/report", require("./routes/reportRoute"));
app.use("/api/settings", require("./routes/settingsRoute"));
app.use("/api/admin", require("./routes/restaurantRoute"));

// Global Error Handler
app.use(globalErrorHandler);


// Server
app.listen(PORT, () => {
    console.log(`☑️  POS Server is listening on port ${PORT}`);
})
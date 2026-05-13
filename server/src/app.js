import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { ApiError } from "./utils/ApiError.js";

const app=express()

app.use(cors({
    credentials:true,
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ["http://localhost:5173", "http://localhost:5174"]
}))

// Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
    max: process.env.NODE_ENV === 'production' ? 100 : 1000,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again in an hour!',
    skip: (req) => {
        const ip = req.ip || req.connection.remoteAddress;
        return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
    }
});
app.use('/api', limiter);

app.use(express.json({ limit: "16kb" }))
app.use(express.static('public'))
app.use(express.urlencoded({extended:true, limit: "16kb"}))
app.use(cookieParser())


import userRoutes from './routes/user.routes.js'
import healthcheckRouter from './routes/healthcheck.routes.js';
import eventRouter from './routes/event.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import chatRouter from './routes/chat.routes.js';

app.use('/api/v1/users',userRoutes)
app.use("/api/v1/healthcheck", healthcheckRouter)   
app.use("/api/v1/events", eventRouter)   
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/chat", chatRouter)

// Global Error Handler
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }

    // Default error
    return res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});


export {app};
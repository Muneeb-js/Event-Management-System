import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express()


app.use(cors({
    credentials:true,
    origin:"http://localhost:5173"
}))

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


import userRoutes from './routes/user.routes.js'
import healthcheckRouter from './routes/healthcheck.routes.js';
import eventRouter from './routes/event.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';

app.use('/api/v1/users',userRoutes)
app.use("/api/v1/healthcheck", healthcheckRouter)   
app.use("/api/v1/events", eventRouter)   
app.use("/api/v1/dashboard", dashboardRouter)


export {app};
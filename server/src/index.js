import { createServer } from "http";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { initSocket } from "./socket.js";

dotenv.config({
    path:"./.env"
})

const server = createServer(app);
initSocket(server);

connectDB()
.then(()=>{
    server.listen(process.env.PORT || 8000,()=>{
        console.log("Server is running at port ", process.env.PORT || 8000)
    })
}
)
.catch((err)=>{
    console.log('mongoDb connection failed ',err)
})
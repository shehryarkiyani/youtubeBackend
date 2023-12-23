import dotenv from "dotenv"
import ConnectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({path:"./env"})

ConnectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server running at port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("mongodb connection failed")
})
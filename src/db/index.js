import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";

const ConnectDB = async()=>{
    try{
      const response = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
      console.log(`mongo connect on host ${response.connection.host}`)
    }catch(err){
        process.exit(1);
    }
}
export default ConnectDB
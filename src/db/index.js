import express from "express";
import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";


async function connectDB() {
  try {
    const connectionIntance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\n Mongodb connected !! DB HOST:${connectionIntance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection error", error);
    process.exit(1);
  }
}

export default connectDB;


// (async ()=>{
//   try{
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     app.on("error",(error)=>{
//       console.log("ERRR:",error);

//     })

//     app.listen(process.env.PORT,()=>{
//       console.log(`App is listening on port ${process.env.PORT}`);
//     })

// }
// catch(error){
//   console.log("ERROR:",error);
//   throw err;
// }
// })()
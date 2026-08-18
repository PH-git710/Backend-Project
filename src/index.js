import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path:"./env"
})

//require('dotenv').config({path:'./env'})


const app = express();

connectDB()
.then(()=>{
  app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port:${process.env.PORT}`);
  })

})
.catch((err)=>{
  console.log("MONGODB connrction failed" ,err);
})










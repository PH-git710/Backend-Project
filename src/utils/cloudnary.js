import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async(localFilePath) =>{
  try{
    if (!localFilePath) return null;
    // Upload image to cloudinary
   const response = await cloudinary.uploader.upload(localFilePath,{
      resource_type: "auto"
    });
console.log("file is uploaded on cloudinary");
return response;
     }catch(error){
        fs.unlinkSync(localFilePath) 
       //remove the locally temporary file as the upload operation got failed
        return null;
     }
}


cloudinary.v2.uploader.upload(
  "https://picsum.photos/seed/picsum/200/300",
  {
    public_id: "olympic_flag",
  },
  function (erroe, result) {
    console.log(result);
  },
);



export {uploadOnCloudinary}
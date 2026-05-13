import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import 'dotenv/config';
import { ApiError } from "./ApiError.js";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary=async (localFilePath)=>{
    try{
        if(!localFilePath)return null
        const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        })
        if(!response) throw new ApiError(400,"Response is empty")
        fs.unlinkSync(localFilePath)
        return response
    }catch(error){

        return null
    }
}
const deleteFromCloudinary=async(localFilePath)=>{
        
    try {
        let new_url=localFilePath.split('/').pop()
        localFilePath=new_url.split('.')[0]
        if (!localFilePath) throw new ApiError(400,"Path not Available")
        const response=await cloudinary.uploader.destroy(localFilePath,(error,result)=>{
            console.log(error,result)
    })
        return response
    } catch (error) {
        return null
    }
}

export {uploadOnCloudinary,deleteFromCloudinary}
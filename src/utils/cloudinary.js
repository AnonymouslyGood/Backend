import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const upload = async (localPath) => {
    try{
        if(!localPath) return null

        //upload file on cloudinary
        const uploadResult = await cloudinary.uploader
        .upload(localPath, {resource_type: "auto"})
        .catch((error) => {
            console.log(error);
        });

        fs.unlinkSync(localPath)

        return uploadResult
 
    }catch (error){
        fs.unlinkSync(localPath);
        return null;
    }
}

export { upload }
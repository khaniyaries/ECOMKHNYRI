import { v2 as cloudinary } from 'cloudinary';

const cloudinaryConfig = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_CLOUD_API,
    apiSecret: process.env.CLOUDINARY_CLOUD_API_SECRECT
  };

cloudinary.config({
    cloud_name: cloudinaryConfig.cloudName,
    api_key: cloudinaryConfig.apiKey,
    api_secret: cloudinaryConfig.apiSecret
});

export const deleteImages = async (publicIds) => {
    try {
        const result = await cloudinary.api.delete_resources(publicIds, {
            type: 'upload', 
            resource_type: 'image'
        });

        console.log("Delete result:", result);
        return result;
    } catch (error) {
        console.error("Error deleting images:", error);
        throw new Error('Failed to delete images from Cloudinary');
    }
};
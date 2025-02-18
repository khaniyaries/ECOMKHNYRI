import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: "daqh8noyb",
    api_key: "857738445194783",
    api_secret: "b0kW2Cd6tZtd0FcTH22ejgwUA9E"
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
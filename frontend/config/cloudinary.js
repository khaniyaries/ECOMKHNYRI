import { Cloudinary } from "@cloudinary/url-gen";
import { env } from "./config";
const cloudinaryConfig = {
  cloudName: env.CLOUDINARY_NAME,
  apiKey: env.CLOUDINARY_API,
  apiSecret: env.CLOUDINARY_API_SECRET
};

const cld = new Cloudinary({
  cloud: {
    cloudName: cloudinaryConfig.cloudName,
    apiKey: cloudinaryConfig.apiKey,
    apiSecret: cloudinaryConfig.apiSecret
  }
});

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'yarees_upload');

  const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
          method: 'POST',
          body: formData
      }
  );

  const data = await response.json();
  return data.secure_url;  // Return just the URL string
};

  

export const deleteFromCloudinary = async (imageUrls) => {
  try {
      // Convert single URL to array if needed
      const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
      
      const response = await fetch('http://localhost:8080/api/v1/delete-images', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ imageUrls: urls })
      });

      const data = await response.json();
      return data.success;
  } catch (error) {
      console.log('Cloudinary deletion error:', error);
      return false;
  }
};


  

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("No filepath provided for upload");
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'sitverse/profiles',
      resource_type: 'auto',
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };

  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error(error?.message || "Failed to upload file to Cloudinary");
  }
};

const uploadPostImageOnCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("No filepath provided for upload");
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'sitverse/posts',
      resource_type: 'auto',
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };

  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error(error?.message || "Failed to upload file to Cloudinary");
  }
};

const uploadPDFOnCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("No filepath provided for upload");
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'sitverse/resources',
      resource_type: 'raw', // For non-image files like PDFs
      type: 'upload', // Explicit upload type
      access_mode: 'public', // Ensure public access
    });

    // Generate a signed URL that bypasses Cloudinary restrictions
    const signedUrl = cloudinary.url(result.public_id, {
      resource_type: 'raw',
      type: 'upload',
      sign_url: true,
      secure: true,
    });

    return {
      url: signedUrl, // Use signed URL instead of regular URL
      secure_url: result.secure_url,
      public_id: result.public_id,
      signed_url: signedUrl,
    };

  } catch (error) {
    console.error("Cloudinary PDF Upload Error:", error);
    throw new Error(error?.message || "Failed to upload PDF to Cloudinary");
  }
};

const deleteFromCloudinary = async (public_id) => {
  try {
    if (!public_id) {
      throw new Error("No public_id provided for deletion");
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: 'image',
    });

    return result;

  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw new Error(error?.message || "Failed to delete file from Cloudinary");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary , uploadPostImageOnCloudinary, uploadPDFOnCloudinary };
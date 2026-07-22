/**
 * cloudinary.ts
 * --------------------------------------------------------------
 * Wraps the Cloudinary SDK so the rest of the app can just call
 * `uploadImage(base64String)` without worrying about credentials
 * or configuration.
 *
 * Images are uploaded into a "hostelhub" folder so they are easy
 * to find in the Cloudinary dashboard.
 * --------------------------------------------------------------
 */
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(base64Image: string, folder = "hostelhub/complaints") {
  const result = await cloudinary.uploader.upload(base64Image, {
    folder,
    resource_type: "image",
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

export const uploadImageBase64 = (image, fileName) => {
  //imgage = > base64
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      image,
      {
        overwrite: true,
        invalidate: true,
        resource_type: "auto",
        folder: "tseklis/entities/logos",
        public_id: fileName,
      },
      (error, result) => {
        if (result && result.secure_url) {
          return resolve(result.secure_url);
        }
        console.log(error.message);
        return reject({ message: error.message });
      }
    );
  });
};

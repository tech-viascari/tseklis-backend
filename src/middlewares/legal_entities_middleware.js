import { uploadImageBase64 } from "../utils/cloudinary.js";

export const legalEntityMiddleware = (req, res, next) => {
  next();
};

export const uploadLogoMiddleware = async (req, res, next) => {
  const { entity_logo, entity_details } = req.body;

  let upload = await uploadImageBase64(
    entity_logo,
    entity_details.company_name
  );

  if (upload) {
    req.entity_logo = upload;
    next();
  } else {
    return res.status(500).json({
      status: "failed",
      err: "Failed to upload the image.",
    });
  }
};

export const legalEntityMiddleware = (req, res, next) => {
  console.log("Legal Entity Middleware");
  next();
};

export const uploadLogoMiddleware = (req, res, next) => {
  console.log("Upload Logo Middleware");
  req.entity_logo = "testing logo URL";
  next();
};

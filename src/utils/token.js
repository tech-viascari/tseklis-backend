import jwt from "jsonwebtoken";

const encodeToken = (key, value, expiresIn = "30d") => {
  const token = jwt.sign({ [key]: value }, process.env.SECRET_KEY, {
    // expiresIn: "30d",
    expiresIn,
  });
  return token;
};
const decodeToken = (token) => {
  let decodedToken = null;
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (!err) {
      decodedToken = decoded;
    }
  });
  return decodedToken;
};

const old_decodeToken = (token) => {
  let decodedToken = null;
  token = token.split(" ")[1];
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (!err) {
      decodedToken = decoded;
    }
  });
  return decodedToken;
};

export { encodeToken, decodeToken };

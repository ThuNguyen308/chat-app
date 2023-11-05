import jwt from "jsonwebtoken";

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20d",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "365d",
  });
};

export { generateAccessToken, generateRefreshToken };

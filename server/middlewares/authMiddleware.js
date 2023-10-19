import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const requireSignIn = async (req, res, next) => {
  try {
    let token;

    if (!req.headers.authorization.startsWith("Bearer")) {
      return res
        .status(401)
        .send({ success: false, message: "Token is required" });
    }

    token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "Token is invalid" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Auth failed" });
  }
};

export default requireSignIn;

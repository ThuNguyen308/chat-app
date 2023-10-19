import generateToken from "../config/generateToken.js";
import { comparePassword, hashPassword } from "../helpers/authHelpers.js";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

//@description     User register account
//@route           POST /api/user/register
//@access          Public
const registerController = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
      return res
        .status(500)
        .send({ success: false, message: "Please fill all field" });
    }

    //if email exist in DB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(500)
        .send({ success: false, message: "User already exists." });
    }

    const newUser = await User.create({
      name,
      email,
      password: await hashPassword(password),
      pic,
    });

    res.status(201).send({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Register failed" });
  }
};

//@description     User login
//@route           POST /api/user/login
//@access          Public
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .send({ success: false, message: "Please fill all field" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "Email is not registered" });
    }

    const isSamePassword = await comparePassword(password, user?.password);
    if (!isSamePassword) {
      return res
        .status(401)
        .send({ success: false, message: "Password is wrong" });
    }

    const token = generateToken(user._id);
    res.status(201).send({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        pic: user.pic,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Login failed" });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    const existUser = await User.findOne({ email: email });
    if (!existUser) {
      return res
        .status(500)
        .send({ success: false, message: "Email is not registed" });
    }

    const secret = process.env.JWT_SECRET + existUser.password;
    const token = jwt.sign(
      { id: existUser._id, email: existUser.email },
      secret,
      { expiresIn: "5m" }
    );

    const link = `http://localhost:5000/api/user/reset-password/${existUser._id}/${token}`;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL_ACCOUNT,
      to: existUser.email,
      subject: "Password Reset for Let's Talk",
      html: `<!doctype html>
        <html ⚡4email>
          <head>
            <meta charset="utf-8">
            <style amp4email-boilerplate>body{visibility:hidden}</style>
          </head>
          <body>
            <p style="text-align: center;"><img src="https://res.cloudinary.com/dibyfkull/image/upload/v1697683378/logo_wc4yhx.png" width="40" height="40"/></p>
            <p fontSize="50" width="16">Hello ${existUser.name},</p>
            <p><b>A request has been recieved to change the password for your Let's Talk account</b></p>
            <a href=${link} style="
                display: inline-block;
                padding: 10px 20px;
                background: #0000f9cc;
                color: #fff;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                margin: 10px;
                ">
                Reset password
            </a>
            <p>If you did not initiate this request, please contact us immediately at <a href="mailto:thunguyenthiminh192@gmail.com">thunguyenthiminh192@gmail.com</a>.</p>
            <p>Thank you,</p>
            <p>Let's Talk Team</p>
          </body>
        </html>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(500).json({ msg: "Email sent failed" });
        console.log(error);
      } else {
        res.status(201).json({ msg: "Email sent" });
        console.log("Email sent: " + info.response);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const getResetPasswordController = async (req, res) => {
  try {
    const { id, token } = req.params;
    let existUser;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      existUser = await User.findById(id);
    }
    if (!existUser) {
      return res.send("User not found");
    }

    const secret = process.env.JWT_SECRET + existUser.password;
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not verified" });
  } catch (err) {
    console.log(err);
    res.send("Not verified");
  }
};

const postResetPasswordController = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;
    console.log(password);
    let existUser;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      existUser = await User.findById(id);
    }
    if (!existUser) {
      return res.send("User not found");
    }

    const secret = process.env.JWT_SECRET + existUser.password;
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await hashPassword(password);

    await User.updateOne(
      { _id: id },
      { $set: { password: encryptedPassword } }
    );

    // res
    // .status(200)
    // .json({ message: "Password resetted" });
    res.render("index", { email: verify.email, status: "verified" });
  } catch (err) {
    console.log(err);
    res.send("Somgthing wrong when update password");
  }
};

const searchUsersController = async (req, res) => {
  try {
    const { keyword } = req.params;

    let users = [];
    if (keyword) {
      users = await User.find({
        $or: [
          { name: { $regex: keyword ?? "", $options: "i" } },
          { email: { $regex: keyword ?? "", $options: "i" } },
        ],
      })
        .find({ _id: { $ne: req.user._id } })
        .select("-password");
    }

    res.status(200).send({ success: true, users });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Fetch users failed" });
  }
};

export {
  registerController,
  loginController,
  searchUsersController,
  resetPasswordController,
  getResetPasswordController,
  postResetPasswordController,
};

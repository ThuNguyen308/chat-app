import generateToken from "../config/generateToken.js";
import { comparePassword, hashPassword } from "../helpers/authHelpers.js";
import User from "../models/UserModel.js";

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

export { registerController, loginController, searchUsersController };

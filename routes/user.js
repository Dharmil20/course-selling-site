const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const { UserModel, PurchaseModel } = require("../db.js");
const { z } = require("zod");
const { UserAuth } = require("../middlewares/user");

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.post("/signup", async (req, res) => {
  const requiredBody = z.object({
    email: z.string().min(3).max(30).email(),
    name: z.string().min(3).max(30),
    password: z
      .string()
      .min(8)
      .max(30)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d@$!%*?&]{8,30}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  });

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);

  if (!parsedDataWithSuccess) {
    res.json({
      message: "Incorrect format",
      error: parsedDataWithSuccess.error,
    });
    return;
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(password, 5);

  try {
    await UserModel.create({
      email: email,
      password: hashedPassword,
      name: name,
    });
    res.json({
      message: "User Signed Up!",
    });
  } catch (e) {
    res.json({
      message: "User Already Signed up!",
    });
  }
});

userRouter.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await UserModel.findOne({ email: email });

  if (!user) {
    return res.status(404).json({
      message: "User not signed up!",
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({
      message: "Invalid Credentials",
    });
  }

  const token = jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_USER_PASSWORD
  );

  // Set the cookie with the token
  res.cookie("token", token, {
    httpOnly: true, // Prevents client-side access to the cookie
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "strict", // Helps prevent CSRF attacks
  });

  res.json({
    message: "Logged in successfully",
    token: token,
  });
});

userRouter.get("/purchases", UserAuth, async (req, res) => {
  const token = req.cookies.token; // Get the token from the cookies

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_USER_PASSWORD);
    const userId = decoded.userId;

    const purchases = await PurchaseModel.find({ userId });
    res.json({
      purchases,
    });
  } catch (e) {
    res.status(401).json({
      message: "Invalid Token Provided",
    });
  }
});

module.exports = {
  userRouter: userRouter,
};
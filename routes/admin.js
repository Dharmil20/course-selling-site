const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const { z } = require("zod");
const adminRouter = express.Router();
const { AdminModel, CourseModel } = require("../db.js");
const { AdminAuth } = require("../middlewares/admin");
adminRouter.use(express.json());

adminRouter.post("/signup", async (req, res) => {
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
    const admin = await AdminModel.create({
      email: email,
      password: hashedPassword,
      name: name,
    });
    res.json({
      message: "User Signed Up!",
      creatorId: admin,
    });
  } catch (e) {
    res.json({
      message: "User Already Signed up!",
    });
  }
});

adminRouter.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const admin = await AdminModel.findOne({ email });

  if (!admin) {
    return res.status(404).json({
      message: "User not signed up!",
    });
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);

  if (!passwordMatch) {
    return res.status(401).json({
      message: "Invalid Credentials",
    });
  }

  try {
    const token = jwt.sign(
      { userId: admin._id.toString() },
      process.env.JWT_ADMIN_PASSWORD
    );

    // Set the token in an HTTP-only cookie
    res.cookie("adminToken", token, {
      httpOnly: true, // Prevents client-side access to the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "strict", // Helps prevent CSRF attacks
    });

    res.json({
      message: "Logged in successfully",
      token: token,
    });
  } catch (e) {
    res.status(500).json({
      message: "Error signing in",
      error: e.message,
    });
  }
});

adminRouter.post("/", AdminAuth, async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const image = req.body.image;

  try {
    const course = await CourseModel.create({
      title,
      description,
      price,
      image,
      creatorId,
    });
    res.json({
      message: "Course Added Successfully!",
      courseId: course._id,
    });
  } catch (e) {
    res.status(403).json({
      message: "Course not Added!",
    });
  }
});

adminRouter.put("/", AdminAuth, async (req, res) => {
  const courseId = req.body.courseId;
  const adminId = req.userId;

  try {
    await CourseModel.updateOne(
      {
        _id: courseId,
        creatorId: adminId,
      },
      {
        title,
        description,
        image,
        price,
      }
    );
    res.json({
      message: "Price of the course updated successfully",
    });
  } catch (e) {
    res.status(403).json({
      message: "Updation Failed",
    });
  }
});

adminRouter.get("/course/bulk", AdminAuth, async (req, res) => {
  const creatorId = req.body.creatorId;

  try {
    const courses = await CourseModel.find({ creatorId });

    res.json({ courses });
  } catch (e) {
    res.json({
      message: "No such creator found!",
    });
  }
});

module.exports = {
  adminRouter: adminRouter,
};

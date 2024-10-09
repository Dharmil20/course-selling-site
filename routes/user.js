const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "randomdharmillovescoding";
const { default: mongoose } = require("mongoose");
const { UserModel, PurchaseModel } = require("../db.js");
const { z } = require("zod");
const app = express();

app.use(express.json());

const userRouter = express.Router();

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

  const user = await UserModel.findOne({
    email: email,
  });

  if (!user) {
    res.json({
      message: "User not signed up!",
    });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  try {
    if (passwordMatch) {
      const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET);
      res.json({
        token: token,
      });
    }
  } catch (e) {
    res.json({
      message: "Invalid Credentials",
    });
  }
});

userRouter.get("/purchases", auth, async (req, res) => {
  const userId = req.userId;

  try{
    const purchases = await PurchaseModel.find({userId,});
    res.json({
      purchases
    })
  } catch(e){
    res.json({
      message: "Invalid TOken Provided"
    })
  }
});

function auth(req, res, next) {
  const token = req.body.token;
  const decodedData = jwt.verify(token, JWT_SECRET);

  if(decodedData){
    req.userId = decodedData.id;
    next();
  } else{
    res.status(403).json({
      message: "Invalid Credentials"
    })
  }
}
module.exports = {
  userRouter: userRouter,
};

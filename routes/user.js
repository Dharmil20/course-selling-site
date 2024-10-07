const express = require("express");

const userRouter = express.Router();

userRouter.post("/signup", (req, res) => {});

userRouter.post("/login", (req, res) => {});

userRouter.get("/purchases", (req, res) => {});

module.exports = {
  userRouter: userRouter,
};

const express = require("express");

const courseRouter = express.Router();

courseRouter.post("/purchase", (req, res) => {});

courseRouter.get("/preview", (req, res) => {});

module.exports = {
  courseRouter: courseRouter,
};

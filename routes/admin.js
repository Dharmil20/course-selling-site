const express = require("express");
const adminRouter = express.Router();
const { AdminModel,CourseModel } = require("../db.js")

adminRouter.post("/signup", (req, res) => {});
adminRouter.post("/signin", (req, res) => {});
adminRouter.post("/course", (req, res) => {});
adminRouter.put("/course", (req, res) => {});
adminRouter.get("/course/bulk", (req, res) => {});

module.exports = {
    adminRouter: adminRouter,
}

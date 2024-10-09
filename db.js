const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL);

const User = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const Admin = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const Course = new Schema({
  title: String,
  description: String,
  price: Number,
  imageURL: String,
  creatorId: {type: ObjectId, ref: "admin"},
});

const Purchase = new Schema({
  userId: { type: ObjectId, ref: "users" },
  courseId: { type: ObjectId, ref: "courses" },
});

const UserModel = mongoose.model("users", User);
const PurchaseModel = mongoose.model("purchases", Purchase);
const AdminModel = mongoose.model("admin", Admin);
const CourseModel = mongoose.model("courses", Course);

module.exports = {
  UserModel,
  PurchaseModel,
  AdminModel,
  CourseModel,
};

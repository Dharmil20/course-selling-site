const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.schema;
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
  creatorId: ObjectId,
});

const Purchase = new Schema({
  userId: { type: ObjectId, ref: User },
  courseId: { type: ObjectId, ref: Admin },
});

const UserModel = mongoose.model("users", User);
const PurchaseModel = mongoose.model("purchases", Purchase);
const AdminModel = mongoose.model("admin", Admin);
const CourseModel = mongoose("courses", Course);

module.exports = {
  UserModel,
  PurchaseModel,
  AdminModel,
  CourseModel,
};

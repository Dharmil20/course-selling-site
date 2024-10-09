const mongoose = require("mongoose");
const { number } = require("zod");

const Schema = mongoose.schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: {type: String, required: true},
});

const Purchase = new Schema({
    userId: ObjectId,
    courseId: ObjectId,
})

const Admin = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: {type: String, required: true},
})

const Course = new Schema({
    title: String,
    description: String,
    price: Number,
    imageURL: String,
    creatorId: ObjectId,
})

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

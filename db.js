const mongoose = require("mongoose");

const Schema = mongoose.schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: {type: String, required: true},
});

const Purchase = new Schema({
    userId: ObjectId,
    name: String,
    course: String,
    timePurchased: String,
})

const UserModel = mongoose.model("users", User);
const PurchaseModel = mongoose.model("purchases", Purchase);

module.exports = {
  UserModel,
  PurchaseModel,
};

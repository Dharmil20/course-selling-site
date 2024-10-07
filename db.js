const mongoose = require("mongoose");

const Schema = mongoose.schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
})
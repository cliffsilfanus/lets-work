// import mongoose from "mongoose";
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: [{ type: Date }],
  people: [{ type: String }],
  status: { type: String },
  priority: { type: String }
  // components: [
  //   {
  //     component: {
  //       type: String,
  //       enum: ["Date", "People", "Status", "Priority", "Tags"],
  //       required: true
  //     },
  //     date: { type: Date },
  //     // people: { type: mongoose.Schema.ObjectId, ref: "User" },
  //     users: [String],
  //     info: { type: String },
  //     tag: { type: String }
  //   }
  // ]
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

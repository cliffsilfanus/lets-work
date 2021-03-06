// import mongoose from "mongoose";
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  headers: [
    {
      type: String,
      enum: ["Date", "People", "Status", "Priority" /* , "Tag" */],
      required: true
    }
  ],
  tasks: [{ type: mongoose.Schema.ObjectId, ref: "Task" }]
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;

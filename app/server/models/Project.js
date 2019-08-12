import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.ObjectId, ref: "Task" }]
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;

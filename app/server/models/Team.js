import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  projects: [{ type: mongoose.Schema.ObjectId, ref: "Project" }]
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;

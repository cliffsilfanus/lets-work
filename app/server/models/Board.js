// import mongoose from "mongoose";
const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.ObjectId, ref: "User" },
  users: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  projects: [{ type: mongoose.Schema.ObjectId, ref: "Project" }]
});

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;

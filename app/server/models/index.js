// import User from "./User";
// import Board from "./Board";
// import Project from "./Project";
// import Task from "./Task";
// import mongoose from "mongoose";

const User = require("./User");
const Board = require("./Board");
const Project = require("./Project");
const Task = require("./Task");
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
  useNewUrlParser: true
});

module.exports = { User, Board, Project, Task };

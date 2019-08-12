import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: {
    first: { type: String, required: true, trim: true },
    last: { type: String, required: true, trim: true }
  },
  name: { type: String, required: true },
  components: [
    {
      component: {
        type: String,
        enum: ["Date", "People", "Status", "Priority", "Tags"],
        required: true
      },
      date: { type: Date },
      people: { type: mongoose.Schema.ObjectId, ref: "User" },
      info: { type: String },
      tag: { type: String }
    }
  ]
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

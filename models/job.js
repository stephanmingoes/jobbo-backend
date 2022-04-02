const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  title: { type: String, required: true },

  company: { type: String, required: true },
  location: { type: String, required: true },
  date: { required: true, type: Date, default: new Date() },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    required: true,
  },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;

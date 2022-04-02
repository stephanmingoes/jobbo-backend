const { default: mongoose } = require("mongoose");
const Job = require("../models/job");

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.uid });
    res.status(200).json({ status: "success", data: jobs });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      message: "Oops, something went wrong. Try again later",
    });
  }
};

const getJob = async (req, res) => {
  const id = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(404)
        .json({ status: "error", message: "Job not found" });

    const job = await Job.findById(id);
    res.status(200).json({ status: "success", data: job });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      message: "Oops, something went wrong. Try again later",
    });
  }
};

const createJob = async (req, res) => {
  const job = req.body;
  try {
    const newJob = await Job.create({
      ...job,
      user: req.uid,
      date: new Date().toISOString(),
    });

    res.status(201).json({ status: "success", data: newJob });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      message: "Oops, something went wrong. Try again later",
    });
  }
};

const updateJob = async (req, res) => {
  const { title, company, location, status } = req.body;
  const id = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(404)
        .json({ status: "error", message: "Job not found" });
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        title,
        company,
        location,
        status,
      },
      { new: true }
    );
    res.status(200).json({ status: "success", data: updatedJob });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      message: "Oops, something went wrong. Try again later",
    });
  }
};

const deleteJob = async (req, res) => {
  const id = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(404)
        .json({ status: "error", message: "Job not found" });

    const deletedJob = await Job.findByIdAndDelete(id);
    res.status(200).json({ status: "success", data: deletedJob });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      message: "Oops, something went wrong. Try again later",
    });
  }
};

module.exports = { getJobs, createJob, updateJob, deleteJob, getJob };

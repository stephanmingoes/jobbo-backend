const { Router } = require("express");
const router = Router();
const {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  getJob,
} = require("../controllers/jobs");
const auth = require("../middleware/auth");

router.get("/", auth, getJobs);
router.get("/:id", auth, getJob);
router.post("/", auth, createJob);
router.patch("/:id", auth, updateJob);
router.delete("/:id", auth, deleteJob);

module.exports = router;

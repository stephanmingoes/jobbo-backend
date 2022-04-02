const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const jobRouter = require("./routes/jobs");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// const corsOptions = {
//   origin: "http://localhost:3000",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
app.use(cors());

app.get("/", (req, res) => {
  res.send("Severs is running");
});
app.use("/api/user", userRouter);
app.use("/api/jobs", jobRouter);
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@jobs.pjs2d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const databaseConfigurations = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(uri, databaseConfigurations)
  .then((res) =>
    app.listen(port, () => console.log(`Server is running on port ${port}`))
  )
  .catch((e) => console.log(e.message));

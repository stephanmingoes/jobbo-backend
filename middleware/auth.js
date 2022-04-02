const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];

    if (token) {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      req.uid = decodedData.id;
      next();
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = auth;

const express = require("express");
const {
  compareFutures,
} = require("../controllers/compareController");

const router = express.Router();

router.post("/", compareFutures);

module.exports = router;
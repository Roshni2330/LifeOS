const express = require("express");
const {
  butterflyEffect,
} = require("../controllers/butterflyController");

const router = express.Router();

router.post("/recalculate", butterflyEffect);

module.exports = router;
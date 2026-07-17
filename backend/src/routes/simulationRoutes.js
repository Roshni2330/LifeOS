const express = require("express");

const {

generateSimulation

} = require("../controllers/simulationController");

const router = express.Router();

router.post(

"/generate",

generateSimulation

);

module.exports = router;
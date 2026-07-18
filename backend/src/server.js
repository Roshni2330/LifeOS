const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const butterflyRoutes = require("./routes/butterflyRoutes");
dotenv.config();
const compareRoutes = require("./routes/compareRoutes");
const aiRoutes = require("./routes/aiRoutes");
const simulationRoutes = require("./routes/simulationRoutes");

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3000";

// ---------------------------
// Middlewares
// ---------------------------

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------
// Root Route
// ---------------------------

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 LifeOS Backend Running",
  });
});

// ---------------------------
// Health Route
// ---------------------------

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "Healthy",
    service: "LifeOS Backend",
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------
// Routes
// ---------------------------

app.use("/api/ai", aiRoutes);

app.use("/api/simulation", simulationRoutes);

app.use("/api/butterfly", butterflyRoutes);

app.use("/api/compare", compareRoutes);
// ---------------------------
// 404
// ---------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ---------------------------
// Error Handler
// ---------------------------

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

// ---------------------------
// Server
// ---------------------------

if (require.main === module) {
  app.listen(PORT, () => {
    console.log("====================================");
    console.log("LifeOS Backend Started");
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
    console.log("====================================");
  });
}

module.exports = app;
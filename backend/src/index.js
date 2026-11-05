import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, "0.0.0.0", (error) => {
  if (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
  console.log(`Backend is running on port ${PORT}`);
});

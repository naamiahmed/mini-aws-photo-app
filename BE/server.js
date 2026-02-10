const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const sequelize = require("./config/db");
const photoRoutes = require("./routes/photoRoutes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.put(
  "/uploads/:filename",
  express.raw({ type: "*/*", limit: "20mb" }),
  async (req, res) => {
    try {
      const safeName = path.basename(req.params.filename || "");
      if (!safeName) return res.status(400).json({ message: "Invalid filename" });

      const uploadsDir = path.join(__dirname, "uploads");
      await fs.promises.mkdir(uploadsDir, { recursive: true });

      const filePath = path.join(uploadsDir, safeName);
      await fs.promises.writeFile(filePath, req.body);

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      return res.status(200).json({ url: `${baseUrl}/uploads/${encodeURIComponent(safeName)}` });
    } catch (err) {
      console.error("Upload failed:", err);
      return res.status(500).json({ message: "Upload failed" });
    }
  }
);

app.use("/uploads", express.static("uploads"));

app.use("/api", photoRoutes);

sequelize.sync().then(() => {
  console.log("Database connected");
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});

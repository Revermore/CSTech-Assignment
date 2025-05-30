import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import AdminRoutes from "./routes/AdminRoutes.js";
import AgentsRoutes from "./routes/AgentsRoutes.js";
import DistributionRoutes from "./routes/DistributionRoutes.js";
import FileRoutes from "./routes/FileRoutes.js";
const app = express();

dotenv.config();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/admin", AdminRoutes);
app.use("/agent", AgentsRoutes);
app.use("/file", FileRoutes);
app.use("/distribution", DistributionRoutes);

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  console.log("meow");
});

try {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB Connected...");
} catch (err) {
  console.error("Database connection error:", err.message);
  process.exit(1);
}

app.listen(process.env.PORT, () => {
  console.log("Server up and running!");
});

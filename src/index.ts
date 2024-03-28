import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import morgan from "morgan";
import { v2 as cloudinary } from "cloudinary";
import myUserRoute from "./routes/MyUserRoutes";

/*
 * MONGODB CONNECTION
 */
mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

/*
 * CLOUDINARY CONFIGURATION
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

/*
 * Middlewares & Configurations
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/*
 * Logger Middleware
 */
app.use(morgan("combined"));

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "Health OK!" });
});

/*
 * Routes
 */
app.use("/api/my/user", myUserRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

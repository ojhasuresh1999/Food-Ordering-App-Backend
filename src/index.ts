import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import morgan from "morgan";
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

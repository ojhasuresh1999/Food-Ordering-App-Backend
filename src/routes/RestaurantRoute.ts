import express from "express";
import { param } from "express-validator";
import { searchRestaurants } from "../controllers/RestaurantController";

const router = express.Router();

router.get(
  "/search/:city",
  param("city").isString().trim().notEmpty().withMessage("City is required"),
  searchRestaurants
);

export default router;

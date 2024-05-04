import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const handleValiationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateMyUserRequest = [
  body("name")
    .isString()
    .notEmpty()
    .withMessage("Name is required and must be a string"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("Address is required and must be a string"),
  body("city")
    .isString()
    .notEmpty()
    .withMessage("City is required and must be a string"),
  body("country")
    .isString()
    .notEmpty()
    .withMessage("Country is required and must be a string"),

  handleValiationErrors,
];

export const validateMyRestaurantRequest = [
  body("restaurantName")
    .notEmpty()
    .withMessage("Restaurant name is required and must be a string"),
  body("city").notEmpty().withMessage("City is required and must be a string"),
  body("country")
    .notEmpty()
    .withMessage("Country is required and must be a string"),
  body("deliveryPrice")
    .isFloat({ min: 0 })
    .withMessage("Delivery price must be a positive number"),
  body("estimatedDeliveryTime")
    .isInt({ min: 0 })
    .withMessage("Estimated delivery time must be a positive number"),
  body("cuisines")
    .isArray()
    .withMessage("Cuisines must be an array")
    .not()
    .isEmpty()
    .withMessage("Cuisines must not be empty"),
  body("menuItems").isArray().withMessage("Menu items must be an array"),
  body("menuItems.*.name")
    .isString()
    .notEmpty()
    .withMessage("Menu item name is required and must be a string"),
  body("menuItems.*.price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  handleValiationErrors,
];

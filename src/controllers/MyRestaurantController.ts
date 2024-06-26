import { Request, Response } from "express";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Restaurant from "../models/restaurant";

const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ restaurant });
  } catch (error) {
    res.status(500).json({ message: "Failed to get restaurant" });
  }
};

const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Restaurant already exists" });
    }

    const uploadResponse = await uploadImage(req.file as Express.Multer.File);

    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = uploadResponse;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();
    await restaurant.save();
    res.status(201).json({ message: "Restaurant created", restaurant });
  } catch (error) {
    console.log("🚀 ~ createMyRestaurant ~ error:", error);
    res.status(500).json({ message: "Failed to create restaurant", error });
  }
};

const updateMyRestaurant = async (req: Request, res: Response) => {
  try {
    const retaurant = await Restaurant.findOne({ user: req.userId });
    if (!retaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    retaurant.restaurantName = req.body.restaurantName;
    retaurant.city = req.body.city;
    retaurant.country = req.body.country;
    retaurant.deliveryPrice = req.body.deliveryPrice;
    retaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    retaurant.cuisine = req.body.cuisine;
    retaurant.menuItems = req.body.menuItems;
    retaurant.lastUpdated = new Date();

    if (req.file) {
      const uploadResponse = await uploadImage(req.file as Express.Multer.File);
      retaurant.imageUrl = uploadResponse;
    }

    await retaurant.save();
    res.status(200).json({ message: "Restaurant updated", retaurant });
  } catch (error) {
    console.log("🚀 ~ updateMyRestaurant ~ error:", error);
    res.status(500).json({ message: "Failed to update restaurant" });
  }
};

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.secure_url;
};

export { createMyRestaurant, getMyRestaurant, updateMyRestaurant };

// const image = req.file as Express.Multer.File;
// const base64Image = Buffer.from(image.buffer).toString("base64");
// const dataURI = `data:${image.mimetype};base64,${base64Image}`;

// const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

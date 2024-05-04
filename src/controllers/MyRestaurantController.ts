import { Request, Response } from "express";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Restaurant from "../models/restaurant";

const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Restaurant already exists" });
    }
    const image = req.file as Express.Multer.File;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    console.log("Upload Response--", uploadResponse);

    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = uploadResponse.secure_url;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();
    await restaurant.save();
    res.status(201).json({ message: "Restaurant created", restaurant });
  } catch (error) {
    console.log("Error--", error);
    res.status(500).json({ message: "Failed to create restaurant" });
  }
};

export { createMyRestaurant };